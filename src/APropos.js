import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function APropos() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: false });
    }, []);

    return (
        <div className='w-full text-white text-center'>
            <div className='bg-[url("./components/img/background-a-propos.jpg")] bg-cover bg-center bg-fixed min-h-screen flex flex-col'>
                <Header />
                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full">
                    <h1 className='text-5xl font-bold mb-12 text-center w-full animate-rotate-in'>
                        🌟 À Propos du Club
                    </h1>
                    
                    <div className="max-w-5xl w-full space-y-8">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-left animate-fade-scale animation-delay-200">
                            <h2 className='text-3xl font-bold mb-6 text-center'>Notre Histoire</h2>
                            <p className='text-xl leading-relaxed mb-4'>
                                Le Club Astro Véga de la Lyre de Boisredon est une association d'astronomie amateur créée pour partager la passion du ciel étoilé. 
                                Fondé par des amateurs passionnés, notre club organise des réunions mensuelles et des soirées d'observation pour découvrir les merveilles de l'univers.
                            </p>
                            <p className='text-xl leading-relaxed'>
                                Nous accueillons tous les curieux du ciel, qu'ils soient débutants ou expérimentés, pour observer les planètes, les étoiles, les nébuleuses et bien plus encore.
                            </p>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-left animate-slide-left animation-delay-400">
                            <h2 className='text-3xl font-bold mb-6 text-center'>Nos Objectifs</h2>
                            <ul className="text-xl space-y-3">
                                <li className="flex items-start animate-fade-scale animation-delay-500">
                                    <span className="text-2xl mr-3">🔭</span>
                                    <span>Promouvoir l'astronomie amateur et partager nos connaissances</span>
                                </li>
                                <li className="flex items-start animate-fade-scale animation-delay-600">
                                    <span className="text-2xl mr-3">🌙</span>
                                    <span>Organiser des soirées d'observation du ciel nocturne</span>
                                </li>
                                <li className="flex items-start animate-fade-scale animation-delay-700">
                                    <span className="text-2xl mr-3">📚</span>
                                    <span>Échanger sur les techniques d'observation et d'astrophotographie</span>
                                </li>
                                <li className="flex items-start animate-fade-scale animation-delay-800">
                                    <span className="text-2xl mr-3">👥</span>
                                    <span>Créer une communauté de passionnés d'astronomie</span>
                                </li>
                                <li className="flex items-start animate-fade-scale animation-delay-900">
                                    <span className="text-2xl mr-3">⭐</span>
                                    <span>Initier les débutants aux merveilles du cosmos</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-left animate-slide-right animation-delay-600">
                            <h2 className='text-3xl font-bold mb-6 text-center'>Nos Activités</h2>
                            <div className="space-y-4 text-xl">
                                <div>
                                    <h3 className="font-bold text-2xl mb-2">📅 Réunions Mensuelles</h3>
                                    <p className="mb-4">
                                        Chaque mois, nous nous retrouvons pour discuter d'astronomie, partager nos observations et préparer les prochaines sorties.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl mb-2">🌌 Soirées d'Observation</h3>
                                    <p className="mb-4">
                                        Lorsque les conditions météorologiques le permettent, nous organisons des soirées d'observation sur nos sites dédiés.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl mb-2">🎓 Ateliers et Formations</h3>
                                    <p className="mb-4">
                                        Nous proposons des ateliers pour apprendre à utiliser un télescope, photographier le ciel, ou identifier les constellations.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-2xl mb-2">🎉 Événements Spéciaux</h3>
                                    <p className="mb-4">
                                        Nous participons à des événements nationaux comme la Nuit des Étoiles et organisons des soirées festives.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center animate-bounce-in animation-delay-800">
                            <h2 className='text-3xl font-bold mb-6'>Rejoignez-nous !</h2>
                            <p className="text-xl mb-4">
                                Que vous soyez débutant ou expérimenté, vous êtes les bienvenus au Club Astro Véga de la Lyre.
                            </p>
                            <p className="text-lg text-gray-300">
                                Contactez-nous pour en savoir plus sur nos activités et nos prochaines réunions !
                            </p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default APropos;
