using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Data;

[Table("contact_info")]
public class ContactInfoEntity
{
    public int Id { get; set; }
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string AddressLine1 { get; set; } = "";
    public string AddressLine2 { get; set; } = "";
}
