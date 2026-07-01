using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Api.Services;

public record MeetingItemDto(string Id, string Title, string Description, DateTime StartDate, DateTime EndDate);

public class MeetingsService
{
    private readonly IDbContextFactory<AppDbContext> _dbFactory;
    private readonly ILogger<MeetingsService> _logger;

    public MeetingsService(IDbContextFactory<AppDbContext> dbFactory, ILogger<MeetingsService> logger)
    {
        _dbFactory = dbFactory;
        _logger = logger;
    }

    public List<MeetingItemDto> GetAll()
    {
        try
        {
            using var db = _dbFactory.CreateDbContext();
            EnsureSeedStaticMeetings(db);
            var hidden = new HashSet<string>(db.MeetingHiddenStatic.Select(x => x.StaticId));
            var fromDb = db.Meetings.OrderBy(x => x.StartDate).Select(x => new MeetingItemDto(x.Id.ToString(), x.Title, x.Description ?? "", x.StartDate, x.EndDate)).ToList();
            var fromStatic = db.StaticMeetings.Where(s => !hidden.Contains(s.Id)).Select(x => new MeetingItemDto(x.Id, x.Title, x.Description ?? "", x.StartDate, x.EndDate)).ToList();
            return fromDb.Concat(fromStatic).OrderBy(x => x.StartDate).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[MeetingsService.GetAll] {ex.Message}");
            return new List<MeetingItemDto>();
        }
    }

    public Meeting? GetById(int id)
    {
        using var db = _dbFactory.CreateDbContext();
        var e = db.Meetings.Find(id);
        return e == null ? null : ToModel(e);
    }

    public Meeting Add(string title, string description, DateTime startDate, DateTime endDate)
    {
        using var db = _dbFactory.CreateDbContext();
        var entity = new MeetingEntity
        {
            Title = title,
            Description = description ?? "",
            StartDate = startDate,
            EndDate = endDate,
            CreatedAt = DateTime.UtcNow
        };
        db.Meetings.Add(entity);
        db.SaveChanges();
        return ToModel(entity);
    }

    public bool Update(int id, string title, string description, DateTime startDate, DateTime endDate)
    {
        using var db = _dbFactory.CreateDbContext();
        var meeting = db.Meetings.Find(id);
        if (meeting == null) return false;
        meeting.Title = title;
        meeting.Description = description ?? "";
        meeting.StartDate = startDate;
        meeting.EndDate = endDate;
        db.SaveChanges();
        return true;
    }

    public bool Delete(int id)
    {
        using var db = _dbFactory.CreateDbContext();
        var meeting = db.Meetings.Find(id);
        if (meeting == null) return false;

        var meetingData = JsonSerializer.Serialize(new
        {
            meeting.Id,
            meeting.Title,
            meeting.Description,
            meeting.StartDate,
            meeting.EndDate,
            meeting.CreatedAt
        });
        _logger.LogInformation("AUDIT_DELETE: Meeting with ID {MeetingId} deleted. Archived content: {MeetingData}", id, meetingData);

        db.Meetings.Remove(meeting);
        db.SaveChanges();
        return true;
    }

    public List<MeetingItemDto> GetAllStatic()
    {
        try
        {
            using var db = _dbFactory.CreateDbContext();
            EnsureSeedStaticMeetings(db);
            return db.StaticMeetings.OrderBy(x => x.StartDate).Select(x => new MeetingItemDto(x.Id, x.Title, x.Description ?? "", x.StartDate, x.EndDate)).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[MeetingsService.GetAllStatic] {ex.Message}");
            return new List<MeetingItemDto>();
        }
    }

    public List<string> GetHiddenStaticIds()
    {
        try
        {
            using var db = _dbFactory.CreateDbContext();
            return db.MeetingHiddenStatic.Select(x => x.StaticId).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[MeetingsService.GetHiddenStaticIds] {ex.Message}");
            return new List<string>();
        }
    }

    public void HideStaticId(string staticId)
    {
        if (string.IsNullOrEmpty(staticId)) return;
        using var db = _dbFactory.CreateDbContext();
        if (db.MeetingHiddenStatic.Any(x => x.StaticId == staticId)) return;
        db.MeetingHiddenStatic.Add(new MeetingHiddenStaticEntity { StaticId = staticId });
        db.SaveChanges();
    }

    public bool UnhideStaticId(string staticId)
    {
        using var db = _dbFactory.CreateDbContext();
        var row = db.MeetingHiddenStatic.FirstOrDefault(x => x.StaticId == staticId);
        if (row == null) return false;
        db.MeetingHiddenStatic.Remove(row);
        db.SaveChanges();
        return true;
    }

