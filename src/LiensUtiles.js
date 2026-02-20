import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const API_BASE = process.env.REACT_APP_API_URL || "";

const DEFAULT_CATEGORIES = [
    { title: "📰 Actualités Astronomiques", links: [
        { name: "Les nouvelles de LTE - Observatoire de Paris", url: "https://www.imcce.fr/", description: "Actualités de l'Institut de Mécanique Céleste et de Calcul des Éphémérides" },
        { name: "Le guide du ciel de Guillaume CANNAT", url: "http://www.leguideduciel.net/", description: "Guide mensuel du ciel et actualités astronomiques" },
        { name: "Société Astronomique de France", url: "https://saf-astronomie.fr/", description: "Actualités et ressources de la SAF" },
        { name: "AFA - Association Française d'Astronomie", url: "https://www.afastronomie.fr/actualites", description: "Actualités de l'AFA" },
        { name: "Les news de Web astro", url: "https://www.webastro.net/actualites/", description: "Actualités astronomiques de Webastro" },
        { name: "Star Walk", url: "https://starwalk.space/fr/news/", description: "Actualités et guides d'astronomie" }
    ]},
    { title: "📺 Chaînes YouTube", links: [
        { name: "SAF - Chaîne YouTube", url: "https://www.youtube.com/channel/UCD6H5ugytjb0FM9CGLUn0Xw", description: "Chaîne YouTube de la Société Astronomique de France" },
        { name: "AFA - Chaîne YouTube", url: "https://www.youtube.com/@AfastronomieFr", description: "Chaîne YouTube de l'Association Française d'Astronomie" }
    ]},
    { title: "🌐 Sites d'Astronomie Générale", links: [
        { name: "Astrosurf", url: "https://www.astrosurf.com", description: "Portail de l'astronomie amateur" },
        { name: "Ciel & Espace", url: "https://www.cieletespace.fr", description: "Magazine d'astronomie" },
        { name: "Astronomie Magazine", url: "https://www.astronomie-magazine.fr", description: "Magazine spécialisé" }
    ]},
    { title: "🔭 Observation et Équipement", links: [
        { name: "Stellarium", url: "https://stellarium.org", description: "Planétarium open source" },
        { name: "Cartes du Ciel", url: "https://www.ap-i.net/skychart", description: "Logiciel de cartographie céleste" },
        { name: "Heavens Above", url: "https://www.heavens-above.com", description: "Prévisions de passages de satellites" },
        { name: "In The Sky", url: "https://in-the-sky.org", description: "Calendrier astronomique et événements" }
    ]},
    { title: "🌌 Météo et Conditions d'Observation", links: [
        { name: "MétéoBlue - Seeing", url: "https://www.meteoblue.com/fr/meteo/outdoorsports/seeing", description: "Prévisions de seeing" },
        { name: "Clear Outside", url: "https://clearoutside.com", description: "Prévisions météo pour l'astronomie" },
        { name: "Astrospheric", url: "https://www.astrospheric.com", description: "Météo astronomique (en anglais)" }
    ]}
];

function LiensUtiles() {
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

    useEffect(() => {
        AOS.init({ duration: 1000, once: false });
    }, []);

    useEffect(() => {
        if (!API_BASE) return;
        fetch(`${API_BASE}/api/links`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setCategories(data.map((c) => ({
                        title: c.title,
                        links: (c.links || []).map((l) => ({
                            name: l.name,
                            url: l.url,
                            description: l.description || ""
                        }))
                    })));
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div className='w-full text-white text-center relative'>
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <Header />
            </div>
            <div className='bg-[url("./components/img/background-liens.jpg")] bg-cover bg-center bg-fixed min-h-screen flex flex-col pt-32'>
                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full">
                    <h1 className='text-5xl font-bold mb-12 text-center w-full animate-fade-scale'>
                        🔗 Liens Utiles
                    </h1>
                    
                    <div className="max-w-6xl w-full space-y-8">
                        {categories.map((category, index) => {
                            const animations = ['animate-slide-left', 'animate-slide-right', 'animate-rotate-in', 'animate-bounce-in', 'animate-float-in'];
                            const animationClass = animations[index % animations.length];
                            return (
                            <div 
                                key={index}
                                className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-left ${animationClass}`}
                                style={{ animationDelay: `${200 * (index + 1)}ms` }}
                            >
                                <h2 className='text-3xl font-bold mb-6 text-center'>{category.title}</h2>
                                <ul className="space-y-4">
                                    {category.links.map((link, linkIndex) => (
                                        <li key={linkIndex} className="text-xl">
                                            <a 
                                                href={link.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="underline hover:text-gray-300 font-semibold"
                                            >
                                                {link.name}
                                            </a>
                                            {link.description && (
                                                <span className="text-gray-300 ml-2">– {link.description}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            );
                        })}

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center animate-zoom-rotate animation-delay-1400">
                            <h2 className='text-3xl font-bold mb-6'>💡 Suggestions</h2>
                            <p className="text-xl mb-4">
                                Vous connaissez d'autres ressources intéressantes ? N'hésitez pas à nous les partager lors de nos réunions !
                            </p>
                            <p className="text-lg text-gray-300">
                                Cette liste est régulièrement mise à jour avec les meilleures ressources pour l'astronomie amateur.
                            </p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default LiensUtiles;
