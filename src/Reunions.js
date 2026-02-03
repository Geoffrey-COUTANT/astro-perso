import React, { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import moment from 'moment';
import 'moment/locale/fr';
import { Calendar, MapPin, Clock, Info } from "lucide-react";
import { staticMeetings } from "./data/staticMeetings";

moment.locale('fr');

const API_BASE = process.env.REACT_APP_API_URL || "";

const Reunions = () => {
    const [events, setEvents] = useState([...staticMeetings]);

    useEffect(() => {
        if (!API_BASE) {
            setEvents([...staticMeetings]);
            return;
        }
        Promise.all([
            fetch(`${API_BASE}/api/meetings`).then((r) => (r.ok ? r.json() : [])),
            fetch(`${API_BASE}/api/meetings/hidden-static`).then((r) => (r.ok ? r.json() : [])),
        ])
            .then(([data, hiddenIds]) => {
                const hidden = Array.isArray(hiddenIds) ? hiddenIds : [];
                const visibleStatic = staticMeetings.filter((m) => !hidden.includes(m.id));
                const fromApi = Array.isArray(data)
                    ? data.map((m) => ({
                          id: m.id,
                          title: m.title,
                          description: m.description || "",
                          start: new Date(m.startDate),
                          end: new Date(m.endDate),
                      }))
                    : [];
                const merged = [...visibleStatic, ...fromApi].sort((a, b) => a.start - b.start);
                setEvents(merged);
            })
            .catch(() => {
                setEvents([...staticMeetings]);
            });
    }, []);

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [displayLimit, setDisplayLimit] = useState(2);
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!isInitialized.current && events.length > 0) {
            const currentYear = new Date().getFullYear();
            const availableYears = [...new Set(events.map(e => e.start.getFullYear()))].sort();
            if (availableYears.includes(currentYear)) {
                setSelectedYear(currentYear);
            } else if (availableYears.length > 0) {
                setSelectedYear(availableYears[0]);
            }
            isInitialized.current = true;
        }
    }, [events]);

    useEffect(() => {
        setDisplayLimit(2);
    }, [selectedYear]);

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setOverlayVisible(true);
    };

    const closeOverlay = () => {
        setOverlayVisible(false);
        setSelectedEvent(null);
    };

    const filteredEvents = events.filter(event => event.start.getFullYear() === selectedYear);
    const availableYears = [...new Set(events.map(e => e.start.getFullYear()))].sort();
    const yearsToShow = availableYears.length > 0 ? availableYears : [new Date().getFullYear()];
    
    const now = new Date();
    const pastEvents = filteredEvents.filter(e => e.start < now).sort((a, b) => b.start - a.start);
    const upcomingEvents = filteredEvents.filter(e => e.start >= now).sort((a, b) => a.start - b.start);
    
    const displayedUpcoming = upcomingEvents.slice(0, displayLimit);
    const displayedPast = pastEvents;
    const hasMore = upcomingEvents.length > displayLimit;

    const getEventType = (title) => {
        if (title.toLowerCase().includes('nuit des étoiles')) return 'special';
        if (title.toLowerCase().includes('soirée')) return 'festive';
        return 'regular';
    };

    return (
        <div className="w-full bg-[url('./components/img/background-reunion.svg')] bg-cover bg-fixed bg-center min-h-screen flex flex-col text-white">
            <Header />
            
            <main className="flex-grow px-6 py-12 font-kodchasan font-medium">
                <div className="text-center mb-12 animate-zoom-rotate">
                    <h1 className="text-5xl font-bold mb-4">📅 Réunions & Événements</h1>
                    <p className="text-xl text-gray-300">Découvrez nos prochaines activités astronomiques</p>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 animate-slide-left">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Calendar className="w-6 h-6" />
                                        Calendrier {selectedYear}
                                    </h2>
                                    <select
                                        className="p-2 bg-white bg-opacity-20 text-white font-semibold rounded-lg border border-white border-opacity-30 focus:outline-none focus:border-opacity-50"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    >
                                        {yearsToShow.map((year) => (
                                            <option key={year} value={year} className="bg-gray-800">{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {filteredEvents.length === 0 ? (
                                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center animate-fade-scale">
                                        <p className="text-xl text-gray-300">Aucune réunion prévue pour {selectedYear}.</p>
                                    </div>
                                ) : (
                                    <>
                                        {upcomingEvents.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="text-2xl font-bold mb-4 text-green-400">📅 À venir</h3>
                                                <div className="space-y-3">
                                                    {displayedUpcoming.map((event, index) => {
                                                        const eventType = getEventType(event.title);
                                                        return (
                                                            <div
                                                                key={`upcoming-${index}`}
                                                                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-opacity-20 hover:scale-[1.02] cursor-pointer animate-float-in"
                                                                style={{ animationDelay: `${index * 50}ms` }}
                                                                onClick={() => event.description && handleEventClick(event)}
                                                                onMouseEnter={() => setHoveredEvent(`upcoming-${index}`)}
                                                                onMouseLeave={() => setHoveredEvent(null)}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                                        eventType === 'special' ? 'bg-yellow-400' :
                                                                        eventType === 'festive' ? 'bg-pink-400' :
                                                                        'bg-blue-400'
                                                                    } ${hoveredEvent === `upcoming-${index}` ? 'animate-pulse' : ''}`} />
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="text-lg font-bold truncate">{event.title}</h3>
                                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mt-1">
                                                                            <span className="flex items-center gap-1">
                                                                                <Calendar className="w-3 h-3" />
                                                                                {moment(event.start).format('DD MMM YYYY')}
                                                                            </span>
                                                                            <span className="flex items-center gap-1">
                                                                                <Clock className="w-3 h-3" />
                                                                                {moment(event.start).format('HH:mm')}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {event.description && (
                                                                        <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {hasMore && (
                                            <div className="text-center">
                                                <button
                                                    onClick={() => setDisplayLimit(upcomingEvents.length)}
                                                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 hover:scale-105"
                                                >
                                                    Voir plus de réunions ({upcomingEvents.length - displayLimit} restantes)
                                                </button>
                                            </div>
                                        )}

                                        {displayLimit > 2 && (
                                            <div className="text-center mt-2">
                                                <button
                                                    onClick={() => setDisplayLimit(2)}
                                                    className="text-gray-400 hover:text-white text-sm underline transition"
                                                >
                                                    Réduire l'affichage
                                                </button>
                                            </div>
                                        )}

                                        {pastEvents.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="text-2xl font-bold mb-4 text-gray-400">📜 Passées</h3>
                                                <div className="space-y-2">
                                                    {displayedPast.map((event, index) => {
                                                        const eventType = getEventType(event.title);
                                                        const hasDescription = event.description && typeof event.description === 'string' && event.description.trim().length > 0;
                                                        return (
                                                            <div
                                                                key={`past-${index}`}
                                                                className={`bg-white bg-opacity-5 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 ${
                                                                    hasDescription ? 'hover:bg-opacity-15 cursor-pointer hover:scale-[1.02]' : 'opacity-70 cursor-default'
                                                                }`}
                                                                onClick={(e) => {
                                                                    if (hasDescription) {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleEventClick(event);
                                                                    }
                                                                }}
                                                                onMouseEnter={() => hasDescription && setHoveredEvent(`past-${index}`)}
                                                                onMouseLeave={() => setHoveredEvent(null)}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                                        eventType === 'special' ? 'bg-yellow-400' :
                                                                        eventType === 'festive' ? 'bg-pink-400' :
                                                                        'bg-blue-400'
                                                                    }`} />
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="text-sm font-semibold truncate">{event.title}</h4>
                                                                        <p className="text-xs text-gray-400">{moment(event.start).format('DD MMM YYYY')}</p>
                                                                    </div>
                                                                    {hasDescription && (
                                                                        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 hover:text-blue-300 transition" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 animate-slide-right">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <MapPin className="w-6 h-6" />
                                    Lieux
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">📍 Réunions mensuelles</h3>
                                        <a
                                            href="https://maps.google.com/?q=45.31448389778514, -0.5384175550138426"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-400 hover:text-blue-300 underline block"
                                        >
                                            Salle polyvalente
                                        </a>
                                        <p className="text-gray-300 text-sm">17150 BOISREDON</p>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">🔹 Salles alternatives</h3>
                                        <p className="text-sm text-gray-300 mb-2">En cas d'indisponibilité :</p>
                                        <ul className="space-y-1 text-sm">
                                            <li>
                                                <a
                                                    href="https://maps.google.com/?q=45.31487164048232, -0.5382009545538097"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 underline"
                                                >
                                                    Salle des fêtes
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="https://maps.google.com/?q=45.31533224209379,-0.5377245379285329"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 underline"
                                                >
                                                    Salle de la Mairie
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">🔭 Observations</h3>
                                        <ul className="space-y-1 text-sm">
                                            <li>
                                                <a
                                                    href="https://maps.google.com/?q=45.31815775829403, -0.5432543688107226"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 underline"
                                                >
                                                    Site de "Bois-Sec"
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="https://maps.google.com/?q=45.31747828465985, -0.5331292135372254"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 underline"
                                                >
                                                    Chemin du stade
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 bg-opacity-20 backdrop-blur-sm rounded-xl p-6 animate-bounce-in">
                                <h2 className="text-2xl font-bold mb-3">✨ Rejoignez-nous !</h2>
                                <p className="text-gray-200">
                                    Venez nombreux explorer les merveilles du ciel avec nous lors de nos prochaines réunions et observations !
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {overlayVisible && selectedEvent && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-scale"
                    onClick={closeOverlay}
                >
                    <div 
                        className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar text-white animate-zoom-rotate"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-3xl font-bold">{selectedEvent.title}</h2>
                            <button
                                onClick={closeOverlay}
                                className="text-3xl hover:text-gray-300 transition"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span className="text-lg">
                                    {moment(selectedEvent.start).format('dddd DD MMMM YYYY')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span className="text-lg">
                                    {moment(selectedEvent.start).format('HH:mm')} - {moment(selectedEvent.end).format('HH:mm')}
                                </span>
                            </div>
                            {selectedEvent.description && (
                                <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                        Description
                                    </h3>
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar pr-2">
                                        <p className="text-base leading-relaxed whitespace-pre-wrap break-words">
                                            {selectedEvent.description}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={closeOverlay}
                            className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
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
