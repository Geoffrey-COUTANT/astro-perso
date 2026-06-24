import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar, CalendarPlus } from "lucide-react";
import moment from "moment";

const CALENDAR_OPTIONS = [
    {
        id: "google",
        label: "Google Agenda",
        description: "Ajouter à votre Google Agenda",
        icon: CalendarPlus,
        accent: "from-blue-500/30 to-indigo-600/30 border-indigo-400/40 hover:border-indigo-300",
    },
    {
        id: "outlook",
        label: "Outlook",
        description: "Ajouter à votre agenda Outlook",
        icon: Calendar,
        accent: "from-sky-500/30 to-blue-600/30 border-blue-400/40 hover:border-blue-300",
    },
];

function CalendarChooserModal({ isOpen, onClose, event }) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen || !event) return null;

    const formatUtcDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const handleSelect = (optionId) => {
        const title = encodeURIComponent(event.title || "Réunion Club Astro Vega");
        const description = encodeURIComponent(event.description || "");
        const startStr = formatUtcDate(event.start);
        
        // Fin à 23:59:59 du jour du début (minuit)
        const endDate = new Date(event.start);
        endDate.setHours(23, 59, 59, 999);
        const endStr = formatUtcDate(endDate);

        if (optionId === "google") {
            const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${description}`;
            window.open(url, "_blank", "noopener,noreferrer");
            onClose();
        } else if (optionId === "outlook") {
            const url = `https://outlook.live.com/calendar/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startStr}&enddt=${endStr}&body=${description}`;
            window.open(url, "_blank", "noopener,noreferrer");
            onClose();
        } else if (optionId === "ics") {
            const nowStr = formatUtcDate(new Date());
            const uniqueId = event.id || Math.random().toString(36).substring(2);
            
            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Club Astro Vega//Calendar//FR",
                "BEGIN:VEVENT",
                `UID:${uniqueId}@clubastrovega.fr`,
                `DTSTAMP:${nowStr}`,
                `DTSTART:${startStr}`,
                `DTEND:${endStr}`,
                `SUMMARY:${event.title || "Réunion Club Astro Vega"}`,
                `DESCRIPTION:${event.description || ""}`,
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\r\n");

            const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${(event.title || "reunion").replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            onClose();
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 animate-fade-scale"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cal-chooser-title"
        >
            <div
                className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-8 max-w-md w-full text-white overflow-hidden animate-zoom-rotate shadow-2xl border border-white/10 font-kodchasan"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute top-6 left-8 w-1 h-1 bg-white rounded-full animate-pulse" />
                    <div className="absolute top-12 right-10 w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                    <div className="absolute top-20 left-1/3 w-1 h-1 bg-purple-200 rounded-full animate-pulse" style={{ animationDelay: "0.8s" }} />
                    <div className="absolute bottom-16 right-8 w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: "1.2s" }} />
                    <div className="absolute bottom-24 left-6 w-1 h-1 bg-indigo-200 rounded-full animate-pulse" style={{ animationDelay: "1.6s" }} />
                </div>

                <div className="relative z-10">
                    <div className="text-center mb-2 text-4xl">📅</div>
                    <h2 id="cal-chooser-title" className="text-2xl font-bold text-center mb-1">
                        Ajouter à mon agenda
                    </h2>
                    <p className="text-center text-indigo-200/90 text-sm mb-4">
                        Choisissez votre application d'agenda
                    </p>

                    {event && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 text-center">
                            <p className="text-base font-bold text-blue-200 line-clamp-2 px-1">
                                {event.title}
                            </p>
                            <p className="text-xs text-indigo-200/80 mt-1">
                                {moment(event.start).format("dddd DD MMMM YYYY à HH:mm")}
                            </p>
                            {event.description && (
                                <div className="border-t border-white/10 pt-2 mt-2 text-left">
                                    <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                                        Description
                                    </p>
                                    <p className="text-xs text-gray-300 max-h-20 overflow-y-auto custom-scrollbar pr-1 whitespace-pre-wrap break-words">
                                        {event.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-3 mb-6">
                        {CALENDAR_OPTIONS.map(({ id, label, description, icon: Icon, accent }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleSelect(id)}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${accent} border backdrop-blur-sm transition duration-300 transform hover:scale-[1.02] text-left`}
                            >
                                <span className="flex-shrink-0 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-indigo-200" />
                                </span>
                                <span>
                                    <span className="block font-bold text-lg">{label}</span>
                                    <span className="block text-sm text-gray-300">{description}</span>
                                </span>
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition duration-300 text-gray-200 font-semibold"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default CalendarChooserModal;
