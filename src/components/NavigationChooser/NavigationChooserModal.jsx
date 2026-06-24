import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Map, Navigation, Compass } from "lucide-react";

const NAV_OPTIONS = [
    {
        id: "google",
        label: "Google Maps",
        description: "Itinéraire et repères",
        icon: Map,
        accent: "from-green-500/30 to-emerald-600/30 border-emerald-400/40 hover:border-emerald-300",
    },
    {
        id: "waze",
        label: "Waze",
        description: "Navigation communautaire",
        icon: Navigation,
        accent: "from-sky-500/30 to-cyan-600/30 border-cyan-400/40 hover:border-cyan-300",
    },
    {
        id: "apple",
        label: "Plans",
        description: "Apple Maps",
        icon: Compass,
        accent: "from-indigo-500/30 to-violet-600/30 border-violet-400/40 hover:border-violet-300",
    },
];

function NavigationChooserModal({ isOpen, onClose, placeLabel, urls }) {
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

    if (!isOpen || !urls) return null;

    const handleOpen = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 animate-fade-scale"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="nav-chooser-title"
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
                    <div className="text-center mb-2 text-4xl">🔭</div>
                    <h2 id="nav-chooser-title" className="text-2xl font-bold text-center mb-1">
                        Ouvrir l'itinéraire
                    </h2>
                    <p className="text-center text-indigo-200/90 text-sm mb-1">
                        Choisissez votre application de navigation
                    </p>
                    {placeLabel && (
                        <p className="text-center text-lg font-semibold text-blue-200 mb-6 truncate px-2">
                            📍 {placeLabel}
                        </p>
                    )}

                    <div className="space-y-3 mb-6">
                        {NAV_OPTIONS.map(({ id, label, description, icon: Icon, accent }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => handleOpen(urls[id])}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${accent} border backdrop-blur-sm transition duration-300 transform hover:scale-[1.02] text-left`}
                            >
                                <span className="flex-shrink-0 w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
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
                        className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition duration-300 text-gray-200"
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default NavigationChooserModal;