    private static Meeting ToModel(MeetingEntity e)
    {
        return new Meeting
        {
            Id = e.Id,
            Title = e.Title,
            Description = e.Description,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            CreatedAt = e.CreatedAt
        };
    }

    private static void EnsureSeedStaticMeetings(AppDbContext db)
    {
        if (db.StaticMeetings.Any()) return;
        var items = new[]
        {
            (Id: "static-1", Title: "Assemblée Générale", Start: new DateTime(2026, 1, 23, 20, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 1, 23, 22, 30, 0, DateTimeKind.Utc), Desc: ""),
            (Id: "static-2", Title: "Réunion de fin d'année", Start: new DateTime(2025, 12, 19, 20, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 12, 19, 22, 30, 0, DateTimeKind.Utc), Desc: "compte rendu de la dernière réunion de l'année"),
            (Id: "static-3", Title: "Réunion A", Start: new DateTime(2025, 2, 21, 21, 0, 0, DateTimeKind.Utc), End: new DateTime(2025, 2, 21, 23, 0, 0, DateTimeKind.Utc), Desc: "Résumé de la réunion A"),
            (Id: "static-4", Title: "Réunion B", Start: new DateTime(2025, 3, 28, 21, 0, 0, DateTimeKind.Utc), End: new DateTime(2025, 3, 28, 23, 0, 0, DateTimeKind.Utc), Desc: "Résumé de la réunion B"),
            (Id: "static-5", Title: "Réunion C", Start: new DateTime(2025, 4, 25, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 4, 25, 23, 30, 0, DateTimeKind.Utc), Desc: "Résumé de la réunion C"),
            (Id: "static-6", Title: "Réunion D", Start: new DateTime(2025, 5, 23, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 5, 23, 23, 30, 0, DateTimeKind.Utc), Desc: "Résumé de la réunion D"),
            (Id: "static-7", Title: "Réunion E", Start: new DateTime(2025, 6, 20, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 6, 20, 23, 30, 0, DateTimeKind.Utc), Desc: "Résumé de la réunion E"),
            (Id: "static-8", Title: "Soirée festive - Après-midi / soirée", Start: new DateTime(2025, 7, 12, 13, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 7, 12, 23, 30, 0, DateTimeKind.Utc), Desc: "Résumé de la soirée festive"),
            (Id: "static-9", Title: "Réunion F", Start: new DateTime(2025, 7, 18, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 7, 18, 23, 30, 0, DateTimeKind.Utc), Desc: "Résumé de la réunion F"),
            (Id: "static-10", Title: "Nuit des étoiles", Start: new DateTime(2025, 8, 1, 22, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 8, 2, 0, 30, 0, DateTimeKind.Utc), Desc: "Résumé de la nuit étoilée"),
            (Id: "static-11", Title: "Réunion ok", Start: new DateTime(2026, 2, 21, 21, 0, 0, DateTimeKind.Utc), End: new DateTime(2026, 2, 21, 23, 0, 0, DateTimeKind.Utc), Desc: ""),
            (Id: "static-12", Title: "Réunion ok", Start: new DateTime(2026, 3, 28, 21, 0, 0, DateTimeKind.Utc), End: new DateTime(2026, 3, 28, 23, 0, 0, DateTimeKind.Utc), Desc: ""),
            (Id: "static-13", Title: "Réunion ok", Start: new DateTime(2026, 4, 25, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 4, 25, 23, 30, 0, DateTimeKind.Utc), Desc: ""),
            (Id: "static-14", Title: "Réunion ok", Start: new DateTime(2026, 5, 23, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 5, 23, 23, 30, 0, DateTimeKind.Utc), Desc: ""),
            (Id: "static-15", Title: "Réunion ok", Start: new DateTime(2026, 6, 20, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 6, 20, 23, 30, 0, DateTimeKind.Utc), Desc: ""),
            (Id: "static-16", Title: "Soirée festive - Après-midi / soirée", Start: new DateTime(2026, 7, 12, 13, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 7, 12, 23, 30, 0, DateTimeKind.Utc), Desc: ""),
            (Id: "static-17", Title: "Réunion J", Start: new DateTime(2026, 7, 18, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 7, 18, 23, 30, 0, DateTimeKind.Utc), Desc: ""),
            (Id: "static-18", Title: "Nuit des étoiles", Start: new DateTime(2026, 8, 1, 22, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 8, 2, 0, 30, 0, DateTimeKind.Utc), Desc: ""),
        };
        foreach (var (Id, Title, Start, End, Desc) in items)
            db.StaticMeetings.Add(new StaticMeetingEntity { Id = Id, Title = Title, Description = Desc, StartDate = Start, EndDate = End });
        db.SaveChanges();
    }
}
