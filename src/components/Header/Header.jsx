import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, XCircle } from "lucide-react";
import logo from "../img/logo.svg";

const API_BASE = process.env.REACT_APP_API_URL || "";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [hasNewPost, setHasNewPost] = useState(false);
    const [latestPostId, setLatestPostId] = useState(null);

    const menuItems = [
        { name: "Accueil", path: "/" },
        { name: "Météo", path: "/meteo" },
        { name: "Réunions", path: "/reunions" },
        { name: "Galerie", path: "/galerie" },
        { name: "Blog", path: "/blog" },
        { name: "Liens Utiles", path: "/liens-utiles" },
        { name: "À Propos", path: "/a-propos" },
        { name: "Contact", path: "/contact" }
    ];

    useEffect(() => {
        fetch(`${API_BASE}/api/blog/latest`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && data.id) {
                    setLatestPostId(data.id);
                    if (location.pathname === "/blog") {
                        localStorage.setItem("lastSeenBlogPostId", data.id);
                        setHasNewPost(false);
                    } else {
                        const lastSeen = localStorage.getItem("lastSeenBlogPostId");
                        if (lastSeen !== data.id) {
                            setHasNewPost(true);
                        }
                    }
                }
            })
            .catch(err => console.log("Failed to check latest blog post for header notification.", err));
    }, [location.pathname]);

    const handleBlogClick = () => {
        if (latestPostId) {
            localStorage.setItem("lastSeenBlogPostId", latestPostId);
            setHasNewPost(false);
        }
    };

    return (
        <header className="text-white w-full sticky backdrop-blur-md bg-transparent top-0 left-0 z-[100]">
            <div className="mx-auto px-4 sm:px-8 lg:px-14 py-4 flex items-center justify-between w-full">

                <div className="flex">
                    <img src={logo} alt="logo" className="h-24 w-24" />
                </div>

                <nav className="ml-20 hidden md:flex space-x-20 w-full justify-center text-2xl">
                    {menuItems.map(({ name, path }) => {
                        const isBlog = path === "/blog";
                        return (
                            <Link 
                                key={name} 
                                to={path} 
                                onClick={isBlog ? handleBlogClick : undefined}
                                className={`relative hover:text-gray-300 transition ${location.pathname === path ? "underline underline-offset-4 decoration-white" : ""}`}
                            >
                                {name}
                                {isBlog && hasNewPost && (
                                    <span className="absolute -top-1 -right-2 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]"></span>
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <XCircle size={30} /> : <Menu size={30} />}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden py-4 space-y-3 text-center bg-slate-950/90 backdrop-blur-md border-b border-white/10">
                    {menuItems.map(({ name, path }) => {
                        const isBlog = path === "/blog";
                        return (
                            <div key={name} className="block">
                                <Link 
                                    to={path} 
                                    onClick={() => {
                                        if (isBlog) handleBlogClick();
                                        setIsOpen(false);
                                    }}
                                    className="relative inline-block hover:text-gray-300 transition text-lg"
                                >
                                    {name}
                                    {isBlog && hasNewPost && (
                                        <span className="absolute -top-0.5 -right-2 flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.8)]"></span>
                                        </span>
                                    )}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </header>
    );
}

export default Header;