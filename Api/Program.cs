using System.Collections.Concurrent;
using Api.Data;
using Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var loginAttempts = new ConcurrentDictionary<string, List<DateTime>>();
const int LoginMaxAttempts = 5;
const int LoginWindowMinutes = 15;

var rawConnectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(rawConnectionString))
    throw new InvalidOperationException("Configurez DATABASE_URL (Railway) ou ConnectionStrings:DefaultConnection (local).");
if (rawConnectionString.Contains("${{") || rawConnectionString.Contains("}}"))
    throw new InvalidOperationException(
        "DATABASE_URL contient une référence non résolue (${{...}}). Sur Railway, colle la vraie valeur de DATABASE_URL (depuis le service Postgres → Variables), pas la référence.");

var connectionString = rawConnectionString.Trim().TrimStart('\uFEFF');
if (connectionString.Length >= 2 && connectionString[0] == '"' && connectionString[connectionString.Length - 1] == '"')
    connectionString = connectionString.Substring(1, connectionString.Length - 2);
if (connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
    connectionString = "postgresql://" + connectionString.Substring(11);

if (connectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
{
    try
    {
        var uri = new Uri(connectionString);
        var userInfo = uri.UserInfo?.Split(':', 2) ?? Array.Empty<string>();
        var user = userInfo.Length > 0 ? userInfo[0] : "";
        var pass = userInfo.Length > 1 ? userInfo[1] : "";
        var db = uri.AbsolutePath.TrimStart('/');
        if (string.IsNullOrEmpty(db)) db = "railway";
        connectionString = $"Host={uri.Host};Port={uri.Port};Username={Uri.UnescapeDataString(user)};Password={Uri.UnescapeDataString(pass)};Database={Uri.UnescapeDataString(db)};SSL Mode=Prefer;Trust Server Certificate=true";
    }
    catch { }
}

builder.Services.AddDbContextFactory<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
    options.ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API Club Astro Véga", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return false;
                var uri = new Uri(origin);
                if (uri.Host == "localhost" || uri.Host == "127.0.0.1") return true;
                if (uri.Host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase)) return true;
                return uri.Host == "astro-perso.vercel.app";
            })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<GalleryService>();
builder.Services.AddSingleton<MeetingsService>();
builder.Services.AddSingleton<LinksService>();
builder.Services.AddSingleton<ContactService>();

var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Limite taille body (ex. upload galerie 10 Mo) — évite grosses allocations RAM
builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = 10 * 1024 * 1024);

var app = builder.Build();

// CORS sur toutes les réponses (y compris 500) pour que le navigateur n'affiche pas "CORS error" à la place du vrai message
static bool IsOriginAllowed(string? origin)
{
    if (string.IsNullOrEmpty(origin)) return false;
    try
    {
        var uri = new Uri(origin);
        if (uri.Host == "localhost" || uri.Host == "127.0.0.1") return true;
        if (uri.Host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase)) return true;
        return uri.Host == "astro-perso.vercel.app";
    }
    catch { return false; }
}

app.Use(async (context, next) =>
{
    var origin = context.Request.Headers.Origin.FirstOrDefault();
    if (IsOriginAllowed(origin))
        context.Response.OnStarting(() =>
        {
            if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
            {
                context.Response.Headers.Append("Access-Control-Allow-Origin", origin!);
                context.Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                context.Response.Headers.Append("Access-Control-Allow-Headers", "*");
            }
            return Task.CompletedTask;
        });
    await next();
});

// Appliquer les migrations au démarrage (avec retry si Postgres n'est pas encore prêt)
{
    const int maxAttempts = 10;
    const int delayMs = 2000;
    for (var attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<IDbContextFactory<AppDbContext>>().CreateDbContext();
            db.Database.Migrate();
            Console.WriteLine("[Startup] Migrations appliquées avec succès.");
            break;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Startup] Tentative {attempt}/{maxAttempts} - Migration échouée: {ex.Message}");
            if (attempt == maxAttempts)
            {
                Console.WriteLine("[Startup] Échec après " + maxAttempts + " tentatives. Arrêt de l'application.");
                throw;
            }
            Thread.Sleep(delayMs);
        }
    }
}

