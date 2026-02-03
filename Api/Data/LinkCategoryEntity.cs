using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("link_categories")]
public class LinkCategoryEntity
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public int Order { get; set; }
    public List<LinkItemEntity> Links { get; set; } = new();
}
