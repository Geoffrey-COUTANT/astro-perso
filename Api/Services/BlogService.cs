using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class BlogService
{
    private const int MaxUploadBytes = 50 * 1024 * 1024; // 50 Mo per file limit
    private readonly IDbContextFactory<AppDbContext> _dbFactory;

    private static readonly string[] VideoExtensions = new[] { ".mp4", ".webm", ".ogg", ".mov" };

    private static readonly string[] AllowedExtensions = new[]
    {
        ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", // Images
        ".mp4", ".webm", ".ogg", ".mov" // Videos
    };

    public BlogService(IDbContextFactory<AppDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public List<BlogPostDto> GetAll()
    {
        try
        {
            using var db = _dbFactory.CreateDbContext();
            return db.BlogPosts
                .Include(x => x.Attachments)
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new BlogPostDto
                {
                    Id = x.Id,
                    Content = x.Content,
                    CreatedAt = x.CreatedAt,
                    Attachments = x.Attachments
                        .OrderBy(a => a.Order)
                        .Select(a => new BlogPostAttachmentDto
                        {
                            Id = a.Id,
                            FileName = a.FileName,
                            ContentType = a.ContentType,
                            Url = $"/api/blog/attachment/{a.Id}/file"
                        })
                        .ToList()
                })
                .ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[BlogService.GetAll] Erreur: {ex.Message}");
            return new List<BlogPostDto>();
        }
    }

    public LatestBlogPostDto? GetLatest()
    {
        try
        {
            using var db = _dbFactory.CreateDbContext();
            return db.BlogPosts
                .OrderByDescending(x => x.CreatedAt)
                .Select(x => new LatestBlogPostDto
                {
                    Id = x.Id,
                    CreatedAt = x.CreatedAt
                })
                .FirstOrDefault();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[BlogService.GetLatest] Erreur: {ex.Message}");
            return null;
        }
    }

    public (byte[] Content, string ContentType)? GetAttachmentContent(Guid id)
    {
        try
        {
            using var db = _dbFactory.CreateDbContext();
            var row = db.BlogPostAttachments.AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new { x.FileContent, x.ContentType })
                .FirstOrDefault();
            if (row == null || row.FileContent == null) return null;
            return (row.FileContent, row.ContentType);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[BlogService.GetAttachmentContent] Erreur: {ex.Message}");
            return null;
        }
    }

    public async Task<BlogPostDto?> AddAsync(string content, List<IFormFile> files, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(content) && (files == null || files.Count == 0))
            return null;

        var attachments = new List<BlogPostAttachmentEntity>();
        var order = 0;

        if (files != null)
        {
            foreach (var file in files)
            {
                if (file.Length == 0) continue;

                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!AllowedExtensions.Contains(ext)) continue;

                var isVideo = VideoExtensions.Contains(ext);
                if (!isVideo && file.Length > MaxUploadBytes) continue;

                byte[] fileBytes;
                await using (var stream = new MemoryStream((int)Math.Min(file.Length, MaxUploadBytes)))
                {
                    await file.CopyToAsync(stream, ct);
                    fileBytes = stream.ToArray();
                }

                var attachmentId = Guid.NewGuid();
                attachments.Add(new BlogPostAttachmentEntity
                {
                    Id = attachmentId,
                    FileName = $"{attachmentId}{ext}",
                    FileContent = fileBytes,
                    ContentType = file.ContentType ?? "application/octet-stream",
                    Order = order++
                });
            }
        }

        using var db = _dbFactory.CreateDbContext();
        var post = new BlogPostEntity
        {
            Id = Guid.NewGuid(),
            Content = content ?? "",
            CreatedAt = DateTime.UtcNow,
            Attachments = attachments
        };

        db.BlogPosts.Add(post);
        await db.SaveChangesAsync(ct);

        return new BlogPostDto
        {
            Id = post.Id,
            Content = post.Content,
            CreatedAt = post.CreatedAt,
            Attachments = post.Attachments
                .OrderBy(a => a.Order)
                .Select(a => new BlogPostAttachmentDto
                {
                    Id = a.Id,
                    FileName = a.FileName,
                    ContentType = a.ContentType,
                    Url = $"/api/blog/attachment/{a.Id}/file"
                })
                .ToList()
        };
    }

    public bool Delete(Guid id)
    {
        try
        {
            using var db = _dbFactory.CreateDbContext();
            var post = db.BlogPosts.Find(id);
            if (post == null) return false;
            db.BlogPosts.Remove(post);
            db.SaveChanges();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[BlogService.Delete] Erreur: {ex.Message}");
            return false;
        }
    }
}
