-- =============================================================================
-- Données initiales (réunions, galerie statique, contact)
-- À lancer après 00_schema.sql. N’écrase rien : INSERT avec ON CONFLICT DO NOTHING.
-- Exemple : psql -h localhost -U postgres -d astro -f Api/Seed/01_seed.sql
-- =============================================================================

-- Réunions dynamiques : l’API les ajoute au 1er démarrage si la table meetings est vide.

-- Réunions statiques
INSERT INTO static_meetings ("Id", "Title", "Description", "StartDate", "EndDate")
VALUES
  ('static-1', 'Assemblée Générale', '', '2026-01-23 20:30:00+00', '2026-01-23 22:30:00+00'),
  ('static-2', 'Réunion de fin d''année', 'compte rendu de la dernière réunion de l''année', '2025-12-19 20:30:00+00', '2025-12-19 22:30:00+00'),
  ('static-3', 'Réunion A', 'Résumé de la réunion A', '2025-02-21 21:00:00+00', '2025-02-21 23:00:00+00'),
  ('static-4', 'Réunion B', 'Résumé de la réunion B', '2025-03-28 21:00:00+00', '2025-03-28 23:00:00+00'),
  ('static-5', 'Réunion C', 'Résumé de la réunion C', '2025-04-25 21:30:00+00', '2025-04-25 23:30:00+00'),
  ('static-6', 'Réunion D', 'Résumé de la réunion D', '2025-05-23 21:30:00+00', '2025-05-23 23:30:00+00'),
  ('static-7', 'Réunion E', 'Résumé de la réunion E', '2025-06-20 21:30:00+00', '2025-06-20 23:30:00+00'),
  ('static-8', 'Soirée festive - Après-midi / soirée', 'Résumé de la soirée festive', '2025-07-12 13:30:00+00', '2025-07-12 23:30:00+00'),
  ('static-9', 'Réunion F', 'Résumé de la réunion F', '2025-07-18 21:30:00+00', '2025-07-18 23:30:00+00'),
  ('static-10', 'Nuit des étoiles', 'Résumé de la nuit étoilée', '2025-08-01 22:30:00+00', '2025-08-02 00:30:00+00'),
  ('static-11', 'Réunion ok', '', '2026-02-21 21:00:00+00', '2026-02-21 23:00:00+00'),
  ('static-12', 'Réunion ok', '', '2026-03-28 21:00:00+00', '2026-03-28 23:00:00+00'),
  ('static-13', 'Réunion ok', '', '2026-04-25 21:30:00+00', '2026-04-25 23:30:00+00'),
  ('static-14', 'Réunion ok', '', '2026-05-23 21:30:00+00', '2026-05-23 23:30:00+00'),
  ('static-15', 'Réunion ok', '', '2026-06-20 21:30:00+00', '2026-06-20 23:30:00+00'),
  ('static-16', 'Soirée festive - Après-midi / soirée', '', '2026-07-12 13:30:00+00', '2026-07-12 23:30:00+00'),
  ('static-17', 'Réunion J', '', '2026-07-18 21:30:00+00', '2026-07-18 23:30:00+00'),
  ('static-18', 'Nuit des étoiles', '', '2026-08-01 22:30:00+00', '2026-08-02 00:30:00+00')
ON CONFLICT ("Id") DO NOTHING;

-- Galerie statique (métadonnées)
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder")
VALUES
  ('static-0', 'Image 14', NULL, 0), ('static-1', 'Image 15', NULL, 1), ('static-2', 'Image 16', NULL, 2), ('static-3', 'Image 17', NULL, 3),
  ('static-4', 'Image 20', NULL, 4), ('static-5', 'Image 21', NULL, 5), ('static-6', 'Image 22', NULL, 6), ('static-7', 'Image 23', NULL, 7),
  ('static-8', 'Image 24', NULL, 8), ('static-9', 'Image 25', NULL, 9), ('static-10', 'Image 26', NULL, 10), ('static-11', 'Image 27', NULL, 11),
  ('static-12', 'Image 28', NULL, 12), ('static-13', 'Image 29', NULL, 13), ('static-14', 'Image 30', NULL, 14), ('static-15', 'Image 31', NULL, 15),
  ('static-16', 'Image 32', NULL, 16), ('static-17', 'Image 33', NULL, 17), ('static-18', 'Image 34', NULL, 18), ('static-19', 'Image 35', NULL, 19),
  ('static-20', 'Image 36', NULL, 20), ('static-21', 'Image 37', NULL, 21), ('static-22', 'Image 38', NULL, 22), ('static-23', 'Image 39', NULL, 23),
  ('static-24', 'Image 40', NULL, 24), ('static-25', 'Image 41', NULL, 25), ('static-26', 'Image 42', NULL, 26), ('static-27', 'Image 43', NULL, 27),
  ('static-28', 'Image 44', NULL, 28), ('static-29', 'Image 45', NULL, 29), ('static-30', 'Image 46', NULL, 30), ('static-31', 'Image 47', NULL, 31)
ON CONFLICT ("Id") DO NOTHING;

-- Contact (une ligne par défaut)
INSERT INTO contact_info ("Id", "Email", "Phone", "AddressLine1", "AddressLine2")
VALUES (1, 'contact@example.com', '', 'Club Astro Véga de la Lyre', '17150 Boisredon')
ON CONFLICT ("Id") DO NOTHING;
