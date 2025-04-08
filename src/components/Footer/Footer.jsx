import logo from '../img/logo.svg';  // Assure-toi que le logo est dans le bon chemin

function Footer() {
    return (
        <footer className="text-white py-6">
            <div className="container mx-auto text-center">
                {/* Logo */}
                <img src={logo} alt="Logo ClubAstroVégadelaLyre" className="h-16 mx-auto mb-4" />

                {/* Mention copyright */}
                <p className="text-sm">
                    © 2025 ClubAstroVégadelaLyre, France. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}

export default Footer;