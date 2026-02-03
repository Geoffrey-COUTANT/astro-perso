import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Meteo from './Meteo';
import Reunions from "./Reunions";
import Contact from './Contact';
import APropos from './APropos';
import LiensUtiles from './LiensUtiles';
import Galerie from './Galerie';
import Admin from './Admin';
import AdminLogin, { ADMIN_TOKEN_KEY } from './AdminLogin';

function NotFound404() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 font-sans">
      <h1 className="text-6xl font-bold text-gray-400">404</h1>
      <p className="text-xl text-gray-500 mt-2">Page non trouvée</p>
      <Link to="/" className="mt-6 text-indigo-400 hover:text-indigo-300 underline">Retour à l'accueil</Link>
    </div>
  );
}

function AdminGuard({ children }) {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) return <NotFound404 />;
  return children;
}

function App() {
  return (
      <Router>
          <Routes>
              <Route path={'/'} element={<Home />} />
              <Route path={'/meteo'} element={<Meteo />} />
              <Route path={'/reunions'} element={<Reunions />} />
              <Route path={'/contact'} element={<Contact />} />
              <Route path={'/a-propos'} element={<APropos />} />
              <Route path={'/liens-utiles'} element={<LiensUtiles />} />
              <Route path={'/galerie'} element={<Galerie />} />
              <Route path={'/admin/connect'} element={<AdminLogin />} />
              <Route path={'/admin'} element={<AdminGuard><Admin /></AdminGuard>} />
          </Routes>
      </Router>
  );
}

export default App;
