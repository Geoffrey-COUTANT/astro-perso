using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("blog_posts")]
public class BlogPostEntity
{
    public Guid Id { get; set; }
    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public ICollection<BlogPostAttachmentEntity> Attachments { get; set; } = new List<BlogPostAttachmentEntity>();
}
