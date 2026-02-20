-- Seed galerie : métadonnées des images statiques (static_gallery_meta)
-- Une ligne = une photo. Correspond aux images du front (image 14.svg … image 47.svg).
-- Les photos uploadées (gallery_images) ne peuvent pas être restaurées par SQL :
-- il faut les re-uploader via l'interface admin.

-- ========== MÉTADONNÉES GALERIE STATIQUE (static_gallery_meta) — 1 INSERT = 1 ligne = 1 photo ==========
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-0', 'Image 14', NULL, 0) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-1', 'Image 15', NULL, 1) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-2', 'Image 16', NULL, 2) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-3', 'Image 17', NULL, 3) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-4', 'Image 20', NULL, 4) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-5', 'Image 21', NULL, 5) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-6', 'Image 22', NULL, 6) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-7', 'Image 23', NULL, 7) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-8', 'Image 24', NULL, 8) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-9', 'Image 25', NULL, 9) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-10', 'Image 26', NULL, 10) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-11', 'Image 27', NULL, 11) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-12', 'Image 28', NULL, 12) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-13', 'Image 29', NULL, 13) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-14', 'Image 30', NULL, 14) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-15', 'Image 31', NULL, 15) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-16', 'Image 32', NULL, 16) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-17', 'Image 33', NULL, 17) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-18', 'Image 34', NULL, 18) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-19', 'Image 35', NULL, 19) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-20', 'Image 36', NULL, 20) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-21', 'Image 37', NULL, 21) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-22', 'Image 38', NULL, 22) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-23', 'Image 39', NULL, 23) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-24', 'Image 40', NULL, 24) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-25', 'Image 41', NULL, 25) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-26', 'Image 42', NULL, 26) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-27', 'Image 43', NULL, 27) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-28', 'Image 44', NULL, 28) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-29', 'Image 45', NULL, 29) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-30', 'Image 46', NULL, 30) ON CONFLICT ("Id") DO NOTHING;
INSERT INTO static_gallery_meta ("Id", "Title", "Url", "DisplayOrder") VALUES ('static-31', 'Image 47', NULL, 31) ON CONFLICT ("Id") DO NOTHING;
