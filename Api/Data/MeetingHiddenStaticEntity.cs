using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("meeting_hidden_static")]
public class MeetingHiddenStaticEntity
{
    public int Id { get; set; }
    public string StaticId { get; set; } = "";
}
