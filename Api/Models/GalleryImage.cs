namespace Api.Models;

public class GalleryImage
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "Photo d'astronomie du Club Astro Véga de la Lyre";
    public int Order { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GalleryData
{
    public List<GalleryImage> Images { get; set; } = new();
    public List<string> HiddenStaticIds { get; set; } = new();
    public List<string> UnifiedOrder { get; set; } = new();
}
