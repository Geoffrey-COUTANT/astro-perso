using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("blog_post_attachments")]
public class BlogPostAttachmentEntity
{
    public Guid Id { get; set; }
    public Guid BlogPostId { get; set; }
    public string FileName { get; set; } = "";
    public byte[] FileContent { get; set; } = Array.Empty<byte>();
    public string ContentType { get; set; } = "";
    public int Order { get; set; }
}
