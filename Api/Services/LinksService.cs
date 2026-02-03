using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Services;

public class LinksService
{
    private readonly IDbContextFactory<AppDbContext> _dbFactory;

    public LinksService(IDbContextFactory<AppDbContext> dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public List<UsefulLinkCategory> GetAll()
    {
        using var db = _dbFactory.CreateDbContext();
        EnsureSeed(db);
        return db.LinkCategories
            .Include(c => c.Links)
            .OrderBy(c => c.Order)
            .Select(c => new UsefulLinkCategory
            {
                Id = c.Id,
                Title = c.Title,
                Order = c.Order,
                Links = c.Links.OrderBy(l => l.Order).Select(l => new UsefulLinkItem
                {
                    Id = l.Id,
                    Name = l.Name,
                    Url = l.Url,
                    Description = l.Description,
                    Order = l.Order
                }).ToList()
            })
            .ToList();
    }

    public UsefulLinkCategory? GetCategory(Guid id)
    {
        using var db = _dbFactory.CreateDbContext();
        var c = db.LinkCategories.Include(x => x.Links).FirstOrDefault(x => x.Id == id);
        return c == null ? null : ToModel(c);
    }

    public UsefulLinkCategory UpdateCategory(Guid id, string title, List<UsefulLinkItem> links)
    {
        using var db = _dbFactory.CreateDbContext();
        var cat = db.LinkCategories.Include(x => x.Links).FirstOrDefault(c => c.Id == id);
        if (cat == null) return null!;
        cat.Title = title ?? cat.Title;
        db.LinkItems.RemoveRange(cat.Links);
        for (var i = 0; i < links.Count; i++)
        {
            var l = links[i];
            if (l.Id == Guid.Empty) l.Id = Guid.NewGuid();
            cat.Links.Add(new LinkItemEntity
            {
                Id = l.Id,
                CategoryId = cat.Id,
                Name = l.Name,
                Url = l.Url,
                Description = l.Description ?? "",
                Order = i
            });
        }
        db.SaveChanges();
        return ToModel(db.LinkCategories.Include(x => x.Links).First(x => x.Id == id));
    }

    public UsefulLinkCategory AddCategory(string title)
    {
        using var db = _dbFactory.CreateDbContext();
        var order = db.LinkCategories.Any() ? db.LinkCategories.Max(c => c.Order) + 1 : 0;
        var cat = new LinkCategoryEntity
        {
            Id = Guid.NewGuid(),
            Title = title,
            Order = order,
            Links = new List<LinkItemEntity>()
        };
        db.LinkCategories.Add(cat);
        db.SaveChanges();
        return ToModel(cat);
    }

    public bool DeleteCategory(Guid id)
    {
        using var db = _dbFactory.CreateDbContext();
        var cat = db.LinkCategories.Find(id);
        if (cat == null) return false;
        db.LinkCategories.Remove(cat);
        db.SaveChanges();
        return true;
    }

    private static UsefulLinkCategory ToModel(LinkCategoryEntity c)
    {
        return new UsefulLinkCategory
        {
            Id = c.Id,
            Title = c.Title,
            Order = c.Order,
            Links = c.Links.OrderBy(l => l.Order).Select(l => new UsefulLinkItem
            {
                Id = l.Id,
                Name = l.Name,
                Url = l.Url,
                Description = l.Description,
                Order = l.Order
            }).ToList()
        };
    }

    private static void EnsureSeed(AppDbContext db)
    {
        if (db.LinkCategories.Any()) return;
        var categories = new[]
        {
            new { Title = "📰 Actualités Astronomiques", Links = new[] {
                new { Name = "Les nouvelles de LTE - Observatoire de Paris", Url = "https://www.imcce.fr/", Description = "Actualités de l'Institut de Mécanique Céleste et de Calcul des Éphémérides" },
                new { Name = "Le guide du ciel de Guillaume CANNAT", Url = "http://www.leguideduciel.net/", Description = "Guide mensuel du ciel et actualités astronomiques" },
                new { Name = "Société Astronomique de France", Url = "https://saf-astronomie.fr/", Description = "Actualités et ressources de la SAF" },
                new { Name = "AFA - Association Française d'Astronomie", Url = "https://www.afastronomie.fr/actualites", Description = "Actualités de l'AFA" },
                new { Name = "Les news de Web astro", Url = "https://www.webastro.net/actualites/", Description = "Actualités astronomiques de Webastro" },
                new { Name = "Star Walk", Url = "https://starwalk.space/fr/news/", Description = "Actualités et guides d'astronomie" }
            }},
            new { Title = "📺 Chaînes YouTube", Links = new[] {
                new { Name = "SAF - Chaîne YouTube", Url = "https://www.youtube.com/channel/UCD6H5ugytjb0FM9CGLUn0Xw", Description = "Chaîne YouTube de la Société Astronomique de France" },
                new { Name = "AFA - Chaîne YouTube", Url = "https://www.youtube.com/@AfastronomieFr", Description = "Chaîne YouTube de l'Association Française d'Astronomie" }
            }},
            new { Title = "🌐 Sites d'Astronomie Générale", Links = new[] {
                new { Name = "Astrosurf", Url = "https://www.astrosurf.com", Description = "Portail de l'astronomie amateur" },
                new { Name = "Ciel & Espace", Url = "https://www.cieletespace.fr", Description = "Magazine d'astronomie" },
                new { Name = "Astronomie Magazine", Url = "https://www.astronomie-magazine.fr", Description = "Magazine spécialisé" }
            }},
            new { Title = "🔭 Observation et Équipement", Links = new[] {
                new { Name = "Stellarium", Url = "https://stellarium.org", Description = "Planétarium open source" },
                new { Name = "Cartes du Ciel", Url = "https://www.ap-i.net/skychart", Description = "Logiciel de cartographie céleste" },
                new { Name = "Heavens Above", Url = "https://www.heavens-above.com", Description = "Prévisions de passages de satellites" },
                new { Name = "In The Sky", Url = "https://in-the-sky.org", Description = "Calendrier astronomique et événements" }
            }},
            new { Title = "🌌 Météo et Conditions d'Observation", Links = new[] {
                new { Name = "MétéoBlue - Seeing", Url = "https://www.meteoblue.com/fr/meteo/outdoorsports/seeing", Description = "Prévisions de seeing" },
                new { Name = "Clear Outside", Url = "https://clearoutside.com", Description = "Prévisions météo pour l'astronomie" },
                new { Name = "Astrospheric", Url = "https://www.astrospheric.com", Description = "Météo astronomique (en anglais)" }
            }}
        };
        for (var i = 0; i < categories.Length; i++)
        {
            var cat = categories[i];
            var category = new LinkCategoryEntity
            {
                Id = Guid.NewGuid(),
                Title = cat.Title,
                Order = i
            };
            var linkList = cat.Links.Select((l, j) => new LinkItemEntity
            {
                Id = Guid.NewGuid(),
                CategoryId = category.Id,
                Name = l.Name,
                Url = l.Url,
                Description = l.Description,
                Order = j
            }).ToList();
            category.Links = linkList;
            db.LinkCategories.Add(category);
        }
        db.SaveChanges();
    }
}
