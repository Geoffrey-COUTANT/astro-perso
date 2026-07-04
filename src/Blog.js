import { useEffect, useState } from "react";
import { Sparkles, Calendar, ChevronLeft, ChevronRight, X, Film, Image as ImageIcon } from "lucide-react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const API_BASE = process.env.REACT_APP_API_URL || "";

function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxAttachments, setLightboxAttachments] = useState([]);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);

    const isVideoAttachment = (att) => {
        if (!att) return false;
        const contentType = att.contentType || "";
        if (contentType.toLowerCase().startsWith("video/")) return true;
        const fileName = att.fileName || "";
        const ext = fileName.toLowerCase().split('.').pop();
        return ["mp4", "webm", "ogg", "mov"].includes(ext);
    };

    const fetchPosts = () => {
        setLoading(true);
        fetch(`${API_BASE}/api/blog`)
            .then(r => {
                if (!r.ok) throw new Error("Impossible de charger les articles.");
                return r.json();
            })
            .then(data => {
                setPosts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Handle lightbox keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!lightboxOpen) return;
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") prevMedia();
            if (e.key === "ArrowRight") nextMedia();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightboxOpen, activeMediaIndex, lightboxAttachments]);

    const openLightbox = (attachments, index) => {
        setLightboxAttachments(attachments);
        setActiveMediaIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setLightboxAttachments([]);
        setActiveMediaIndex(0);
        document.body.style.overflow = "unset";
    };

    const nextMedia = () => {
        if (lightboxAttachments.length <= 1) return;
        setActiveMediaIndex((prev) => (prev + 1) % lightboxAttachments.length);
    };

    const prevMedia = () => {
        if (lightboxAttachments.length <= 1) return;
        setActiveMediaIndex((prev) => (prev - 1 + lightboxAttachments.length) % lightboxAttachments.length);
    };

    // Render attachments in a premium Twitter/X style grid
    const renderMediaGrid = (attachments) => {
        if (!attachments || attachments.length === 0) return null;

        const count = attachments.length;

        const renderItem = (att, index, customClass = "") => {
            const isVideo = isVideoAttachment(att);
            // Append #t=0.1 to video url for preview thumbnail if it's a video
            const attUrl = `${API_BASE}${att.url}${isVideo ? "#t=0.1" : ""}`;

            return (
                <div 
                    key={att.id} 
                    onClick={() => openLightbox(attachments, index)}
                    className={`relative overflow-hidden cursor-pointer group bg-slate-900 border border-white/5 hover:border-indigo-500/50 rounded-xl transition duration-300 ${customClass}`}
                >
                    {isVideo ? (
                        <div className="w-full h-full relative flex items-center justify-center">
                            <video src={attUrl} className="w-full h-full object-cover" muted playsInline />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300 flex items-center justify-center">
                                <div className="p-3 rounded-full bg-indigo-600/90 text-white shadow-lg group-hover:scale-110 transition duration-300">
                                    <Film size={20} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full relative">
                            <img src={attUrl} alt={att.fileName} className="w-full h-full object-cover transition duration-500 group-hover:scale-102" loading="lazy" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300 flex items-center justify-center">
                                <div className="p-3 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 text-white backdrop-blur-md shadow-lg group-hover:scale-110 transition duration-300">
                                    <ImageIcon size={20} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        };

        if (count === 1) {
            return (
                <div className="mt-4 aspect-[16/10] sm:aspect-[16/9]">
                    {renderItem(attachments[0], 0, "w-full h-full")}
                </div>
            );
        }

        if (count === 2) {
            return (
                <div className="mt-4 grid grid-cols-2 gap-2 aspect-[16/10] sm:aspect-[16/9]">
                    {attachments.map((att, idx) => renderItem(att, idx, "h-full w-full"))}
                </div>
            );
        }

        if (count === 3) {
            return (
                <div className="mt-4 grid grid-cols-3 gap-2 aspect-[16/10] sm:aspect-[16/9]">
                    <div className="col-span-2 h-full">
                        {renderItem(attachments[0], 0, "h-full w-full")}
                    </div>
                    <div className="grid grid-rows-2 gap-2 h-full">
                        {renderItem(attachments[1], 1, "h-full w-full")}
                        {renderItem(attachments[2], 2, "h-full w-full")}
                    </div>
                </div>
            );
        }

        if (count === 4) {
            return (
                <div className="mt-4 grid grid-cols-2 gap-2 aspect-[16/10] sm:aspect-[16/9]">
                    {attachments.map((att, idx) => renderItem(att, idx, "h-full w-full"))}
                </div>
            );
        }

        // 5 or more attachments (symmetrical 2-row layout: 2 on top row, 3 on bottom row)
        const extraCount = count - 5;
        return (
            <div className="mt-4 grid grid-cols-6 gap-2 aspect-[16/10] sm:aspect-[16/9]">
                <div className="col-span-3 h-full">
                    {renderItem(attachments[0], 0, "h-full w-full")}
                </div>
                <div className="col-span-3 h-full">
                    {renderItem(attachments[1], 1, "h-full w-full")}
                </div>
                <div className="col-span-2 h-full">
                    {renderItem(attachments[2], 2, "h-full w-full")}
                </div>
                <div className="col-span-2 h-full">
                    {renderItem(attachments[3], 3, "h-full w-full")}
                </div>
                <div className="col-span-2 h-full relative">
                    {renderItem(attachments[4], 4, "h-full w-full")}
                    {extraCount > 0 && (
                        <div 
                            onClick={() => openLightbox(attachments, 4)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center text-white font-bold text-xl sm:text-2xl cursor-pointer hover:bg-slate-950/65 transition rounded-xl"
                        >
                            +{extraCount}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const formatPostDate = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="min-h-screen text-white relative overflow-hidden flex flex-col font-kodchasan">
            {/* Background design */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    background: "linear-gradient(135deg, #070714 0%, #0d0d2b 35%, #05050f 70%, #0f172a 100%)",
                }}
            />
            <div
                className="fixed inset-0 -z-10 opacity-30 animate-pulse-glow"
                style={{
                    backgroundImage: `radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 85% 85%, rgba(236, 72, 153, 0.1) 0%, transparent 40%)`,
                }}
            />

            <Header />

            <main className="flex-1 px-4 sm:px-6 py-12 md:py-20 relative max-w-3xl mx-auto w-full z-10">
                
                {/* Header title */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 mb-2">
                        <Sparkles className="w-8 h-8 text-indigo-300" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                        Le Blog Astro Véga
                    </h1>
                    <p className="text-gray-400 max-w-md mx-auto text-sm sm:text-base">
                        Découvrez l'actualité du Club, les photos d'observation de nos astronomes et nos derniers événements !
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-400/20 text-center">
                        <p className="text-red-200 text-sm">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin" />
                        <span className="text-gray-400 text-sm">Chargement des astres...</span>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="py-20 px-6 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center backdrop-blur-md">
                        <p className="text-gray-400 text-lg">Aucune publication pour le moment.</p>
                        <p className="text-gray-500 text-sm mt-1">Revenez bientôt pour des nouveautés passionnantes !</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {posts.map((post, idx) => (
                            <article 
                                key={post.id} 
                                className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-white/15 backdrop-blur-xl shadow-2xl transition duration-300 ease-out transform animate-float-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="space-y-4">
                                    {/* Author & Timestamp */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-white font-bold border border-white/20">
                                            AV
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm sm:text-base leading-tight">Club Astro Véga</h4>
                                            <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5 font-sans">
                                                <Calendar size={12} />
                                                <span>{formatPostDate(post.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content text */}
                                    {post.content && (
                                        <p className="text-gray-200 text-sm sm:text-base whitespace-pre-wrap font-sans break-words leading-relaxed">
                                            {post.content}
                                        </p>
                                    )}

                                    {/* Media attachment layout */}
                                    {renderMediaGrid(post.attachments)}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <Footer />

            {/* Custom Premium Media Lightbox */}
            {lightboxOpen && lightboxAttachments.length > 0 && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[200] flex flex-col items-center justify-center animate-fade-in select-none">
                    {/* Top control bar */}
                    <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/50 to-transparent flex items-center justify-between px-6 z-[210]">
                        <span className="text-sm font-semibold text-gray-400 font-sans">
                            {activeMediaIndex + 1} / {lightboxAttachments.length}
                        </span>
                        <button 
                            onClick={closeLightbox}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition hover:scale-105"
                            title="Fermer"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Central Media Content */}
                    <div className="w-full flex-1 flex items-center justify-between px-4 sm:px-12 relative">
                        
                        {/* Prev button */}
                        {lightboxAttachments.length > 1 && (
                            <button 
                                onClick={prevMedia}
                                className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition hover:scale-105 select-none focus:outline-none z-[220]"
                                title="Précédent"
                            >
                                <ChevronLeft size={30} />
                            </button>
                        )}

                        {/* Current media */}
                        <div className="flex-1 h-full max-h-[80vh] flex items-center justify-center p-2 z-[210]">
                            {isVideoAttachment(lightboxAttachments[activeMediaIndex]) ? (
                                <video 
                                    src={`${API_BASE}${lightboxAttachments[activeMediaIndex].url}`} 
                                    className="max-w-full max-h-full rounded-lg object-contain shadow-2xl" 
                                    controls 
                                    autoPlay 
                                    playsInline
                                />
                            ) : (
                                <img 
                                    src={`${API_BASE}${lightboxAttachments[activeMediaIndex].url}`} 
                                    alt="Lightbox content" 
                                    className="max-w-full max-h-full rounded-lg object-contain shadow-2xl animate-fade-scale"
                                />
                            )}
                        </div>

                        {/* Next button */}
                        {lightboxAttachments.length > 1 && (
                            <button 
                                onClick={nextMedia}
                                className="p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition hover:scale-105 select-none focus:outline-none z-[220]"
                                title="Suivant"
                            >
                                <ChevronRight size={30} />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Blog;
