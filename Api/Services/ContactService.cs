using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class ContactService
{
    private const int ContactInfoId = 1;
    private readonly IDbContextFactory<AppDbContext> _dbFactory;

    public ContactService(IDbContextFactory<AppDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public ContactInfo Get()
    {
        using var db = _dbFactory.CreateDbContext();
        var e = db.ContactInfo.Find(ContactInfoId);
        if (e != null)
            return new ContactInfo
            {
                Email = e.Email,
                Phone = e.Phone,
                AddressLine1 = e.AddressLine1,
                AddressLine2 = e.AddressLine2
            };
        EnsureSeed(db);
        return new ContactInfo();
    }

    public ContactInfo Update(string email, string phone, string addressLine1, string addressLine2)
    {
        using var db = _dbFactory.CreateDbContext();
        var e = db.ContactInfo.Find(ContactInfoId);
        if (e == null)
        {
            EnsureSeed(db);
            e = db.ContactInfo.Find(ContactInfoId)!;
        }
        e.Email = email ?? "";
        e.Phone = phone ?? "";
        e.AddressLine1 = addressLine1 ?? "";
        e.AddressLine2 = addressLine2 ?? "";
        db.SaveChanges();
        return new ContactInfo
        {
            Email = e.Email,
            Phone = e.Phone,
            AddressLine1 = e.AddressLine1,
            AddressLine2 = e.AddressLine2
        };
    }

    private static void EnsureSeed(AppDbContext db)
    {
        if (db.ContactInfo.Any()) return;
        db.ContactInfo.Add(new ContactInfoEntity
        {
            Id = ContactInfoId,
            Email = "vegastro17@gmail.com",
            Phone = "06 71 36 86 21",
            AddressLine1 = "Club Astro Véga de la Lyre",
            AddressLine2 = "17150 BOISREDON, France"
        });
        db.SaveChanges();
    }
}
