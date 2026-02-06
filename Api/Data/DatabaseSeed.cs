namespace Api.Data;

/// <summary>
/// Seed automatique au démarrage : réunions (dynamiques + statiques) et métadonnées galerie statique.
/// Exécuté après les migrations pour que les données soient toujours présentes.
/// </summary>
public static class DatabaseSeed
{
    public static void Run(AppDbContext db)
    {
        try
        {
            var addedMeetings = SeedStaticMeetings(db);
            var addedGallery = SeedStaticGalleryMeta(db);
            var addedDynamic = SeedMeetings(db);
            db.SaveChanges();
            Console.WriteLine($"[Startup] Seed OK: static_meetings +{addedMeetings}, static_gallery_meta +{addedGallery}, meetings +{addedDynamic}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Startup] Seed échoué: {ex.Message}");
            Console.WriteLine($"[Startup] Stack: {ex.StackTrace}");
            if (ex.InnerException != null)
                Console.WriteLine($"[Startup] Inner: {ex.InnerException.Message}");
        }
    }

    private static void SeedStaticMeetings(AppDbContext db)
    {
        var existing = new HashSet<string>(db.StaticMeetings.Select(x => x.Id));
        var items = new[]
        {
            (Id: "static-1", Title: "Assemblée Générale", Desc: "", Start: new DateTime(2026, 1, 23, 20, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 1, 23, 22, 30, 0, DateTimeKind.Utc)),
            (Id: "static-2", Title: "Réunion de fin d'année", Desc: "compte rendu de la dernière réunion de l'année", Start: new DateTime(2025, 12, 19, 20, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 12, 19, 22, 30, 0, DateTimeKind.Utc)),
            (Id: "static-3", Title: "Réunion A", Desc: "Résumé de la réunion A", Start: new DateTime(2025, 2, 21, 21, 0, 0, DateTimeKind.Utc), End: new DateTime(2025, 2, 21, 23, 0, 0, DateTimeKind.Utc)),
            (Id: "static-4", Title: "Réunion B", Desc: "Résumé de la réunion B", Start: new DateTime(2025, 3, 28, 21, 0, 0, DateTimeKind.Utc), End: new DateTime(2025, 3, 28, 23, 0, 0, DateTimeKind.Utc)),
            (Id: "static-5", Title: "Réunion C", Desc: "Résumé de la réunion C", Start: new DateTime(2025, 4, 25, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 4, 25, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-6", Title: "Réunion D", Desc: "Résumé de la réunion D", Start: new DateTime(2025, 5, 23, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 5, 23, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-7", Title: "Réunion E", Desc: "Résumé de la réunion E", Start: new DateTime(2025, 6, 20, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 6, 20, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-8", Title: "Soirée festive - Après-midi / soirée", Desc: "Résumé de la soirée festive", Start: new DateTime(2025, 7, 12, 13, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 7, 12, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-9", Title: "Réunion F", Desc: "Résumé de la réunion F", Start: new DateTime(2025, 7, 18, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 7, 18, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-10", Title: "Nuit des étoiles", Desc: "Résumé de la nuit étoilée", Start: new DateTime(2025, 8, 1, 22, 30, 0, DateTimeKind.Utc), End: new DateTime(2025, 8, 2, 0, 30, 0, DateTimeKind.Utc)),
            (Id: "static-11", Title: "Réunion ok", Desc: "", Start: new DateTime(2026, 2, 21, 21, 0, 0, DateTimeKind.Utc), End: new DateTime(2026, 2, 21, 23, 0, 0, DateTimeKind.Utc)),
            (Id: "static-12", Title: "Réunion ok", Desc: "", Start: new DateTime(2026, 3, 28, 21, 0, 0, DateTimeKind.Utc), End: new DateTime(2026, 3, 28, 23, 0, 0, DateTimeKind.Utc)),
            (Id: "static-13", Title: "Réunion ok", Desc: "", Start: new DateTime(2026, 4, 25, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 4, 25, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-14", Title: "Réunion ok", Desc: "", Start: new DateTime(2026, 5, 23, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 5, 23, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-15", Title: "Réunion ok", Desc: "", Start: new DateTime(2026, 6, 20, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 6, 20, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-16", Title: "Soirée festive - Après-midi / soirée", Desc: "", Start: new DateTime(2026, 7, 12, 13, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 7, 12, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-17", Title: "Réunion J", Desc: "", Start: new DateTime(2026, 7, 18, 21, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 7, 18, 23, 30, 0, DateTimeKind.Utc)),
            (Id: "static-18", Title: "Nuit des étoiles", Desc: "", Start: new DateTime(2026, 8, 1, 22, 30, 0, DateTimeKind.Utc), End: new DateTime(2026, 8, 2, 0, 30, 0, DateTimeKind.Utc)),
        };
        foreach (var (Id, Title, Desc, Start, End) in items)
        {
            if (existing.Contains(Id)) continue;
            db.StaticMeetings.Add(new StaticMeetingEntity { Id = Id, Title = Title, Description = Desc, StartDate = Start, EndDate = End });
            added++;
        }
        return added;
    }

    private static int SeedStaticGalleryMeta(AppDbContext db)
    {
        var existing = new HashSet<string>(db.StaticGalleryMeta.Select(x => x.Id));
        var added = 0;
        var titles = new[] { "Image 14", "Image 15", "Image 16", "Image 17", "Image 20", "Image 21", "Image 22", "Image 23", "Image 24", "Image 25", "Image 26", "Image 27", "Image 28", "Image 29", "Image 30", "Image 31", "Image 32", "Image 33", "Image 34", "Image 35", "Image 36", "Image 37", "Image 38", "Image 39", "Image 40", "Image 41", "Image 42", "Image 43", "Image 44", "Image 45", "Image 46", "Image 47" };
        for (var i = 0; i < titles.Length; i++)
        {
            var id = $"static-{i}";
            if (existing.Contains(id)) continue;
            db.StaticGalleryMeta.Add(new StaticGalleryMetaEntity { Id = id, Title = titles[i], Url = null, DisplayOrder = i });
            added++;
        }
        return added;
    }

    private static int SeedMeetings(AppDbContext db)
    {
        if (db.Meetings.Any()) return 0;
        var now = DateTime.UtcNow;
        db.Meetings.Add(new MeetingEntity { Title = "Réunion mensuelle", Description = "Réunion habituelle du club à la salle polyvalente.", StartDate = new DateTime(2025, 9, 19, 20, 30, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 9, 19, 22, 30, 0, DateTimeKind.Utc), CreatedAt = now });
        db.Meetings.Add(new MeetingEntity { Title = "Réunion mensuelle", Description = "Réunion habituelle du club.", StartDate = new DateTime(2025, 10, 17, 20, 30, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 10, 17, 22, 30, 0, DateTimeKind.Utc), CreatedAt = now });
        db.Meetings.Add(new MeetingEntity { Title = "Réunion mensuelle", Description = "Réunion habituelle du club.", StartDate = new DateTime(2025, 11, 21, 20, 30, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 11, 21, 22, 30, 0, DateTimeKind.Utc), CreatedAt = now });
        db.Meetings.Add(new MeetingEntity { Title = "Nuit des étoiles", Description = "Observation publique au site de Bois-Sec. Venez avec vos télescopes !", StartDate = new DateTime(2025, 8, 1, 22, 30, 0, DateTimeKind.Utc), EndDate = new DateTime(2025, 8, 2, 0, 30, 0, DateTimeKind.Utc), CreatedAt = now });
        return 4;
    }
}