app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "Server error", message = ex.Message });
    }
});

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API Club Astro Véga v1"));
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

var uploadsPath = Path.Combine(app.Environment.ContentRootPath, "uploads");
Directory.CreateDirectory(uploadsPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});

bool IsAdmin(HttpRequest request)
{
    var key = builder.Configuration["Admin:ApiKey"];
    if (string.IsNullOrEmpty(key)) return true;
    return request.Headers.TryGetValue("X-Admin-Key", out var headerKey) && headerKey == key;
}

app.MapGet("/api/gallery", (GalleryService gallery) =>
{
    var images = gallery.GetAll();
    return Results.Ok(images.Select(img => new
    {
        id = img.Id,
        title = img.Title,
        description = img.Description,
        url = gallery.GetFileUrl(img.FileName),
        order = img.Order
    }));
});

app.MapPost("/api/gallery", async (HttpRequest request, GalleryService gallery, CancellationToken ct) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();

    if (!request.HasFormContentType || request.Form.Files.Count == 0)
        return Results.BadRequest("Aucun fichier envoyé.");

    var file = request.Form.Files[0];
    var title = request.Form["title"].FirstOrDefault();
    var added = await gallery.AddAsync(file, title, ct);
    if (added == null)
        return Results.BadRequest("Fichier non accepté ou type non autorisé.");

    return Results.Created($"/api/gallery/{added.Id}", new
    {
        id = added.Id,
        title = added.Title,
        description = added.Description,
        url = gallery.GetFileUrl(added.FileName),
        order = added.Order
    });
});

app.MapGet("/api/gallery/{id:guid}/file", (Guid id, GalleryService gallery) =>
{
    var file = gallery.GetFileContent(id);
    if (file == null) return Results.NotFound();
    return Results.File(file.Value.Content!, file.Value.ContentType ?? "application/octet-stream");
});

app.MapDelete("/api/gallery/{id:guid}", (Guid id, HttpRequest request, GalleryService gallery) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();

    if (!gallery.Delete(id))
        return Results.NotFound();

    return Results.NoContent();
});

app.MapGet("/api/gallery/hidden-static", (GalleryService gallery) =>
{
    var ids = gallery.GetHiddenStaticIds();
    return Results.Ok(ids);
});

app.MapPost("/api/gallery/hidden-static", (HiddenStaticRequest? body, HttpRequest request, GalleryService gallery) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (body?.Id == null)
        return Results.BadRequest("Id manquant.");
    gallery.HideStaticId(body.Id);
    return Results.NoContent();
});

app.MapDelete("/api/gallery/hidden-static/{id}", (string id, HttpRequest request, GalleryService gallery) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (!gallery.UnhideStaticId(id))
        return Results.NotFound();
    return Results.NoContent();
});

app.MapPatch("/api/gallery/reorder", (ReorderRequest? body, HttpRequest request, GalleryService gallery) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (body?.OrderedIds == null || body.OrderedIds.Count == 0)
        return Results.BadRequest("Liste d'IDs manquante.");
    if (!gallery.ReorderImages(body.OrderedIds))
        return Results.BadRequest("Impossible de réordonner : IDs invalides.");
    return Results.NoContent();
});

app.MapGet("/api/gallery/static-list", (GalleryService gallery) =>
{
    var list = gallery.GetStaticGalleryList();
    return Results.Ok(list.Select(x => new { id = x.Id, title = x.Title, url = x.Url }));
});

app.MapGet("/api/gallery/unified-order", (GalleryService gallery) =>
{
    var order = gallery.GetUnifiedOrder();
    return Results.Ok(order);
});

app.MapPatch("/api/gallery/unified-order", (UnifiedOrderRequest? body, HttpRequest request, GalleryService gallery) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (body?.OrderedIds == null)
        return Results.BadRequest("Liste d'IDs manquante.");
    gallery.SetUnifiedOrder(body.OrderedIds);
    return Results.NoContent();
});

