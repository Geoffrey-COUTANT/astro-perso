import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, XCircle } from "lucide-react";
import logo from "../img/logo.svg";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { name: "Accueil", path: "/" },
        { name: "Météo", path: "/meteo" },
        { name: "Réunions", path: "/reunions" },
        { name: "Galerie", path: "/galerie" },
        { name: "Liens Utiles", path: "/liens-utiles" },
        { name: "À Propos", path: "/a-propos" },
        { name: "Contact", path: "/contact" }
    ];

    return (
        <header className="text-white w-full sticky backdrop-blur-sm top-0 left-0 z-50">
            <div className="mx-auto px-14 py-4 flex items-center">

                {/* Logo */}
                <div className="flex">
                    <img src={logo} alt="logo" className="h-24 w-24" />
                </div>

                {/* Menu Desktop */}
                <nav className="ml-20 hidden md:flex space-x-20 w-full justify-center text-2xl">
                    {menuItems.map(({ name, path }) => (
                        <Link key={name} to={path} className={`hover:text-gray-300 transition ${location.pathname === path ? "underline underline-offset-4 decoration-white" : ""}`}>
                            {name}
                        </Link>
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
                    {menuItems.map(({ name, path }) => (
                        <Link key={name} to={path} className="block hover:text-gray-300 transition">
                            {name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}

export default Header;