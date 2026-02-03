using System.Text.Json;
using Api.Models;

namespace Api.Services;

public class LinksService
{
    private readonly string _dataPath;
    private static readonly JsonSerializerOptions JsonOptions = new() { WriteIndented = true };

    public LinksService(IWebHostEnvironment env)
    {
        var linksPath = Path.Combine(env.ContentRootPath, "uploads", "links");
        Directory.CreateDirectory(linksPath);
        _dataPath = Path.Combine(linksPath, "data.json");
        EnsureSeed();
    }

    private void EnsureSeed()
    {
        if (File.Exists(_dataPath)) return;
        var data = GetSeedData();
        SaveData(data);
    }

    private static LinksData GetSeedData()
    {
        var data = new LinksData();
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
            var category = new UsefulLinkCategory
            {
                Id = Guid.NewGuid(),
                Title = cat.Title,
                Order = i
            };
            var linkList = cat.Links.Select((l, j) => new UsefulLinkItem
            {
                Id = Guid.NewGuid(),
                Name = l.Name,
                Url = l.Url,
                Description = l.Description,
                Order = j
            }).ToList();
            category.Links = linkList;
            data.Categories.Add(category);
        }
        return data;
    }

    public List<UsefulLinkCategory> GetAll()
    {
        var data = LoadData();
        return data.Categories.OrderBy(c => c.Order).ToList();
    }

    public UsefulLinkCategory? GetCategory(Guid id)
    {
        return LoadData().Categories.FirstOrDefault(c => c.Id == id);
    }

    public UsefulLinkCategory UpdateCategory(Guid id, string title, List<UsefulLinkItem> links)
    {
        var data = LoadData();
        var cat = data.Categories.FirstOrDefault(c => c.Id == id);
        if (cat == null) return null!;
        cat.Title = title ?? cat.Title;
        for (var i = 0; i < links.Count; i++)
        {
            var l = links[i];
            if (l.Id == Guid.Empty) l.Id = Guid.NewGuid();
            l.Order = i;
        }
        cat.Links = links;
        SaveData(data);
        return cat;
    }

    public UsefulLinkCategory AddCategory(string title)
    {
        var data = LoadData();
        var order = data.Categories.Count > 0 ? data.Categories.Max(c => c.Order) + 1 : 0;
        var cat = new UsefulLinkCategory
        {
            Id = Guid.NewGuid(),
            Title = title,
            Order = order,
            Links = new List<UsefulLinkItem>()
        };
        data.Categories.Add(cat);
        SaveData(data);
        return cat;
    }

    public bool DeleteCategory(Guid id)
    {
        var data = LoadData();
        var cat = data.Categories.FirstOrDefault(c => c.Id == id);
        if (cat == null) return false;
        data.Categories.Remove(cat);
        SaveData(data);
        return true;
    }

    private LinksData LoadData()
    {
        if (!File.Exists(_dataPath))
            return new LinksData();
        try
        {
            var json = File.ReadAllText(_dataPath);
            return JsonSerializer.Deserialize<LinksData>(json) ?? new LinksData();
        }
        catch
        {
            return new LinksData();
        }
    }

    private void SaveData(LinksData data)
    {
        File.WriteAllText(_dataPath, JsonSerializer.Serialize(data, JsonOptions));
    }
}
