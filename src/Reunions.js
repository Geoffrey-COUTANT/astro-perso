import React, { useState } from "react";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Reunions = () => {
    const [events, setEvents] = useState([
        {title: 'Réunion', start: new Date(2025, 1, 21, 21, 0), end: new Date(2025, 1, 21, 23, 0), description: 'Résumé de la réunion' },
        {title: 'Réunion', start: new Date(2025, 2, 28, 21, 0), end: new Date(2025, 2, 28, 23, 0), description: 'Résumé de la réunion' },
        {title: 'Réunion', start: new Date(2025, 3, 25, 21, 30), end: new Date(2025, 3, 25, 23, 30),description: 'Résumé de la réunion' },
        {title: 'Réunion', start: new Date(2025, 3, 25, 21, 30), end: new Date(2025, 3, 25, 23, 30),description: 'Résumé de la réunion' },
        {title: 'Réunion', start: new Date(2025, 3, 25, 21, 30), end: new Date(2025, 3, 25, 23, 30),description: 'Résumé de la réunion' },
    ]);

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

    return (
        <div className="w-full text-white">
            <div className="bg-[url('./components/img/background-reunion.svg')] bg-cover bg-center min-h-screen flex flex-col">
                <Header />
                <div className="p-6 md:p-12 flex flex-col items-center">
                    <h2 className="text-2xl font-semibold text-blue-500 mb-8">Calendrier des Réunions à Venir</h2>
                    <div className="bg-white text-black rounded-xl shadow-lg p-4 w-full max-w-4xl">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 450 }}
                            views={['month', 'week', 'day']}
                            onSelectEvent={handleEventClick}
                            eventPropGetter={(event) => {
                                let backgroundColor = '#3174ad';
                                if (event.title === 'Réunion') {
                                    backgroundColor = '#FF6347';
                                }
                                return {
                                    style: {
                                        backgroundColor,
                                        color: 'white',
                                        borderRadius: '0.5rem',
                                    },
                                };
                            }}
                        />
                    </div>
                    <p className="mt-4 text-lg text-gray-400">Cliquez sur un événement pour plus de détails.</p>
                </div>
            </div>
            {/* Overlay fixe pour afficher les détails de l'événement */}
            {overlayVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-70 z-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg text-blue-500 w-96">
                        <h2 className="text-2xl font-bold ">{selectedEvent?.title}</h2>
                        <p className="mt-4">Date: {selectedEvent?.start.toLocaleString()}</p>
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
            <Footer />
        </div>
    );
};

export default Reunions;
