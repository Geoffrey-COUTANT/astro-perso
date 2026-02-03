using System.Text.Json;
using Api.Models;

namespace Api.Services;

public class GalleryService
{
    private readonly string _uploadPath;
    private readonly string _dataPath;
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    public GalleryService(IWebHostEnvironment env)
    {
        _uploadPath = Path.Combine(env.ContentRootPath, "uploads", "gallery");
        _dataPath = Path.Combine(_uploadPath, "data.json");
        Directory.CreateDirectory(_uploadPath);
    }

    public List<GalleryImage> GetAll()
    {
        var data = LoadData();
        return data.Images.OrderBy(x => x.Order).ThenBy(x => x.CreatedAt).ToList();
    }

    public GalleryImage? GetById(Guid id)
    {
        return LoadData().Images.FirstOrDefault(x => x.Id == id);
    }

    public async Task<GalleryImage?> AddAsync(IFormFile file, string? title = null, CancellationToken ct = default)
    {
        if (file.Length == 0) return null;

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg" };
        if (!allowed.Contains(ext)) return null;

        var data = LoadData();
        var id = Guid.NewGuid();
        var fileName = $"{id}{ext}";
        var filePath = Path.Combine(_uploadPath, fileName);

        await using (var stream = File.Create(filePath))
            await file.CopyToAsync(stream, ct);

        var image = new GalleryImage
        {
            Id = id,
            FileName = fileName,
            Title = title ?? $"Image {data.Images.Count + 1}",
            Order = data.Images.Count,
            CreatedAt = DateTime.UtcNow
        };
        data.Images.Add(image);
        SaveData(data);
        return image;
    }

    public bool Delete(Guid id)
    {
        var data = LoadData();
        var img = data.Images.FirstOrDefault(x => x.Id == id);
        if (img == null) return false;

        var filePath = Path.Combine(_uploadPath, img.FileName);
        if (File.Exists(filePath))
            File.Delete(filePath);

        data.Images.Remove(img);
        SaveData(data);
        return true;
    }

    public List<string> GetHiddenStaticIds()
    {
        var data = LoadData();
        return data.HiddenStaticIds?.ToList() ?? new List<string>();
    }

    public void HideStaticId(string staticId)
    {
        var data = LoadData();
        data.HiddenStaticIds ??= new List<string>();
        if (!data.HiddenStaticIds.Contains(staticId))
        {
            data.HiddenStaticIds.Add(staticId);
            SaveData(data);
        }
    }

    public bool UnhideStaticId(string staticId)
    {
        var data = LoadData();
        if (data.HiddenStaticIds == null) return false;
        var removed = data.HiddenStaticIds.Remove(staticId);
        if (removed) SaveData(data);
        return removed;
    }

    public void SetUnifiedOrder(List<string> orderedIds)
    {
        var data = LoadData();
        data.UnifiedOrder = orderedIds ?? new List<string>();
        SaveData(data);
    }

    public List<string> GetUnifiedOrder()
    {
        var data = LoadData();
        return data.UnifiedOrder?.ToList() ?? new List<string>();
    }

    public bool ReorderImages(List<Guid> orderedIds)
    {
        var data = LoadData();
        var idsSet = new HashSet<Guid>(orderedIds);
        
        if (idsSet.Count != orderedIds.Count || !data.Images.All(img => idsSet.Contains(img.Id)))
            return false;

        for (int i = 0; i < orderedIds.Count; i++)
        {
            var img = data.Images.FirstOrDefault(x => x.Id == orderedIds[i]);
            if (img != null) img.Order = i;
        }
        
        SaveData(data);
        return true;
    }

    public string GetFileUrl(string fileName)
    {
        return $"/uploads/gallery/{fileName}";
    }

    private GalleryData LoadData()
    {
        if (!File.Exists(_dataPath))
            return new GalleryData();

        try
        {
            var json = File.ReadAllText(_dataPath);
            return JsonSerializer.Deserialize<GalleryData>(json) ?? new GalleryData();
        }
        catch
        {
            return new GalleryData();
        }
    }

    private void SaveData(GalleryData data)
    {
        File.WriteAllText(_dataPath, JsonSerializer.Serialize(data, JsonOptions));
    }
}
