import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getStaticImageUrl, allImages } from "./data/galleryStaticImages";

const API_BASE = process.env.REACT_APP_API_URL || "";

const FALLBACK_STATIC_IMAGES = allImages.map((url, i) => ({
    id: `static-${i}`,
    title: `Image ${[14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47][i]}`,
    description: "Photo d'astronomie du Club Astro Véga de la Lyre",
    url: url || getStaticImageUrl(`static-${i}`) || "",
}));

function mod(n, m) {
    return ((n % m) + m) % m;
}

function Galerie() {
    const [apiImages, setApiImages] = useState([]);
    const [hiddenStaticIds, setHiddenStaticIds] = useState([]);
    const [unifiedOrder, setUnifiedOrder] = useState([]);

    const [staticListFromApi, setStaticListFromApi] = useState([]);

    useEffect(() => {
        if (API_BASE) {
            Promise.all([
                fetch(`${API_BASE}/api/gallery`).then((r) => (r.ok ? r.json() : [])),
                fetch(`${API_BASE}/api/gallery/static-list`).then((r) => (r.ok ? r.json() : [])),
                fetch(`${API_BASE}/api/gallery/hidden-static`).then((r) => (r.ok ? r.json() : [])),
                fetch(`${API_BASE}/api/gallery/unified-order`).then((r) => (r.ok ? r.json() : [])),
            ])
                .then(([apiData, staticData, hiddenData, orderData]) => {
                    setApiImages(Array.isArray(apiData) ? apiData.filter((img) => img != null).map((img, idx) => ({
                        id: String(img.id),
                        title: img.title || `Image ${idx + 1}`,
                        description: img.description || "Photo d'astronomie du Club Astro Véga de la Lyre",
                        url: img.url?.startsWith("http") ? img.url : (img.url ? `${API_BASE}${img.url}` : `${API_BASE}/api/gallery/${img.id}/file`),
                    })) : []);
                    setStaticListFromApi(Array.isArray(staticData) && staticData.length > 0 ? staticData : FALLBACK_STATIC_IMAGES);
                    setHiddenStaticIds(Array.isArray(hiddenData) ? hiddenData : []);
                    setUnifiedOrder(Array.isArray(orderData) ? orderData : []);
                })
                .catch(() => {
                    setStaticListFromApi(FALLBACK_STATIC_IMAGES);
                });
        } else {
            setStaticListFromApi(FALLBACK_STATIC_IMAGES);
        }
    }, []);

    const staticImages = useMemo(
        () =>
            staticListFromApi
                .filter((item) => item != null && item.id != null)
                .map((item, idx) => ({
                    id: item.id,
                    title: item.title || `Image ${idx + 1}`,
                    description: "Photo d'astronomie du Club Astro Véga de la Lyre",
                    url: item.url || getStaticImageUrl(item.id) || "",
                })),
        [staticListFromApi]
    );

    const visibleStatic = useMemo(
        () => staticImages.filter((img) => !hiddenStaticIds.includes(img.id)),
        [staticImages, hiddenStaticIds]
    );

    const images = useMemo(() => {
        const all = [...apiImages, ...visibleStatic];
        if (unifiedOrder.length === 0) return all;
        const orderMap = new Map(unifiedOrder.map((id, i) => [id, i]));
        return all.sort((a, b) => {
            const ia = orderMap.has(a.id) ? orderMap.get(a.id) : 9999;
            const ib = orderMap.has(b.id) ? orderMap.get(b.id) : 9999;
            return ia - ib;
        });
    }, [apiImages, visibleStatic, unifiedOrder]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const idleTimeoutRef = useRef(null);

    const pointerDownRef = useRef(false);
    const startXRef = useRef(0);
    const deltaXRef = useRef(0);

    const resetIdle = () => {
        setIsUserInteracting(true);
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = setTimeout(() => setIsUserInteracting(false), 3500);
    };

    const next = () => {
        resetIdle();
        setCurrentIndex((i) => mod(i + 1, images.length));
    };

    const prev = () => {
        resetIdle();
        setCurrentIndex((i) => mod(i - 1, images.length));
    };

    useEffect(() => {
        if (images.length === 0) return;
        if (isUserInteracting || pointerDownRef.current || selectedImage) return;

        const t = setInterval(() => {
            setCurrentIndex((i) => mod(i + 1, images.length));
        }, 4500);

        return () => clearInterval(t);
    }, [images.length, isUserInteracting, selectedImage]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Escape") setSelectedImage(null);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images.length]);

    useEffect(() => {
        return () => {
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
        };
    }, []);

    const slots = [-2, -1, 0, 1, 2];
    const visible = images.length === 0
        ? []
        : slots.map((offset) => {
            const idx = mod(currentIndex + offset, images.length);
            const img = images[idx];
            return img ? { offset, idx, img } : null;
        }).filter(Boolean);

    const onPointerDown = (e) => {
        resetIdle();
        pointerDownRef.current = true;
        startXRef.current = e.clientX;
        deltaXRef.current = 0;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch {  }
    };

    const onPointerMove = (e) => {
        if (!pointerDownRef.current) return;
        deltaXRef.current = e.clientX - startXRef.current;
    };

    const onPointerUp = () => {
        if (!pointerDownRef.current) return;
        pointerDownRef.current = false;
        const dx = deltaXRef.current;
        deltaXRef.current = 0;
        if (Math.abs(dx) > 60) {
            if (dx < 0) next();
            else prev();
        }
    };

    return (
        <div className="w-full text-white text-center">
            <div className='bg-[url("./components/img/background-galerie.jpg")] bg-cover bg-center bg-fixed min-h-screen flex flex-col'>
                <Header />

                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full">
                    <h1 className="text-5xl font-bold mb-10 text-center w-full animate-zoom-rotate">
                        📸 Galerie Photos
                    </h1>

                    <div className="w-full max-w-6xl relative select-none">
                        <button
                            onClick={prev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition duration-300 hover:scale-110"
                            aria-label="Image précédente"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 transition duration-300 hover:scale-110"
                            aria-label="Image suivante"
                        >
                            <ChevronRight size={32} />
                        </button>

                        <div
                            className="relative h-[420px] flex items-center justify-center overflow-hidden"
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerUp}
                            onMouseEnter={resetIdle}
                            onWheel={resetIdle}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-[1px]" />

                            {visible.map(({ offset, img }) => {
                                if (!img || img.url == null) return null;
                                const isCenter = offset === 0;

                                const x = offset * 260;
                                const scale = isCenter ? 1 : (Math.abs(offset) === 1 ? 0.82 : 0.65);
                                const rotateY = isCenter ? 0 : (offset < 0 ? 22 : -22);
                                const opacity = isCenter ? 1 : (Math.abs(offset) === 1 ? 0.75 : 0.35);
                                const z = isCenter ? 30 : (Math.abs(offset) === 1 ? 20 : 10);

                                return (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => {
                                            resetIdle();
                                            if (isCenter) setSelectedImage(img);
                                            else offset < 0 ? prev() : next();
                                        }}
                                        className="absolute outline-none"
                                        style={{
                                            transform: `translateX(${x}px) perspective(1200px) rotateY(${rotateY}deg) scale(${scale})`,
                                            opacity,
                                            zIndex: z,
                                            transition: pointerDownRef.current ? "none" : "transform 420ms ease, opacity 420ms ease",
                                        }}
                                    >
                                        <div className={`rounded-2xl overflow-hidden bg-white bg-opacity-10 backdrop-blur-sm shadow-2xl ${isCenter ? "ring-2 ring-white ring-opacity-30" : ""}`}>
                                            <div className="w-[520px] max-w-[70vw] h-[320px]">
                                                <img
                                                    src={img.url}
                                                    alt={img.title}
                                                    className="w-full h-full object-cover"
                                                    draggable={false}
                                                />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        resetIdle();
                                        setCurrentIndex(i);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-10 bg-blue-500" : "w-2 bg-white bg-opacity-30 hover:bg-opacity-50"}`}
                                    aria-label={`Aller à l'image ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fade-scale"
                            onClick={() => setSelectedImage(null)}
                        >
                            <div className="max-w-5xl max-h-full relative" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center transition hover:scale-110"
                                >
                                    ×
                                </button>
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.title}
                                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                                />
                                <div className="bg-white bg-opacity-10 backdrop-blur-sm p-4 mt-4 rounded-lg text-left">
                                    <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                                    <p className="text-lg text-gray-300">{selectedImage.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default Galerie;
