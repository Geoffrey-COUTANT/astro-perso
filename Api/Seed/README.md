# BDD : tout créer avec 2 fichiers SQL

Aucune suppression : les scripts **créent** les tables et **ajoutent** les données. Tu lances les fichiers dans l’ordre et tu peux relancer l’API (GET/POST enregistrent tout en BDD).

## 1. Créer la base (une fois)

Si la base `astro` n’existe pas :

```bash
psql -h localhost -U postgres -d postgres -c "CREATE DATABASE astro;"
```

(Sur Railway, la base existe déjà.)

## 2. Créer les tables

```bash
psql -h localhost -U postgres -d astro -f Api/Seed/00_schema.sql
```

Ou sur Railway (remplace `$DATABASE_URL` par ta chaîne de connexion) :

```bash
psql "$DATABASE_URL" -f Api/Seed/00_schema.sql
```

- **00_schema.sql** : crée toutes les tables avec `CREATE TABLE IF NOT EXISTS`. Ne supprime rien.
- À la fin, il remplit `__EFMigrationsHistory` pour que l’API ne réapplique pas les migrations.

## 3. Remplir les données initiales

```bash
psql -h localhost -U postgres -d astro -f Api/Seed/01_seed.sql
```

- **01_seed.sql** : réunions statiques, galerie statique, contact. Utilise `ON CONFLICT DO NOTHING` : tu peux le relancer sans doublon. Les réunions dynamiques sont ajoutées par l’API au premier démarrage si la table est vide.

## 4. Lancer l’API

```bash
cd Api
dotnet run
```

L’API fait des **GET** (lecture) et **POST/PUT** (écriture). Rien ne supprime les tables ; tout est enregistré en BDD.

## Fichiers

| Fichier        | Rôle |
|----------------|------|
| **00_schema.sql** | Crée toutes les tables (et `__EFMigrationsHistory`). À lancer une fois. |
| **01_seed.sql**   | Données initiales (réunions, galerie statique, contact). Relançable. |
| seed_meetings.sql | Ancien script réunions seules (optionnel). |
| seed_gallery.sql  | Ancien script galerie statique seule (optionnel). |

## Photos uploadées

Les photos envoyées via l’admin sont stockées dans `gallery_images`. Les scripts SQL ne les contiennent pas ; il faut les re-uploader via le site si tu changes de BDD.
