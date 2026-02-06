/**
 * Réunions statiques de secours : affichées quand l'API n'est pas dispo ou retourne vide.
 * Même liste que le seed côté API (static_meetings).
 */
const titles = [
    "Assemblée Générale",
    "Réunion de fin d'année",
    "Réunion A", "Réunion B", "Réunion C", "Réunion D", "Réunion E", "Réunion F",
    "Soirée festive - Après-midi / soirée",
    "Nuit des étoiles",
    "Réunion ok", "Réunion ok", "Réunion ok", "Réunion ok", "Réunion ok",
    "Soirée festive - Après-midi / soirée",
    "Réunion J",
    "Nuit des étoiles",
];

const startDates = [
    "2026-01-23T20:30:00.000Z", "2025-12-19T20:30:00.000Z",
    "2025-02-21T21:00:00.000Z", "2025-03-28T21:00:00.000Z", "2025-04-25T21:30:00.000Z", "2025-05-23T21:30:00.000Z", "2025-06-20T21:30:00.000Z",
    "2025-07-12T13:30:00.000Z", "2025-07-18T21:30:00.000Z", "2025-08-01T22:30:00.000Z",
    "2026-02-21T21:00:00.000Z", "2026-03-28T21:00:00.000Z", "2026-04-25T21:30:00.000Z", "2026-05-23T21:30:00.000Z", "2026-06-20T21:30:00.000Z",
    "2026-07-12T13:30:00.000Z", "2026-07-18T21:30:00.000Z", "2026-08-01T22:30:00.000Z",
];

const endDates = [
    "2026-01-23T22:30:00.000Z", "2025-12-19T22:30:00.000Z",
    "2025-02-21T23:00:00.000Z", "2025-03-28T23:00:00.000Z", "2025-04-25T23:30:00.000Z", "2025-05-23T23:30:00.000Z", "2025-06-20T23:30:00.000Z",
    "2025-07-12T23:30:00.000Z", "2025-07-18T23:30:00.000Z", "2025-08-02T00:30:00.000Z",
    "2026-02-21T23:00:00.000Z", "2026-03-28T23:00:00.000Z", "2026-04-25T23:30:00.000Z", "2026-05-23T23:30:00.000Z", "2026-06-20T23:30:00.000Z",
    "2026-07-12T23:30:00.000Z", "2026-07-18T23:30:00.000Z", "2026-08-02T00:30:00.000Z",
];

const descriptions = [
    "", "compte rendu de la dernière réunion de l'année",
    "Résumé de la réunion A", "Résumé de la réunion B", "Résumé de la réunion C", "Résumé de la réunion D", "Résumé de la réunion E",
    "Résumé de la soirée festive", "Résumé de la réunion F", "Résumé de la nuit étoilée",
    "", "", "", "", "", "", "", "",
];

/** Événements au format attendu par Reunions.js (id, title, description, start, end). */
export function getStaticMeetingsFallback() {
    return titles.map((title, i) => ({
        id: `static-${i + 1}`,
        title,
        description: descriptions[i] ?? "",
        start: new Date(startDates[i]),
        end: new Date(endDates[i]),
    })).sort((a, b) => a.start - b.start);
}