app.MapGet("/api/meetings", (MeetingsService meetings) =>
{
    var list = meetings.GetAll();
    return Results.Ok(list.Select(m => new { id = m.Id, title = m.Title, description = m.Description, startDate = m.StartDate, endDate = m.EndDate }));
});

app.MapGet("/api/meetings/static", (MeetingsService meetings) =>
{
    var list = meetings.GetAllStatic();
    return Results.Ok(list.Select(m => new { id = m.Id, title = m.Title, description = m.Description, startDate = m.StartDate, endDate = m.EndDate }));
});

app.MapPost("/api/meetings", (MeetingCreateRequest? body, HttpRequest request, MeetingsService meetings) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (body?.Title == null || string.IsNullOrWhiteSpace(body.Title))
        return Results.BadRequest("Titre manquant.");
    var start = body.StartDate ?? DateTime.UtcNow;
    var end = body.EndDate ?? start.AddHours(2);
    var added = meetings.Add(body.Title, body.Description ?? "", start, end);
    return Results.Created($"/api/meetings/{added.Id}", new
    {
        id = added.Id,
        title = added.Title,
        description = added.Description,
        startDate = added.StartDate,
        endDate = added.EndDate
    });
});

app.MapPut("/api/meetings/{id:guid}", (Guid id, MeetingUpdateRequest? body, HttpRequest request, MeetingsService meetings) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (body?.Title == null || string.IsNullOrWhiteSpace(body.Title))
        return Results.BadRequest("Titre manquant.");
    var start = body.StartDate ?? DateTime.UtcNow;
    var end = body.EndDate ?? start.AddHours(2);
    if (!meetings.Update(id, body.Title, body.Description ?? "", start, end))
        return Results.NotFound();
    return Results.NoContent();
});

app.MapDelete("/api/meetings/{id:guid}", (Guid id, HttpRequest request, MeetingsService meetings) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (!meetings.Delete(id))
        return Results.NotFound();
    return Results.NoContent();
});

app.MapGet("/api/meetings/hidden-static", (MeetingsService meetings) =>
{
    var ids = meetings.GetHiddenStaticIds();
    return Results.Ok(ids);
});

app.MapPost("/api/meetings/hidden-static", (HiddenStaticRequest? body, HttpRequest request, MeetingsService meetings) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (body?.Id == null)
        return Results.BadRequest("Id manquant.");
    meetings.HideStaticId(body.Id);
    return Results.NoContent();
});

app.MapDelete("/api/meetings/hidden-static/{id}", (string id, HttpRequest request, MeetingsService meetings) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (!meetings.UnhideStaticId(id))
        return Results.NotFound();
    return Results.NoContent();
});

app.MapGet("/api/links", (LinksService links) =>
{
    var categories = links.GetAll();
    return Results.Ok(categories.Select(c => new
    {
        id = c.Id,
        title = c.Title,
        order = c.Order,
        links = c.Links.OrderBy(l => l.Order).Select(l => new
        {
            id = l.Id,
            name = l.Name,
            url = l.Url,
            description = l.Description,
            order = l.Order
        })
    }));
});

app.MapPut("/api/links/category/{id:guid}", (Guid id, CategoryUpdateRequest? body, HttpRequest request, LinksService links) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (body == null)
        return Results.BadRequest("Body manquant.");
    var linkItems = (body.Links ?? new List<LinkItemRequest>()).Select((l, i) => new Api.Models.UsefulLinkItem
    {
        Id = l.Id ?? Guid.Empty,
        Name = l.Name ?? "",
        Url = l.Url ?? "",
        Description = l.Description ?? "",
        Order = i
    }).ToList();
    foreach (var item in linkItems.Where(l => l.Id == Guid.Empty))
        item.Id = Guid.NewGuid();
    var updated = links.UpdateCategory(id, body.Title ?? "", linkItems);
    if (updated == null)
        return Results.NotFound();
    return Results.Ok(new
    {
        id = updated.Id,
        title = updated.Title,
        order = updated.Order,
        links = updated.Links.OrderBy(l => l.Order).Select(l => new
        {
            id = l.Id,
            name = l.Name,
            url = l.Url,
            description = l.Description,
            order = l.Order
        })
    });
});

