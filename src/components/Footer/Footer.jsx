import { useLocation } from 'react-router-dom';
import logo from '../img/logo.svg';

function Footer() {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <footer className="text-white py-6">
            <div className="container mx-auto text-center">
                <img 
                    src={logo} 
                    alt="Logo ClubAstroVégadelaLyre" 
                    className={`h-16 mx-auto mb-4 ${isHomePage ? 'hidden md:block' : 'block'}`} 
                />

                <p className="text-sm">
                    © 2026 Geoffrey Coutant, France. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}

export default Footer;