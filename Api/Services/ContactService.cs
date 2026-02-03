using System.Text.Json;
using Api.Models;

namespace Api.Services;

public class ContactService
{
    private readonly string _dataPath;
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    public ContactService(IWebHostEnvironment env)
    {
        var contactPath = Path.Combine(env.ContentRootPath, "uploads", "contact");
        Directory.CreateDirectory(contactPath);
        _dataPath = Path.Combine(contactPath, "data.json");
        EnsureSeed();
    }

    private void EnsureSeed()
    {
        if (File.Exists(_dataPath)) return;
        var info = new ContactInfo
        {
            Email = "vegastro17@gmail.com",
            Phone = "06 71 36 86 21",
            AddressLine1 = "Club Astro Véga de la Lyre",
            AddressLine2 = "17150 BOISREDON, France"
        };
        SaveData(info);
    }

    public ContactInfo Get()
    {
        return LoadData();
    }

    public ContactInfo Update(string email, string phone, string addressLine1, string addressLine2)
    {
        var info = new ContactInfo
        {
            Email = email ?? "",
            Phone = phone ?? "",
            AddressLine1 = addressLine1 ?? "",
            AddressLine2 = addressLine2 ?? ""
        };
        SaveData(info);
        return info;
    }

    private ContactInfo LoadData()
    {
        if (!File.Exists(_dataPath))
            return new ContactInfo();
        try
        {
            var json = File.ReadAllText(_dataPath);
            return JsonSerializer.Deserialize<ContactInfo>(json) ?? new ContactInfo();
        }
        catch
        {
            return new ContactInfo();
        }
    }

    private void SaveData(ContactInfo info)
    {
        File.WriteAllText(_dataPath, JsonSerializer.Serialize(info, JsonOptions));
    }
}
