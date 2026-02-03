namespace Api.Models;

public class Meeting
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class MeetingsData
{
    public List<Meeting> Meetings { get; set; } = new();
    public List<string> HiddenStaticIds { get; set; } = new();
}
