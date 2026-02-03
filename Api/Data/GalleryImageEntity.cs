using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("gallery_images")]
public class GalleryImageEntity
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public int Order { get; set; }
    public DateTime CreatedAt { get; set; }
    public byte[]? FileContent { get; set; }
    public string? ContentType { get; set; }
}