app.MapPost("/api/links/category", (CategoryCreateRequest? body, HttpRequest request, LinksService links) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (body?.Title == null || string.IsNullOrWhiteSpace(body.Title))
        return Results.BadRequest("Titre manquant.");
    var added = links.AddCategory(body.Title);
    return Results.Created($"/api/links/category/{added.Id}", new
    {
        id = added.Id,
        title = added.Title,
        order = added.Order,
        links = added.Links
    });
});

app.MapDelete("/api/links/category/{id:guid}", (Guid id, HttpRequest request, LinksService links) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (!links.DeleteCategory(id))
        return Results.NotFound();
    return Results.NoContent();
});

app.MapGet("/api/contact", (ContactService contact) =>
{
    var info = contact.Get();
    return Results.Ok(new
    {
        email = info.Email,
        phone = info.Phone,
        addressLine1 = info.AddressLine1,
        addressLine2 = info.AddressLine2
    });
});

app.MapPut("/api/contact", (ContactUpdateRequest? body, HttpRequest request, ContactService contact) =>
{
    if (!IsAdmin(request))
        return Results.Unauthorized();
    if (body == null)
        return Results.BadRequest("Body manquant.");
    var updated = contact.Update(body.Email ?? "", body.Phone ?? "", body.AddressLine1 ?? "", body.AddressLine2 ?? "");
    return Results.Ok(new
    {
        email = updated.Email,
        phone = updated.Phone,
        addressLine1 = updated.AddressLine1,
        addressLine2 = updated.AddressLine2
    });
});

app.MapPost("/api/admin/login", (AdminLoginRequest? body, HttpContext ctx, IConfiguration config) =>
{
    if (body?.Login == null || body?.Password == null)
        return Results.BadRequest("Login et mot de passe requis.");

    var clientIp = ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    var now = DateTime.UtcNow;
    var windowStart = now.AddMinutes(-LoginWindowMinutes);
    var list = loginAttempts.AddOrUpdate(clientIp, new List<DateTime> { now }, (_, existing) =>
    {
        existing.RemoveAll(t => t < windowStart);
        existing.Add(now);
        return existing;
    });
    if (list.Count(t => t >= windowStart) > LoginMaxAttempts)
        return Results.Json(new { error = "Trop de tentatives. Réessayez dans 15 minutes." }, statusCode: 429);

    var login = config["Admin:Login"];
    var password = config["Admin:Password"];
    var apiKey = config["Admin:ApiKey"];
    if (string.IsNullOrEmpty(login) || string.IsNullOrEmpty(password))
        return Results.Json(new { error = "Configuration admin manquante." }, statusCode: 401);
    if (body.Login != login || body.Password != password)
        return Results.Json(new { error = "Identifiants incorrects." }, statusCode: 401);
    if (string.IsNullOrEmpty(apiKey))
        return Results.Json(new { error = "ApiKey non configurée (configurer Admin:ApiKey)." }, statusCode: 500);
    return Results.Ok(new { token = apiKey });
});

app.Run();

record HiddenStaticRequest(string? Id);
record ReorderRequest(List<Guid>? OrderedIds);
record UnifiedOrderRequest(List<string>? OrderedIds);
record MeetingCreateRequest(string? Title, string? Description, DateTime? StartDate, DateTime? EndDate);
record MeetingUpdateRequest(string? Title, string? Description, DateTime? StartDate, DateTime? EndDate);
record CategoryCreateRequest(string? Title);
record CategoryUpdateRequest(string? Title, List<LinkItemRequest>? Links);
record LinkItemRequest(Guid? Id, string? Name, string? Url, string? Description);
record ContactUpdateRequest(string? Email, string? Phone, string? AddressLine1, string? AddressLine2);
record AdminLoginRequest(string? Login, string? Password);
