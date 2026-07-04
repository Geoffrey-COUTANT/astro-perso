namespace Api.Models;

public class BlogPostDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public List<BlogPostAttachmentDto> Attachments { get; set; } = new();
}

public class BlogPostAttachmentDto
{
    public Guid Id { get; set; }
    public string FileName { get; set; } = "";
    public string ContentType { get; set; } = "";
    public string Url { get; set; } = "";
}

public class LatestBlogPostDto
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
}
