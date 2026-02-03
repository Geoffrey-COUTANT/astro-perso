using System.Text.Json;
using Api.Models;

namespace Api.Services;

public class MeetingsService
{
    private readonly string _dataPath;
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    public MeetingsService(IWebHostEnvironment env)
    {
        var meetingsPath = Path.Combine(env.ContentRootPath, "uploads", "meetings");
        Directory.CreateDirectory(meetingsPath);
        _dataPath = Path.Combine(meetingsPath, "data.json");
    }

    public List<Meeting> GetAll()
    {
        var data = LoadData();
        return data.Meetings.OrderBy(x => x.StartDate).ToList();
    }

    public Meeting? GetById(Guid id)
    {
        return LoadData().Meetings.FirstOrDefault(x => x.Id == id);
    }

    public Meeting Add(string title, string description, DateTime startDate, DateTime endDate)
    {
        var data = LoadData();
        var meeting = new Meeting
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description ?? "",
            StartDate = startDate,
            EndDate = endDate,
            CreatedAt = DateTime.UtcNow
        };
        data.Meetings.Add(meeting);
        SaveData(data);
        return meeting;
    }

    public bool Update(Guid id, string title, string description, DateTime startDate, DateTime endDate)
    {
        var data = LoadData();
        var meeting = data.Meetings.FirstOrDefault(x => x.Id == id);
        if (meeting == null) return false;

        meeting.Title = title;
        meeting.Description = description ?? "";
        meeting.StartDate = startDate;
        meeting.EndDate = endDate;
        SaveData(data);
        return true;
    }

    public bool Delete(Guid id)
    {
        var data = LoadData();
        var meeting = data.Meetings.FirstOrDefault(x => x.Id == id);
        if (meeting == null) return false;

        data.Meetings.Remove(meeting);
        SaveData(data);
        return true;
    }

    public List<string> GetHiddenStaticIds()
    {
        var data = LoadData();
        return data.HiddenStaticIds?.ToList() ?? new List<string>();
    }

    public void HideStaticId(string staticId)
    {
        var data = LoadData();
        data.HiddenStaticIds ??= new List<string>();
        if (!string.IsNullOrEmpty(staticId) && !data.HiddenStaticIds.Contains(staticId))
            data.HiddenStaticIds.Add(staticId);
        SaveData(data);
    }

    public bool UnhideStaticId(string staticId)
    {
        var data = LoadData();
        if (data.HiddenStaticIds == null) return false;
        var removed = data.HiddenStaticIds.Remove(staticId);
        SaveData(data);
        return removed;
    }

    private MeetingsData LoadData()
    {
        if (!File.Exists(_dataPath))
            return new MeetingsData();

        try
        {
            var json = File.ReadAllText(_dataPath);
            return JsonSerializer.Deserialize<MeetingsData>(json) ?? new MeetingsData();
        }
        catch
        {
            return new MeetingsData();
        }
    }

    private void SaveData(MeetingsData data)
    {
        File.WriteAllText(_dataPath, JsonSerializer.Serialize(data, JsonOptions));
    }
}
