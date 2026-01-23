import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function Contact() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: false });
    }, []);

    return (
        <div className='w-full text-white text-center'>
            <div className='bg-[url("./components/img/background-contact.jpg")] bg-cover bg-center bg-fixed min-h-screen flex flex-col'>
                <Header />
                <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 font-kodchasan font-medium w-full">
                    <h1 className='text-5xl font-bold mb-12 text-center w-full animate-bounce-in'>
                        📧 Contactez-nous
                    </h1>
                    <div className="max-w-4xl w-full space-y-8">
                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-left animate-slide-left animation-delay-200">
                            <h2 className='text-3xl font-bold mb-6 text-center'>Nous contacter</h2>
                            <div className="space-y-6 text-xl">
                                <div className="flex items-center space-x-4 animate-fade-scale animation-delay-300">
                                    <span className="text-3xl">📧</span>
                                    <div>
                                        <p className="font-semibold">Email :</p>
                                        <a href="mailto:vegastro17@gmail.com" className="underline hover:text-gray-300">
                                            vegastro17@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 animate-fade-scale animation-delay-400">
                                    <span className="text-3xl">📱</span>
                                    <div>
                                        <p className="font-semibold">Téléphone :</p>
                                        <a href="tel:+33671368621" className="underline hover:text-gray-300">
                                            06 71 36 86 21
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 animate-fade-scale animation-delay-500">
                                    <span className="text-3xl">📍</span>
                                    <div>
                                        <p className="font-semibold">Adresse :</p>
                                        <p>Club Astro Véga de la Lyre</p>
                                        <p>17150 BOISREDON, France</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-left animate-slide-right animation-delay-400">
                            <h2 className='text-3xl font-bold mb-6 text-center'>Formulaire de contact</h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-lg mb-2">Nom *</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50"
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg mb-2">Email *</label>
                                    <input 
                                        type="email" 
                                        required
                                        className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50"
                                        placeholder="votre.email@exemple.fr"
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg mb-2">Sujet *</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50"
                                        placeholder="Sujet de votre message"
                                    />
                                </div>
                                <div>
                                    <label className="block text-lg mb-2">Message *</label>
                                    <textarea 
                                        required
                                        rows="6"
                                        className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50 resize-none"
                                        placeholder="Votre message..."
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                                >
                                    Envoyer le message
                                </button>
                            </form>
                        </div>

                        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 text-center animate-rotate-in animation-delay-600">
                            <h2 className='text-3xl font-bold mb-6'>Rejoignez-nous !</h2>
                            <p className="text-xl mb-4">
                                Intéressé par l'astronomie ? N'hésitez pas à nous contacter pour en savoir plus sur nos activités et nos réunions mensuelles.
                            </p>
                            <p className="text-lg text-gray-300">
                                Nous serions ravis de vous accueillir lors de nos prochaines observations !
                            </p>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Contact;
