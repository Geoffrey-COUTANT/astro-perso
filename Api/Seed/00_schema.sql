-- =============================================================================
-- Schéma complet de la BDD (PostgreSQL)
-- À lancer une fois : crée toutes les tables. Ne supprime rien.
-- Exemple : psql -h localhost -U postgres -d astro -f Api/Seed/00_schema.sql
-- =============================================================================

-- Galerie (photos uploadées)
CREATE TABLE IF NOT EXISTS gallery_images (
    "Id" uuid PRIMARY KEY,
    "FileName" varchar(256) NOT NULL,
    "Title" varchar(500) NOT NULL,
    "Description" varchar(2000) NOT NULL,
    "Order" int NOT NULL,
    "CreatedAt" timestamptz NOT NULL,
    "FileContent" bytea,
    "ContentType" text
);

-- Paramètres galerie (ordre, listes cachées, etc.)
CREATE TABLE IF NOT EXISTS gallery_settings (
    "Key" varchar(64) PRIMARY KEY,
    "Value" text NOT NULL
);

-- Réunions dynamiques (admin)
CREATE TABLE IF NOT EXISTS meetings (
    "Id" serial PRIMARY KEY,
    "Title" varchar(500) NOT NULL,
    "Description" varchar(4000) NOT NULL,
    "StartDate" timestamptz NOT NULL,
    "EndDate" timestamptz NOT NULL,
    "CreatedAt" timestamptz NOT NULL
);

-- Réunions statiques à masquer (admin)
CREATE TABLE IF NOT EXISTS meeting_hidden_static (
    "Id" serial PRIMARY KEY,
    "StaticId" varchar(128) NOT NULL
);

-- Contact (une seule ligne, Id = 1)
CREATE TABLE IF NOT EXISTS contact_info (
    "Id" int PRIMARY KEY,
    "Email" varchar(256) NOT NULL,
    "Phone" varchar(64) NOT NULL,
    "AddressLine1" varchar(500) NOT NULL,
    "AddressLine2" varchar(500) NOT NULL
);

-- Catégories de liens utiles
CREATE TABLE IF NOT EXISTS link_categories (
    "Id" uuid PRIMARY KEY,
    "Title" varchar(256) NOT NULL,
    "Order" int NOT NULL
);

-- Liens utiles
CREATE TABLE IF NOT EXISTS link_items (
    "Id" uuid PRIMARY KEY,
    "CategoryId" uuid NOT NULL REFERENCES link_categories("Id") ON DELETE CASCADE,
    "Name" varchar(256) NOT NULL,
    "Url" varchar(2000) NOT NULL,
    "Description" varchar(1000) NOT NULL,
    "Order" int NOT NULL
);
CREATE INDEX IF NOT EXISTS "IX_link_items_CategoryId" ON link_items("CategoryId");

-- Réunions statiques (calendrier type)
CREATE TABLE IF NOT EXISTS static_meetings (
    "Id" varchar(64) PRIMARY KEY,
    "Title" varchar(500) NOT NULL,
    "Description" varchar(4000) NOT NULL,
    "StartDate" timestamptz NOT NULL,
    "EndDate" timestamptz NOT NULL
);

-- Métadonnées galerie statique (images du front)
CREATE TABLE IF NOT EXISTS static_gallery_meta (
    "Id" varchar(64) PRIMARY KEY,
    "Title" varchar(500) NOT NULL,
    "Url" varchar(2000),
    "DisplayOrder" int NOT NULL
);

-- Historique des migrations EF (pour que l’API ne réapplique pas les migrations)
CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" varchar(150) PRIMARY KEY,
    "ProductVersion" varchar(32) NOT NULL
);
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES
  ('20260123000000_InitialCreate', '9.0.0'),
  ('20260123100000_StaticDataInDb', '9.0.0'),
  ('20260203100000_MeetingsIdToInt', '9.0.0')
ON CONFLICT ("MigrationId") DO NOTHING;
