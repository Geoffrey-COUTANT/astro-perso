import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import de toutes les images du dossier images/
import image14 from "./images/image 14.svg";
import image15 from "./images/image 15.svg";
import image16 from "./images/image 16.svg";
import image17 from "./images/image 17.svg";
import image20 from "./images/image 20.svg";
import image21 from "./images/image 21.svg";
import image22 from "./images/image 22.svg";
import image23 from "./images/image 23.svg";
import image24 from "./images/image 24.svg";
import image25 from "./images/image 25.svg";
import image26 from "./images/image 26.svg";
import image27 from "./images/image 27.svg";
import image28 from "./images/image 28.svg";
import image29 from "./images/image 29.svg";
import image30 from "./images/image 30.svg";
import image31 from "./images/image 31.svg";
import image32 from "./images/image 32.svg";
import image33 from "./images/image 33.svg";
import image34 from "./images/image 34.svg";
import image35 from "./images/image 35.svg";
import image36 from "./images/image 36.svg";
import image37 from "./images/image 37.svg";
import image38 from "./images/image 38.svg";
import image39 from "./images/image 39.svg";
import image40 from "./images/image 40.svg";
import image41 from "./images/image 41.svg";
import image42 from "./images/image 42.svg";
import image43 from "./images/image 43.svg";
import image44 from "./images/image 44.svg";
import image45 from "./images/image 45.svg";
import image46 from "./images/image 46.svg";
import image47 from "./images/image 47.svg";

const allImages = [
    image14, image15, image16, image17, image20, image21, image22, image23, image24, image25,
    image26, image27, image28, image29, image30, image31, image32, image33, image34, image35,
    image36, image37, image38, image39, image40, image41, image42, image43, image44, image45,
    image46, image47
];

const imageNumbers = [14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];

function mod(n, m) {
    return ((n % m) + m) % m;
}

function Galerie() {
    const images = useMemo(() => {
        return allImages.map((url, idx) => ({
            id: idx,
            title: `Image ${imageNumbers[idx] ?? idx + 1}`,
            description: "Photo d'astronomie du Club Astro Véga de la Lyre",
            url,
        }));
    }, []);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const idleTimeoutRef = useRef(null);

    // Drag / swipe (pointer)
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

    // Auto-défilement doux (pause si interaction ou modal ouverte)
    useEffect(() => {
        if (images.length === 0) return;
        if (isUserInteracting || pointerDownRef.current || selectedImage) return;

        const t = setInterval(() => {
            setCurrentIndex((i) => mod(i + 1, images.length));
        }, 4500);

        return () => clearInterval(t);
    }, [images.length, isUserInteracting, selectedImage]);

    // Clavier
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

    // Coverflow: on affiche 5 items autour du centre
    const slots = [-2, -1, 0, 1, 2];
    const visible = slots.map((offset) => {
        const idx = mod(currentIndex + offset, images.length);
        return { offset, idx, img: images[idx] };
    });

    const onPointerDown = (e) => {
        resetIdle();
        pointerDownRef.current = true;
        startXRef.current = e.clientX;
        deltaXRef.current = 0;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* noop */ }
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
                            {/* Fond léger pour la profondeur */}
                            <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-[1px]" />

                            {visible.map(({ offset, img }) => {
                                const isCenter = offset === 0;

                                // Paramètres visuels du coverflow
                                const x = offset * 260; // espacement horizontal
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
