# Seed SQL pour la base de données

Ces scripts permettent de réinjecter en base les **réunions** et les **métadonnées de la galerie statique** après une réinitialisation ou une migration.

## Prérequis

- PostgreSQL avec les tables déjà créées (migrations EF Core appliquées).
- Connexion à la BDD (ex. variable `DATABASE_URL` ou `psql -h ... -U ... -d ...`).

## Exécution

```bash
# Depuis la racine du projet (ou depuis Api/)
psql "$DATABASE_URL" -f Api/Seed/seed_meetings.sql
psql "$DATABASE_URL" -f Api/Seed/seed_gallery.sql
```

Ou depuis un client SQL (DBeaver, pgAdmin, etc.) : ouvrir chaque fichier et exécuter son contenu.

## Contenu des scripts

| Fichier | Tables | Description |
|--------|--------|-------------|
| `seed_meetings.sql` | `meetings`, `static_meetings` | Réunions dynamiques (quelques exemples) + réunions statiques (calendrier type du club). |
| `seed_gallery.sql` | `static_gallery_meta` | Métadonnées des images statiques de la galerie (static-0 à static-31, correspondant aux images 14–47 du front). |

## Photos uploadées (`gallery_images`)

Les **photos uploadées** (fichiers binaires) ne peuvent **pas** être restaurées par SQL. Si tu as perdu le contenu de la table `gallery_images`, il faut **re-uploader les photos** via l’interface admin (/admin → Galerie). Les scripts ci-dessus ne touchent pas à `gallery_images`.

## Réexécution

- **seed_meetings.sql** : chaque exécution **ajoute** de nouvelles lignes dans `meetings`. Pour éviter les doublons, exécute une seule fois ou vide la table `meetings` avant de réexécuter. Les inserts dans `static_meetings` utilisent `ON CONFLICT DO NOTHING` (pas de doublon sur l’id).
- **seed_gallery.sql** : `ON CONFLICT ("Id") DO NOTHING` — tu peux réexécuter sans créer de doublons.
