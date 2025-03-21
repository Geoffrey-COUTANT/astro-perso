import { useState } from "react";
import { Menu, XCircle } from "lucide-react";
import logo from "../img/logo.svg";

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="text-white w-full top-0 left-0 shadow-md">
            <div className="mx-auto px-14 py-4 flex items-center">

                {/* Logo */}
                <div className="flex ">
                    <img src={logo} alt="logo" className="h-24 w-24" />
                </div>

                {/* Menu Desktop */}
                <nav className="ml-20 hidden container md:flex space-x-20 w-full justify-center text-2xl">
                    {["Accueil", "Météo", "Réunions", "Galerie", "Liens Utiles", "À Propos", "Contact"].map((item) => (
                        <a key={item} href="/" className="hover:text-gray-300 transition">
                            {item}
                        </a>
                    ))}
                </nav>

                {/* Menu Burger Mobile */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <XCircle size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {/* Menu Mobile */}
            {isOpen && (
                <div className="md:hidden py-4 space-y-3">
                    {["Accueil", "Météo", "Réunions", "Galerie", "Liens Utiles", "À Propos", "Contact"].map((item) => (
                        <a key={item} href="#" className="block hover:text-gray-300 transition">
                            {item}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
}

export default Header;