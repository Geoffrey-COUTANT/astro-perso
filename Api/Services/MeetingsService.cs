using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class MeetingsService
{
    private readonly IDbContextFactory<AppDbContext> _dbFactory;

    public MeetingsService(IDbContextFactory<AppDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public List<Meeting> GetAll()
    {
        using var db = _dbFactory.CreateDbContext();
        return db.Meetings
            .OrderBy(x => x.StartDate)
            .Select(x => new Meeting
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                CreatedAt = x.CreatedAt
            })
            .ToList();
    }

    public Meeting? GetById(Guid id)
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
            Id = Guid.NewGuid(),
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

    public bool Update(Guid id, string title, string description, DateTime startDate, DateTime endDate)
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

    public bool Delete(Guid id)
    {
        using var db = _dbFactory.CreateDbContext();
        var meeting = db.Meetings.Find(id);
        if (meeting == null) return false;
        db.Meetings.Remove(meeting);
        db.SaveChanges();
        return true;
    }

    public List<string> GetHiddenStaticIds()
    {
        using var db = _dbFactory.CreateDbContext();
        return db.MeetingHiddenStatic.Select(x => x.StaticId).ToList();
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
}
