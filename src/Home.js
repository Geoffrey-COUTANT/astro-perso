import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function Home() {
    return (
        <div className='flex flex-col bg-[url("./components/img/background-home.svg")] bg-cover bg-center min-h-screen w-full text-white item-center text-center'>
            <Header />
            <div className="flex-grow flex flex-col justify-center items-center mt-20 font-kodchasan font-medium">
                <h1 className='text-6xl'>Club Astro Véga de la Lyre</h1>
                <h1 className='text-3xl my-3'>de</h1>
                <h1 className='text-3xl'>Boisredon</h1>
            </div>
                <Footer />
        </div>
    );
}

export default Home;