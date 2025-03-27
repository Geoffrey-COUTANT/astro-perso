import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import turbulance1 from "./components/img/turbulance1.svg";
import turbulance2 from "./components/img/turbulance2.svg";

function Meteo() {
    return (
        <div className='w-full text-white text-center'>
            <div className='bg-[url("./components/img/first-bg-meteo.svg")] bg-cover bg-center min-h-screen flex flex-col'>
                <Header />
                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full">
                    <h1 className='text-5xl font-bold mb-12 text-center w-full'>☁️ Météo & Astronomie 🔭</h1>
                    <div className="text-left ml-10 w-full">
                        <p className='text-2xl'>Sur le site de MétéoBlue, découvrez si vous devez sortir le télescope ou le parapluie.</p>
                        <p className='text-2xl my-4'>🔍 Consultez ces ressources pour anticiper la qualité du ciel nocturne et optimiser vos observations :</p>
                        <ul className="text-lg space-y-2">
                            <li>🔹 <a href="https://www.meteoblue.com/fr/meteo/outdoorsports/seeing/boisredon_france_3031984" className="underline hover:text-gray-300">Seeing à Boisredon</a> – Conditions d’observation</li>
                            <li>🔹 <a href="https://content.meteoblue.com/fr/clients-prives/aide-pour-les-sites-web/plein-air-et-sports/astronomy-seeing" className="underline hover:text-gray-300">Mode d’emploi</a> – Comment interpréter les prévisions</li>
                            <li>🔹 <a href="https://www.youtube.com/watch?v=4xINW0hwvW4&themeRefresh=1" className="underline hover:text-gray-300">Comprendre le Seeing</a> – Guide détaillé (Vidéo)</li>
                        </ul>
                    </div>
                </main>
                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full">
                    <h1 className='text-4xl font-bold mb-12 text-center w-full'>Mauvais Temps ?</h1>
                    <div className="text-left ml-10 w-full">
                        <p className='text-2xl'>Si le ciel ne coopère pas, nous nous retrouverons dans une salle prêtée par la mairie pour des discussions et un diaporama.</p>
                        <p className='text-2xl mt-8'>À méditer : Plongez dans le <a href="http://www.astrosurf.com/texereau/chapitre15.pdf" className="underline hover:text-gray-300"> chapitre XV du livre de Texereau sur la LA TURBULENCE ATMOSPHERIQUE</a></p>
                        <p className='text-2xl my-4'>et réfléchissez aux mots d’André Couder :</p>
                        <p className='text-2xl'>“L’air est la plus mauvaise partie de l’instrument…”</p>
                    </div>
                </main>
            </div>

            <div className='bg-[url("./components/img/second-bg-meteo.svg")] bg-cover bg-center min-h-screen flex flex-col'>
                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full">
                    <h1 className='text-4xl sm:text-5xl font-bold mb-6 sm:mb-12 text-center w-full'>
                        Estimer la turbulence avec <a href="https://www.astreos.eu/estimer-la-turbulence-echelle-de-pickering.html" className='underline hover:text-gray-300'>
                        l’échelle de Pickering
                    </a>
                    </h1>
                    <div className="text-left ml-6 sm:ml-10 w-full">
                        <p className='text-xl sm:text-2xl'>
                            La turbulence est l'un des principaux ennemis de l’astronome amateur. En effet, les remous de l'atmosphère déforment les images et changent même légèrement la mise au point.
                        </p>
                    </div>
                </main>
                <main className="flex-grow flex flex-col items-center px-6 py-12 font-kodchasan font-medium w-full">
                    <h1 className='text-4xl sm:text-5xl font-bold mb-6 sm:mb-12 text-center w-full'>Mauvais Temps ?</h1>
                    <div className="flex-grow flex flex-col md:flex-row items-center justify-center w-full max-w-8xl">
                        <div className="flex flex-col items-center w-full sm:w-1/3">
                            <img src="https://www.astreos.eu/images/technique/Pickering/pickering1.gif" alt="Turbulance 1" className="rounded w-2/5 sm:w-1/3 max-w-lg"/>
                            <p className="text-3xl sm:text-4xl mt-4 text-center">Turbulance : très très mauvaise</p>
                        </div>
                        <p className="text-xl sm:text-3xl w-full md:w-1/3 md:text-left px-6 mt-6 md:mt-0">
                            L'échelle comporte 10 niveaux, de 1 très mauvais à 10 parfait sans turbulence.
                        </p>
                        <div className="flex flex-col items-center w-full sm:w-1/3 md:mt-6">
                            <img src={turbulance2} alt="Turbulance 2" className="w-2/5 sm:w-1/3 max-w-lg"/>
                            <p className="text-3xl sm:text-4xl mt-4 text-center">Turbulance : excellente / parfaite</p>
                        </div>
                    </div>
                </main>
            </div>

            <div className='bg-[url("./components/img/third-bg-meteo.svg")] bg-cover bg-center min-h-screen flex flex-col'>
                <main className="flex-grow flex flex-col justify-center text-start ml-auto px-6 pt-12 font-kodchasan font-medium max-w-5xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl w-full">
                    <h1 className='text-4xl sm:text-5xl font-bold mb-6 sm:mb-12'>Pour aller plus loin :</h1>
                    <ul className="text-base sm:text-lg space-y-3">
                        <li>🔹 <a href="https://fr.wikipedia.org/wiki/Tache_d%27Airy" className="underline hover:text-gray-300"> La Tache d’Airy</a></li>
                        <li>🔹 <a href="https://www.edmundoptics.fr/knowledge-center/application-notes/imaging/limitations-on-resolution-and-contrast-the-airy-disk/" className="underline hover:text-gray-300">La tache d’Airy et la limite de diffraction (en anglais)</a></li>
                        <li>🔹 <a href="http://www.astrosurf.com/cavadore/optique/turbulence/" className="underline hover:text-gray-300">Seeing and Turbulence – Article de Cyril Cavadore (en anglais)</a></li>
                    </ul>
                </main>
                <main className="flex-grow flex flex-col justify-center text-start ml-auto px-6 pt-12 font-kodchasan font-medium max-w-5xl w-full">
                    <h1 className='text-2xl sm:text-3xl font-bold mb-6 sm:mb-12'>🔭 Plus d’infos sur :</h1>
                    <ul className="text-base sm:text-lg space-y-3">
                        <li>📌 <a href="https://media4.obspm.fr/public/ressources_lu/pages_optique-ondulatoire/oo-turbulence.html" className="underline hover:text-gray-300">OBSPM</a> – Explications simplifiées</li>
                        <li>📌 <a href="https://comptes-rendus.academie-sciences.fr/physique/item/10.5802/crphys.101.pdf" className="underline hover:text-gray-300">Mode d’emploi</a> – Comment interpréter les prévisions</li>
                    </ul>
                </main>
                <Footer />
            </div>

        </div>
    );
}

export default Meteo;