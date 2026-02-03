using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("static_meetings")]
public class StaticMeetingEntity
{
    public string Id { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
