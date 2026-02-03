using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("meetings")]
public class MeetingEntity
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime CreatedAt { get; set; }
}
