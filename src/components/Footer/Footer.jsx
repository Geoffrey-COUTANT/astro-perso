import logo from '../img/logo.svg';

function Footer() {
    return (
        <footer className="text-white py-6">
            <div className="container mx-auto text-center">
                <img src={logo} alt="Logo ClubAstroVégadelaLyre" className="h-16 mx-auto mb-4" />

                <p className="text-sm">
                    © 2025 Geoffrey Coutant, France. Tous droits réservés.
                </p>
            </div>
        </footer>
    );
}

export default Footer;