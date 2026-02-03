namespace Api.Models;

public class UsefulLinkCategory
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public int Order { get; set; }
    public List<UsefulLinkItem> Links { get; set; } = new();
}

public class UsefulLinkItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string Url { get; set; } = "";
    public string Description { get; set; } = "";
    public int Order { get; set; }
}

public class LinksData
{
    public List<UsefulLinkCategory> Categories { get; set; } = new();
}
