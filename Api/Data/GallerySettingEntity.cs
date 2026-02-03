using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("gallery_settings")]
public class GallerySettingEntity
{
    public string Key { get; set; } = "";
    public string Value { get; set; } = "";
}
