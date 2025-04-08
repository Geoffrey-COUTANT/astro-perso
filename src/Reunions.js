import React, { useState } from "react";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const Reunions = () => {
    const [events] = useState([
        { title: 'Réunion A', start: new Date(2025, 1, 21, 21, 0), end: new Date(2025, 1, 21, 23, 0), description: 'Résumé de la réunion A' },
        { title: 'Réunion B', start: new Date(2025, 2, 28, 21, 0), end: new Date(2025, 2, 28, 23, 0), description: 'Résumé de la réunion B' },
        { title: 'Réunion C', start: new Date(2025, 3, 25, 21, 30), end: new Date(2025, 3, 25, 23, 30), description: 'Résumé' },
        { title: 'Réunion D', start: new Date(2025, 4, 23, 21, 30), end: new Date(2025, 4, 23, 23, 30), description: '' },
        { title: 'Réunion E', start: new Date(2025, 5, 20, 21, 30), end: new Date(2025, 5, 20, 21, 30), description: '' },
        { title: 'Soirée festive - Après-midi / soirée', start: new Date(2025, 6, 12, 13, 30), end: new Date(2025, 6, 12, 23, 30), description: '' },
        { title: 'Réunion F', start: new Date(2025, 6, 18, 21, 30), end: new Date(2025, 6, 18, 21, 30), description: '' },
        { title: 'Nuit des étoiles', start: new Date(2025, 7, 1, 22, 30), end: new Date(2025, 7, 1, 0, 30), description: '' },
        { title: 'Réunion ok', start: new Date(2026, 1, 21, 21, 0), end: new Date(2025, 1, 21, 23, 0), description: 'Résumé de la réunion A' },
        { title: 'Réunion ok', start: new Date(2026, 2, 28, 21, 0), end: new Date(2025, 2, 28, 23, 0), description: 'Résumé de la réunion B' },
        { title: 'Réunion ok', start: new Date(2026, 3, 25, 21, 30), end: new Date(2025, 3, 25, 23, 30), description: '' },
        { title: 'Réunion ok', start: new Date(2026, 4, 23, 21, 30), end: new Date(2025, 4, 23, 23, 30), description: '' },
        { title: 'Réunion ok', start: new Date(2026, 5, 20, 21, 30), end: new Date(2025, 5, 20, 21, 30), description: '' },
        { title: 'Soirée festive - Après-midi / soirée', start: new Date(2026, 6, 12, 13, 30), end: new Date(2025, 6, 12, 23, 30), description: '' },
        { title: 'Réunion J', start: new Date(2026, 6, 18, 21, 30), end: new Date(2025, 6, 18, 21, 30), description: '' },
        { title: 'Nuit des étoiles', start: new Date(2026, 7, 1, 22, 30), end: new Date(2025, 7, 1, 0, 30), description: '' }
    ])

    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setOverlayVisible(true);
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
        setSelectedEvent(null);
    };

    const filteredEvents = events.filter(event => event.start.getFullYear() === selectedYear);

    return (
        <div className="w-full bg-[url('./components/img/background-reunion.svg')] bg-cover bg-fixed bg-center min-h-screen flex flex-col text-white">
            <Header />
            <div className=" font-kodchasan flex">
                {/* Colonne de gauche (calendrier + liste) */}
                <div className="w-1/2 p-6 md:p-12 flex flex-col">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h2 className="text-xl font-semibold text-blue-500 mb-4">Liste des Réunions</h2>
                        <select
                            className="mb-4 p-2 bg-white text-black font-semibold rounded shadow"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        >
                            {[2025, 2026, 2027].map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="bg-white text-black rounded-xl shadow-lg p-3 w-full max-w-4xl">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="border border-gray-300 p-2">Date</th>
                                <th className="border border-gray-300 p-2">Titre</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center p-4">Aucune réunion prévue cette année.</td>
                                </tr>
                            ) : (
                                filteredEvents.map((event, index) => (
                                    <tr key={index} className="text-center text-sm">
                                        <td className="border text-left border-gray-300 p-2">
                                            {moment(event.start).format('dddd DD/MM/YYYY HH:mm').charAt(0).toUpperCase() +
                                                moment(event.start).format('dddd DD/MM/YYYY HH:mm').slice(1)}
                                        </td>
                                        <td className="border border-gray-300">{event.title}</td>
                                        <td className="border border-gray-300">
                                            <div className={event.description ? "block" : "invisible"}>
                                                <button
                                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    onClick={() => handleEventClick(event)}
                                                >
                                                    Voir le résumé
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Colonne de droite (texte centré) */}
                <div className="w-1/2 flex items-center justify-center p-6">
                    <div className="space-y-8">
                        <ul>
                            <li className="text-2xl font-semibold">📍 Lieu des réunions mensuelles</li>
                            <li><a
                                    href="https://maps.google.com/?q=45.31448389778514, -0.5384175550138426"
                                    target="_blank"
                                    rel="noopener"
                                    className="underline underline-offset-2 hover:text-gray-300"
                                >
                                    Salle polyvalente</a> - 17150 BOISREDON
                            </li>
                        </ul>
                        <ul>
                            <li className="text-2xl font-semibold">🔹 En cas d’indisponibilité de la salle :</li>
                            <li>Les réunions se tiendront dans <a
                                href="https://maps.google.com/?q=45.31487164048232, -0.5382009545538097"
                                target="_blank"
                                rel="noopener"
                                className="underline underline-offset-2 hover:text-gray-300"
                            >
                                    la salle des fêtes</a> ou <a
                                href="https://maps.google.com/?q=45.31533224209379,-0.5377245379285329"
                                target="_blank"
                                rel="noopener"
                                className="underline underline-offset-2 hover:text-gray-300"
                            >
                                la salle de la Mairie</a></li>
                        </ul>
                        <ul>
                            <li className="text-2xl font-semibold">🔭 Lieu des observations astronomiques :</li>
                            <li>📌 <a
                                href="https://maps.google.com/?q=45.31815775829403, -0.5432543688107226"
                                target="_blank"
                                rel="noopener"
                                className="underline underline-offset-2 hover:text-gray-300"
                            >
                                Site de “Bois-Sec”</a></li>
                            <li>📌 <a
                                href="https://maps.google.com/?q=45.31747828465985, -0.5331292135372254"
                                target="_blank"
                                rel="noopener"
                                className="underline underline-offset-2 hover:text-gray-300"
                            >
                                Chemin du stade</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            {overlayVisible && (
                <div className="fixed inset-0 font-kodchasan bg-gray-800 bg-opacity-70 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg text-blue-500 w-96">
                        <h2 className="text-2xl font-bold">{selectedEvent?.title}</h2>
                        <p className="mt-4">Date: {moment(selectedEvent?.start).format('dddd DD/MM/YYYY HH:mm')}</p>
                        <p className="mt-4">{selectedEvent?.description}</p>
                        <button
                            onClick={closeOverlay}
                            className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
            <div className='flex flex-col justify-center space-y-6 mt-4'>
                <h1 className='flex justify-center text-center items-center text-3xl'>✨ Venez nombreux explorer les merveilles du ciel avec nous ! ✨</h1>
                <Footer />
            </div>
        </div>
    );
};

export default Reunions;