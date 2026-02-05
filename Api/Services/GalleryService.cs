using System.Text.Json;
using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class GalleryService
{
    private const int MaxUploadBytes = 10 * 1024 * 1024; // 10 Mo — évite grosses allocations RAM
    private readonly IDbContextFactory<AppDbContext> _dbFactory;
    private static readonly JsonSerializerOptions JsonOptions = new();

    public GalleryService(IDbContextFactory<AppDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public List<GalleryImage> GetAll()
    {
        try
        {
            using var db = _dbFactory.CreateDbContext();
            return db.GalleryImages
                .OrderBy(x => x.Order)
                .ThenBy(x => x.CreatedAt)
                .Select(x => new GalleryImage
                {
                    Id = x.Id,
                    FileName = x.FileName,
                    Title = x.Title,
                    Description = x.Description,
                    Order = x.Order,
                    CreatedAt = x.CreatedAt
                })
                .ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GalleryService.GetAll] {ex.Message}");
            return new List<GalleryImage>();
        }
    }

    public GalleryImage? GetById(Guid id)
    {
        using var db = _dbFactory.CreateDbContext();
        var e = db.GalleryImages.Find(id);
        return e == null ? null : ToModel(e);
    }

    public async Task<GalleryImage?> AddAsync(IFormFile file, string? title = null, CancellationToken ct = default)
    {
        if (file.Length == 0) return null;
        if (file.Length > MaxUploadBytes) return null; // limite RAM
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
        if (!allowed.Contains(ext)) return null;

        using var db = _dbFactory.CreateDbContext();
        var id = Guid.NewGuid();
        byte[] content;
        await using (var stream = new MemoryStream((int)Math.Min(file.Length, MaxUploadBytes)))
        {
            await file.CopyToAsync(stream, ct);
            content = stream.ToArray();
        }

        var maxOrder = await db.GalleryImages.AnyAsync(ct)
            ? await db.GalleryImages.MaxAsync(x => x.Order, ct) + 1
            : 0;

        var entity = new GalleryImageEntity
        {
            Id = id,
            FileName = $"{id}{ext}",
            Title = title ?? $"Image {maxOrder + 1}",
            Description = "Photo d'astronomie du Club Astro Véga de la Lyre",
            Order = maxOrder,
            CreatedAt = DateTime.UtcNow,
            FileContent = content,
            ContentType = file.ContentType ?? "application/octet-stream"
        };
        db.GalleryImages.Add(entity);
        await db.SaveChangesAsync(ct);
        return ToModel(entity);
    }

    public bool Delete(Guid id)
    {
        using var db = _dbFactory.CreateDbContext();
        var img = db.GalleryImages.Find(id);
        if (img == null) return false;
        db.GalleryImages.Remove(img);
        db.SaveChanges();
        return true;
    }

    public List<string> GetHiddenStaticIds()
    {
        try { return GetSettingList("HiddenStaticIds"); }
        catch (Exception ex) { Console.WriteLine($"[GalleryService.GetHiddenStaticIds] {ex.Message}"); return new List<string>(); }
    }

    public void HideStaticId(string staticId)
    {
        var list = GetSettingList("HiddenStaticIds");
        if (list.Contains(staticId)) return;
        list.Add(staticId);
        SetSettingList("HiddenStaticIds", list);
    }

    public bool UnhideStaticId(string staticId)
    {
        var list = GetSettingList("HiddenStaticIds");
        if (!list.Remove(staticId)) return false;
        SetSettingList("HiddenStaticIds", list);
        return true;
    }

    public void SetUnifiedOrder(List<string> orderedIds)
    {
        SetSettingList("UnifiedOrder", orderedIds ?? new List<string>());
    }

    public List<string> GetUnifiedOrder()
    {
        try { return GetSettingList("UnifiedOrder"); }
        catch (Exception ex) { Console.WriteLine($"[GalleryService.GetUnifiedOrder] {ex.Message}"); return new List<string>(); }
    }

    public bool ReorderImages(List<Guid> orderedIds)
    {
        using var db = _dbFactory.CreateDbContext();
        var images = db.GalleryImages.ToList();
        var idsSet = new HashSet<Guid>(orderedIds);
        if (idsSet.Count != orderedIds.Count || !images.All(img => idsSet.Contains(img.Id)))
            return false;
        for (var i = 0; i < orderedIds.Count; i++)
        {
            var img = images.FirstOrDefault(x => x.Id == orderedIds[i]);
            if (img != null) img.Order = i;
        }
        db.SaveChanges();
        return true;
    }

    public string GetFileUrl(string fileName)
    {
        var id = fileName;
        if (fileName.Contains('.'))
            id = fileName.Substring(0, fileName.IndexOf('.'));
        return Guid.TryParse(id, out var guid) ? $"/api/gallery/{guid}/file" : $"/uploads/gallery/{fileName}";
    }

    public (byte[]? Content, string? ContentType)? GetFileContent(Guid id)
    {
        using var db = _dbFactory.CreateDbContext();
        var row = db.GalleryImages.AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new { x.FileContent, x.ContentType })
            .FirstOrDefault();
        if (row?.FileContent == null) return null;
        return (row.FileContent, row.ContentType ?? "application/octet-stream");
    }

    public List<(string Id, string Title, string? Url)> GetStaticGalleryList()
    {
        try
        {
            using var db = _dbFactory.CreateDbContext();
            EnsureSeedStaticGalleryMeta(db);
            return db.StaticGalleryMeta.OrderBy(x => x.DisplayOrder)
                .Select(x => new { x.Id, x.Title, x.Url })
                .ToList()
                .Select(x => (x.Id, x.Title, x.Url))
                .ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[GalleryService.GetStaticGalleryList] {ex.Message}");
            return new List<(string Id, string Title, string? Url)>();
        }
    }

    private static void EnsureSeedStaticGalleryMeta(AppDbContext db)
    {
        if (db.StaticGalleryMeta.Any()) return;
        var imageNumbers = new[] { 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47 };
        for (var i = 0; i < imageNumbers.Length; i++)
            db.StaticGalleryMeta.Add(new StaticGalleryMetaEntity { Id = $"static-{i}", Title = $"Image {imageNumbers[i]}", Url = null, DisplayOrder = i });
        db.SaveChanges();
    }

    private List<string> GetSettingList(string key)
    {
        using var db = _dbFactory.CreateDbContext();
        var row = db.GallerySettings.Find(key);
        if (row?.Value == null) return new List<string>();
        try
        {
            return JsonSerializer.Deserialize<List<string>>(row.Value) ?? new List<string>();
        }
        catch { return new List<string>(); }
    }

    private void SetSettingList(string key, List<string> list)
    {
        using var db = _dbFactory.CreateDbContext();
        var value = JsonSerializer.Serialize(list);
        var row = db.GallerySettings.Find(key);
        if (row != null)
        {
            row.Value = value;
        }
        else
        {
            db.GallerySettings.Add(new GallerySettingEntity { Key = key, Value = value });
        }
        db.SaveChanges();
    }

    private static GalleryImage ToModel(GalleryImageEntity e)
    {
        return new GalleryImage
        {
            Id = e.Id,
            FileName = e.FileName,
            Title = e.Title,
            Description = e.Description,
            Order = e.Order,
            CreatedAt = e.CreatedAt
        };
    }
}
