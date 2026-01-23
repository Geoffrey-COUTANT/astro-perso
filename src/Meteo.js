import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import turbulance1 from "./components/img/turbulance1.svg";
import turbulance2 from "./components/img/turbulance2.svg";

function Meteo() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: false });
    }, []);

    return (
        <div className='w-full text-white text-center relative'>
            <div className='bg-[url("./components/img/first-bg-meteo.svg")] bg-cover bg-center bg-fixed min-h-[120vh] flex flex-col'>
                <Header />
                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full pt-32">
                    <h1 className='text-5xl font-bold mb-12 text-center w-full' data-aos="fade-up">
                        ☁️ Météo & Astronomie 🔭
                    </h1>
                    <div className="text-left ml-10 w-full" data-aos="fade-left">
                        <p className='text-2xl'>Sur le site de MétéoBlue, découvrez si vous devez sortir le télescope ou le parapluie.</p>
                        <p className='text-2xl my-4'>🔍 Consultez ces ressources pour anticiper la qualité du ciel nocturne et optimiser vos observations :</p>
                        <ul className="text-lg space-y-2" data-aos="fade-left" data-aos-delay="200">
                            <li>🔹 <a href="https://www.meteoblue.com/fr/meteo/outdoorsports/seeing/boisredon_france_3031984" target="_blank" className="underline hover:text-gray-300">Seeing à Boisredon</a> – Conditions d’observation</li>
                            <li>🔹 <a href="https://content.meteoblue.com/fr/clients-prives/aide-pour-les-sites-web/plein-air-et-sports/astronomy-seeing" target="_blank" className="underline hover:text-gray-300">Mode d’emploi</a> – Comment interpréter les prévisions</li>
                            <li>🔹 <a href="https://www.youtube.com/watch?v=4xINW0hwvW4&themeRefresh=1" target="_blank" className="underline hover:text-gray-300">Comprendre le Seeing</a> – Guide détaillé (Vidéo)</li>
                        </ul>
                    </div>
                </main>
                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full">
                    <h1 className='text-4xl font-bold mb-12 text-center w-full' data-aos="zoom-in-up">
                        Mauvais Temps ?
                    </h1>
                    <div className="text-left ml-10 w-full" data-aos="fade-up">
                        <p className='text-2xl'>Si le ciel ne coopère pas, nous nous retrouverons dans une salle prêtée par la mairie pour des discussions et un diaporama.</p>
                        <p className='text-2xl mt-8'>À méditer : Plongez dans le <a href="http://www.astrosurf.com/texereau/chapitre15.pdf" target="_blank" className="underline hover:text-gray-300"> chapitre XV du livre de Texereau sur la LA TURBULENCE ATMOSPHERIQUE</a></p>
                        <p className='text-2xl my-4'>et réfléchissez aux mots d’André Couder :</p>
                        <p className='text-2xl'>“L’air est la plus mauvaise partie de l’instrument…”</p>
                    </div>
                </main>
            </div>

            <div className='bg-[url("./components/img/second-bg-meteo.svg")] bg-contain bg-fixed bg-center min-h-screen flex flex-col'>
                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full pt-24">
                    <h1
                        className='text-4xl sm:text-5xl font-bold mb-6 sm:mb-12 text-center w-full'
                        data-aos="fade-down"
                    >
                        Estimer la turbulence avec <a href="https://www.astreos.eu/estimer-la-turbulence-echelle-de-pickering.html" target="_blank" className='underline hover:text-gray-300'>
                        l’échelle de Pickering
                    </a>
                    </h1>
                    <div className="text-left ml-6 sm:ml-10 w-full" data-aos="fade-right">
                        <p className='text-xl sm:text-2xl text-center max-w-7xl'>
                            La turbulence est l'un des principaux ennemis de l’astronome amateur. En effet, les remous de l'atmosphère déforment les images et changent même légèrement la mise au point.
                        </p>
                    </div>
                </main>

                <main className="flex-grow flex flex-col items-center justify-end px-6 py-12 font-kodchasan font-medium w-full">
                    <div className="flex-grow flex flex-col md:flex-row items-center justify-center w-full max-w-8xl">
                        <div className="flex flex-col items-center w-full sm:w-1/3">
                            <div className="flex flex-grow relative w-[133%] h-[187px] justify-center" data-aos="zoom-in">
                                <img src="https://www.astreos.eu/images/technique/Pickering/pickering1.gif" alt="Turbulance 1" className="rounded-xl w-1/3 sm:w-1/4 max-w-lg"/>
                                <div className="flex absolute ml-72 top-2 left-2 text-xl px-2 py-1 rounded-md">
                                    <p className='ml-6'>Niveau : 1</p>
                                </div>
                            </div>
                            <p className="text-3xl sm:text-4xl mt-4 text-center">Turbulance : très très mauvaise</p>
                        </div>
                        <p className="text-xl sm:text-3xl w-full md:w-1/3 md:text-left px-6 mt-6 md:mt-0" data-aos="fade-up">
                            L'échelle comporte 10 niveaux, de 1 très mauvais à 10 parfait sans turbulence.
                        </p>
                        <div className="flex flex-col items-center w-full sm:w-1/3 md:mt-6" data-aos="zoom-in">
                            <img src={turbulance2} alt="Turbulance 2" className="w-2/5 sm:w-1/3 max-w-lg"/>
                            <p className="text-3xl sm:text-4xl mt-4 text-center">Turbulance : excellente / parfaite</p>
                        </div>
                    </div>
                </main>
            </div>

            <div className='bg-[url("./components/img/third-bg-meteo.svg")] bg-cover bg-center bg-fixed min-h-screen flex flex-col'>
                <main className="flex-grow flex flex-col justify-center text-start ml-auto px-6 pt-24 font-kodchasan font-medium max-w-5xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
                    <h1 className='text-4xl sm:text-5xl font-bold mb-6 sm:mb-12' data-aos="fade-up">Pour aller plus loin :</h1>
                    <ul className="text-base sm:text-lg space-y-3" data-aos="fade-down" data-aos-delay="200">
                        <li>🔹 <a href="https://fr.wikipedia.org/wiki/Tache_d%27Airy" target="_blank" className="underline hover:text-gray-300"> La Tache d’Airy</a></li>
                        <li>🔹 <a href="https://www.edmundoptics.fr/knowledge-center/application-notes/imaging/limitations-on-resolution-and-contrast-the-airy-disk/" target="_blank" className="underline hover:text-gray-300">La tache d’Airy et la limite de diffraction (en anglais)</a></li>
                        <li>🔹 <a href="http://www.astrosurf.com/cavadore/optique/turbulence/" target="_blank" className="underline hover:text-gray-300">Seeing and Turbulence – Article de Cyril Cavadore (en anglais)</a></li>
                    </ul>
                </main>
                <main className="flex-grow flex flex-col justify-center text-start ml-auto px-6  pt-12 font-kodchasan font-medium max-w-5xl w-full">
                    <h1 className='text-2xl sm:text-3xl font-bold mb-6 sm:mb-12' data-aos="fade-right">🔭 Plus d’infos sur :</h1>
                    <ul className="text-base sm:text-lg space-y-3" data-aos="fade-left" data-aos-delay="200">
                        <li>📌 <a href="https://media4.obspm.fr/public/ressources_lu/pages_optique-ondulatoire/oo-turbulence.html" target="_blank" className="underline hover:text-gray-300">OBSPM</a> – Explications simplifiées</li>
                        <li>📌 <a href="https://comptes-rendus.academie-sciences.fr/physique/item/10.5802/crphys.101.pdf" target="_blank" className="underline hover:text-gray-300">Mode d’emploi</a> – Comment interpréter les prévisions</li>
                    </ul>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Meteo;
