-- Seed galerie : métadonnées des images statiques (static_gallery_meta)
-- Correspond aux images du front (image 14.svg … image 47.svg).
-- Les photos uploadées (gallery_images) ne peuvent pas être restaurées par SQL :
-- il faut les re-uploader via l’interface admin.

-- ========== MÉTADONNÉES GALERIE STATIQUE (static_gallery_meta) ==========
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder")
VALUES
  ('static-0', 'Image 14', NULL, 0),
  ('static-1', 'Image 15', NULL, 1),
  ('static-2', 'Image 16', NULL, 2),
  ('static-3', 'Image 17', NULL, 3),
  ('static-4', 'Image 20', NULL, 4),
  ('static-5', 'Image 21', NULL, 5),
  ('static-6', 'Image 22', NULL, 6),
  ('static-7', 'Image 23', NULL, 7),
  ('static-8', 'Image 24', NULL, 8),
  ('static-9', 'Image 25', NULL, 9),
  ('static-10', 'Image 26', NULL, 10),
  ('static-11', 'Image 27', NULL, 11),
  ('static-12', 'Image 28', NULL, 12),
  ('static-13', 'Image 29', NULL, 13),
  ('static-14', 'Image 30', NULL, 14),
  ('static-15', 'Image 31', NULL, 15),
  ('static-16', 'Image 32', NULL, 16),
  ('static-17', 'Image 33', NULL, 17),
  ('static-18', 'Image 34', NULL, 18),
  ('static-19', 'Image 35', NULL, 19),
  ('static-20', 'Image 36', NULL, 20),
  ('static-21', 'Image 37', NULL, 21),
  ('static-22', 'Image 38', NULL, 22),
  ('static-23', 'Image 39', NULL, 23),
  ('static-24', 'Image 40', NULL, 24),
  ('static-25', 'Image 41', NULL, 25),
  ('static-26', 'Image 42', NULL, 26),
  ('static-27', 'Image 43', NULL, 27),
  ('static-28', 'Image 44', NULL, 28),
  ('static-29', 'Image 45', NULL, 29),
  ('static-30', 'Image 46', NULL, 30),
  ('static-31', 'Image 47', NULL, 31)
ON CONFLICT ("Id") DO NOTHING;
