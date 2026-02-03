import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import EarthScene from "./components/RotatingEarth/EarthScene";

function Home() {
    return (
        <div className='flex flex-col bg-[url("./components/img/background-home.svg")] bg-cover bg-center min-h-screen w-full text-white item-center text-center relative overflow-hidden'>
            <Header />
            
            <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
                <div className="w-full h-full min-w-[800px] min-h-[800px] max-w-[1200px] max-h-[1200px]">
                    <EarthScene />
                </div>
            </div>
            
            <div className="flex-grow flex flex-col justify-center items-center mt-20 font-kodchasan font-medium relative z-10 pointer-events-none">
                <h1 className='text-6xl mb-4 animate-fade-scale'>Club Astro Véga de la Lyre</h1>
                <h1 className='text-3xl my-3 animate-fade-scale' style={{ animationDelay: '0.2s' }}>de</h1>
                <h1 className='text-3xl mb-8 animate-fade-scale' style={{ animationDelay: '0.4s' }}>Boisredon</h1>
            </div>
            <Footer />
        </div>
    );
}

export default Home;