-- Seed réunions : table meetings (dynamiques) + static_meetings (statiques)
-- À exécuter après les migrations, sur une BDD PostgreSQL.
-- Les IDs de meetings sont auto-générés (serial), on n'insère que les données.

-- ========== RÉUNIONS DYNAMIQUES (meetings) ==========
-- Quelques réunions types du club. Tu peux en ajouter/modifier via l'admin.
INSERT INTO meetings ("Title", "Description", "StartDate", "EndDate", "CreatedAt")
VALUES
  ('Réunion mensuelle', 'Réunion habituelle du club à la salle polyvalente.', '2025-09-19 20:30:00+00', '2025-09-19 22:30:00+00', NOW()),
  ('Réunion mensuelle', 'Réunion habituelle du club.', '2025-10-17 20:30:00+00', '2025-10-17 22:30:00+00', NOW()),
  ('Réunion mensuelle', 'Réunion habituelle du club.', '2025-11-21 20:30:00+00', '2025-11-21 22:30:00+00', NOW()),
  ('Nuit des étoiles', 'Observation publique au site de Bois-Sec. Venez avec vos télescopes !', '2025-08-01 22:30:00+00', '2025-08-02 00:30:00+00', NOW());

-- ========== RÉUNIONS STATIQUES (static_meetings) ==========
-- Données qui étaient auparavant seedées par l’API au premier appel.
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
