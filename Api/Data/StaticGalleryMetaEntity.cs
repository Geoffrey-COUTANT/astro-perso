using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("static_gallery_meta")]
public class StaticGalleryMetaEntity
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string? Url { get; set; }
    public int DisplayOrder { get; set; }
}
