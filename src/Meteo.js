import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function Meteo() {
    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 40 });
    }, []);

    const linkCardClass =
        "block w-full text-left px-5 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 group";

    return (
        <div className="w-full text-white relative flex flex-col min-h-screen">
            <div className="fixed top-0 left-0 right-0 z-[100]">
                <Header />
            </div>
            <section
                className="relative min-h-[100vh] flex flex-col bg-[url('./components/img/first-bg-meteo.svg')] bg-cover bg-center bg-fixed"
                aria-label="Météo & Astronomie"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />
                <main className="flex-grow flex flex-col items-center px-4 sm:px-6 py-10 sm:py-16 pt-[6.5rem] sm:pt-20 md:pt-20 lg:pt-24 mt-[6.5rem] sm:mt-20 md:mt-20 lg:mt-24 font-kodchasan font-medium max-w-4xl mx-auto w-full">
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-6 sm:mb-10 drop-shadow-lg"
                        data-aos="fade-up"
                    >
                        ☁️ Météo & Astronomie 🔭
                    </h1>
                    <p
                        className="text-lg sm:text-xl text-center text-white/95 mb-8 sm:mb-10"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        Sur le site de MétéoBlue, découvrez si vous devez sortir le télescope ou le parapluie.
                    </p>

                    <div
                        className="w-full space-y-4 mb-12"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <p className="text-base sm:text-lg text-white/90 text-center">
                            🔍 Consultez ces ressources pour anticiper la qualité du ciel nocturne :
                        </p>
                        <div className="grid gap-3 sm:gap-4">
                            <a
                                href="https://www.meteoblue.com/fr/meteo/outdoorsports/seeing/boisredon_france_3031984"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkCardClass}
                            >
                                <span className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                                    Seeing à Boisredon
                                </span>
                                <span className="text-white/70 text-sm sm:text-base block mt-1">Conditions d’observation</span>
                            </a>
                            <a
                                href="https://content.meteoblue.com/fr/clients-prives/aide-pour-les-sites-web/plein-air-et-sports/astronomy-seeing"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkCardClass}
                            >
                                <span className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                                    Mode d’emploi
                                </span>
                                <span className="text-white/70 text-sm sm:text-base block mt-1">Comment interpréter les prévisions</span>
                            </a>
                            <a
                                href="https://www.youtube.com/watch?v=4xINW0hwvW4&themeRefresh=1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkCardClass}
                            >
                                <span className="font-semibold text-white group-hover:text-cyan-200 transition-colors">
                                    Comprendre le Seeing
                                </span>
                                <span className="text-white/70 text-sm sm:text-base block mt-1">Guide détaillé (Vidéo)</span>
                            </a>
                        </div>
                    </div>

                    <div
                        className="w-full rounded-2xl bg-black/30 border border-white/15 backdrop-blur-md p-6 sm:p-8 text-left"
                        data-aos="fade-up"
                        data-aos-delay="300"
                    >
                        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
                            Mauvais Temps ?
                        </h2>
                        <p className="text-base sm:text-lg text-white/90 mb-4">
                            Si le ciel ne coopère pas, nous nous retrouverons dans une salle prêtée par la mairie pour des discussions et un diaporama.
                        </p>
                        <p className="text-base sm:text-lg text-white/90 mb-4">
                            À méditer : Plongez dans le{" "}
                            <a
                                href="http://www.astrosurf.com/texereau/chapitre15.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2 transition-colors"
                            >
                                chapitre XV du livre de Texereau sur la LA TURBULENCE ATMOSPHERIQUE
                            </a>
                        </p>
                        <p className="text-base sm:text-lg text-white/90 mb-2">et réfléchissez aux mots d’André Couder :</p>
                        <blockquote className="text-lg sm:text-xl text-cyan-100/95 italic pl-4 border-l-2 border-cyan-400/50">
                            “L’air est la plus mauvaise partie de l’instrument…”
                        </blockquote>
                    </div>
                </main>
                <div className="h-16 bg-gradient-to-b from-transparent to-black/50" aria-hidden="true" />
            </section>

            <section
                className="relative min-h-screen flex flex-col bg-[url('./components/img/second-bg-meteo.svg')] bg-contain sm:bg-cover bg-center bg-fixed"
                aria-label="Échelle de Pickering"
            >
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                <main className="relative flex-grow flex flex-col items-center px-4 sm:px-6 py-12 sm:py-20 pt-20 font-kodchasan font-medium max-w-6xl mx-auto w-full">
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 sm:mb-6"
                        data-aos="fade-down"
                    >
                        Estimer la turbulence avec{" "}
                        <a
                            href="https://www.astreos.eu/estimer-la-turbulence-echelle-de-pickering.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 transition-colors"
                        >
                            l’échelle de Pickering
                        </a>
                    </h2>
                    <p
                        className="text-base sm:text-xl text-center text-white/95 max-w-3xl mb-10 sm:mb-14"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        La turbulence est l'un des principaux ennemis de l’astronome amateur. Les remous de l'atmosphère déforment les images et changent même légèrement la mise au point.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 sm:gap-12 w-full max-w-5xl mb-10">
                        <div
                            className="flex flex-col items-center rounded-2xl bg-black/25 border border-white/15 backdrop-blur-md p-6 overflow-hidden"
                            data-aos="zoom-in"
                            data-aos-delay="200"
                        >
                            <div className="relative w-full flex justify-center">
                                <img
                                    src="https://www.astreos.eu/images/technique/Pickering/pickering1.gif"
                                    alt="Turbulence niveau 1"
                                    className="rounded-xl w-32 sm:w-40 max-w-full object-contain"
                                />
                                <span className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-red-500/80 text-sm font-semibold">
                                    Niveau : 1
                                </span>
                            </div>
                            <p className="text-lg sm:text-xl font-semibold mt-4 text-center text-white/95">
                                Turbulence : très très mauvaise
                            </p>
                        </div>
                        <div
                            className="flex flex-col items-center rounded-2xl bg-black/25 border border-white/15 backdrop-blur-md p-6 overflow-hidden"
                            data-aos="zoom-in"
                            data-aos-delay="200"
                        >
                            <div className="relative w-full flex justify-center">
                                <img
                                    src="https://www.astreos.eu/images/technique/Pickering/pickering10.gif"
                                    alt="Turbulence niveau 10"
                                    className="rounded-xl w-32 sm:w-40 max-w-full object-contain"
                                />
                                <span className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-red-500/80 text-sm font-semibold">
                                    Niveau : 10
                                </span>
                            </div>
                            <p className="text-lg sm:text-xl font-semibold mt-4 text-center text-white/95">
                                Turbulence : excellente / parfaite
                            </p>
                        </div>
                    </div>

                    <p
                        className="text-base sm:text-lg text-center text-white/90 max-w-2xl"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        L'échelle comporte 10 niveaux, de 1 très mauvais à 10 parfait sans turbulence.
                    </p>
                </main>
                <div className="h-12 bg-gradient-to-b from-transparent to-black/40" aria-hidden="true" />
            </section>

            <section
                className="relative min-h-screen flex flex-col bg-[url('./components/img/third-bg-meteo.svg')] bg-cover bg-center bg-fixed"
                aria-label="Ressources et liens"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                <main className="relative flex-grow flex flex-col items-center px-4 sm:px-6 py-12 sm:py-16 pt-20 font-kodchasan font-medium max-w-4xl mx-auto w-full">
                    <h2
                        className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-10 text-left w-full"
                        data-aos="fade-up"
                    >
                        Pour aller plus loin :
                    </h2>
                    <ul className="w-full space-y-3 mb-12" data-aos="fade-up" data-aos-delay="100">
                        <li>
                            <a
                                href="https://fr.wikipedia.org/wiki/Tache_d%27Airy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkCardClass}
                            >
                                <span className="text-white group-hover:text-cyan-200 transition-colors">La Tache d’Airy</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.edmundoptics.fr/knowledge-center/application-notes/imaging/limitations-on-resolution-and-contrast-the-airy-disk/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkCardClass}
                            >
                                <span className="text-white group-hover:text-cyan-200 transition-colors">
                                    La tache d’Airy et la limite de diffraction (en anglais)
                                </span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="http://www.astrosurf.com/cavadore/optique/turbulence/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkCardClass}
                            >
                                <span className="text-white group-hover:text-cyan-200 transition-colors">
                                    Seeing and Turbulence – Article de Cyril Cavadore (en anglais)
                                </span>
                            </a>
                        </li>
                    </ul>

                    <h2
                        className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-left w-full"
                        data-aos="fade-right"
                    >
                        🔭 Plus d’infos sur :
                    </h2>
                    <ul className="w-full space-y-3" data-aos="fade-left" data-aos-delay="100">
                        <li>
                            <a
                                href="https://media4.obspm.fr/public/ressources_lu/pages_optique-ondulatoire/oo-turbulence.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkCardClass}
                            >
                                <span className="font-semibold text-white group-hover:text-cyan-200 transition-colors">OBSPM</span>
                                <span className="text-white/70 text-sm block mt-1">Explications simplifiées</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://comptes-rendus.academie-sciences.fr/physique/item/10.5802/crphys.101.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={linkCardClass}
                            >
                                <span className="font-semibold text-white group-hover:text-cyan-200 transition-colors">Mode d'emploi</span>
                                <span className="text-white/70 text-sm block mt-1">Comment interpréter les prévisions</span>
                            </a>
                        </li>
                    </ul>
                </main>
                <Footer />
            </section>
        </div>
    );
}

export default Meteo;
