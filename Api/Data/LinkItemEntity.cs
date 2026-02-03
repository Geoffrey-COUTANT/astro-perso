using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("link_items")]
public class LinkItemEntity
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = "";
    public string Url { get; set; } = "";
    public string Description { get; set; } = "";
    public int Order { get; set; }
}
