import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function Contact() {
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [donationData, setDonationData] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');

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

                        <div className="bg-gradient-to-br from-green-500 to-blue-600 bg-opacity-20 backdrop-blur-sm rounded-xl p-8 text-left animate-fade-scale animation-delay-500">
                            <h2 className='text-3xl font-bold mb-4 text-center flex items-center justify-center gap-2'>
                                <span>💝</span> Faire un don
                            </h2>
                            <p className="text-center text-lg mb-6 text-gray-200">
                                Votre soutien nous aide à continuer nos activités et à partager notre passion pour l'astronomie !
                            </p>
                            <form className="space-y-4" onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target;
                                const data = {
                                    nom: form.querySelector('[name="don-nom"]')?.value || '',
                                    email: form.querySelector('[name="don-email"]')?.value || '',
                                    montant: form.querySelector('[name="don-montant"]')?.value || '',
                                    message: form.querySelector('[name="don-message"]')?.value || ''
                                };
                                setDonationData(data);
                                setShowDonationModal(true);
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-lg mb-2">Nom *</label>
                                        <input 
                                            type="text" 
                                            name="don-nom"
                                            required
                                            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-lg mb-2">Email *</label>
                                        <input 
                                            type="email" 
                                            name="don-email"
                                            required
                                            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50"
                                            placeholder="votre.email@exemple.fr"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-lg mb-2">Montant du don (€) *</label>
                                    <div className="flex gap-2 mb-2 flex-wrap">
                                        <button 
                                            type="button"
                                            className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const currentValue = parseFloat(donationAmount) || 0;
                                                setDonationAmount(currentValue === 0 ? '10' : (currentValue + 10).toString());
                                            }}
                                        >
                                            10€
                                        </button>
                                        <button 
                                            type="button"
                                            className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const currentValue = parseFloat(donationAmount) || 0;
                                                setDonationAmount(currentValue === 0 ? '25' : (currentValue + 25).toString());
                                            }}
                                        >
                                            25€
                                        </button>
                                        <button 
                                            type="button"
                                            className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const currentValue = parseFloat(donationAmount) || 0;
                                                setDonationAmount(currentValue === 0 ? '50' : (currentValue + 50).toString());
                                            }}
                                        >
                                            50€
                                        </button>
                                        <button 
                                            type="button"
                                            className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const currentValue = parseFloat(donationAmount) || 0;
                                                setDonationAmount(currentValue === 0 ? '100' : (currentValue + 100).toString());
                                            }}
                                        >
                                            100€
                                        </button>
                                    </div>
                                    <input 
                                        type="number" 
                                        name="don-montant"
                                        required
                                        min="1"
                                        step="0.01"
                                        value={donationAmount}
                                        onChange={(e) => setDonationAmount(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50"
                                        placeholder="Montant personnalisé"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg mb-2">Message (optionnel)</label>
                                    <textarea 
                                        name="don-message"
                                        rows="4"
                                        className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white border-opacity-30 focus:outline-none focus:border-opacity-50 resize-none"
                                        placeholder="Un message pour nous accompagner votre don..."
                                    />
                                </div>

                                <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-gray-200">
                                        <strong>Note :</strong> Les dons sont actuellement en cours de configuration. 
                                        Pour l'instant, vous pouvez nous contacter directement pour effectuer un don.
                                    </p>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 text-xl shadow-lg"
                                >
                                    💝 Faire un don
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

            {/* Modal de confirmation de don */}
            {showDonationModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-scale"
                    onClick={() => setShowDonationModal(false)}
                >
                    <div 
                        className="bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 rounded-3xl p-8 max-w-md w-full text-white relative overflow-hidden animate-zoom-rotate shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Effet de particules animées en arrière-plan */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 left-4 w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                            <div className="absolute top-8 right-8 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            <div className="absolute bottom-8 left-8 w-4 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute bottom-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                        </div>

                        {/* Contenu du modal */}
                        <div className="relative z-10">
                            {/* Icône animée */}
                            <div className="text-center mb-6">
                                <div className="inline-block text-8xl animate-bounce">
                                    ✨💝✨
                                </div>
                            </div>

                            <h2 className="text-4xl font-bold text-center mb-2 animate-fade-scale">
                                Merci pour votre générosité !
                            </h2>
                            
                            <p className="text-center text-lg mb-6 text-gray-100">
                                (Simulation fictive - Aucun paiement réel n'a été effectué)
                            </p>

                            {/* Détails du don */}
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 mb-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-200">Donateur :</span>
                                    <span className="font-bold">{donationData?.nom || 'Anonyme'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-200">Email :</span>
                                    <span className="font-bold text-sm">{donationData?.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-white border-opacity-30 pt-3">
                                    <span className="text-xl font-semibold">Montant :</span>
                                    <span className="text-3xl font-bold text-yellow-300">
                                        {donationData?.montant ? `${parseFloat(donationData.montant).toFixed(2)}€` : '0€'}
                                    </span>
                                </div>
                                {donationData?.message && (
                                    <div className="pt-3 border-t border-white border-opacity-30">
                                        <p className="text-gray-200 text-sm mb-1">Message :</p>
                                        <p className="italic">"{donationData.message}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Message de confirmation */}
                            <div className="text-center mb-6">
                                <p className="text-lg text-gray-100">
                                    Votre soutien nous aide à continuer nos activités astronomiques ! 🌟
                                </p>
                            </div>

                            {/* Bouton de fermeture */}
                            <button
                                onClick={() => setShowDonationModal(false)}
                                className="w-full bg-white text-green-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-100 transition duration-300 text-xl shadow-lg transform hover:scale-105"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Contact;
