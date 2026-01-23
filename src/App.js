import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Meteo from './Meteo';
import Reunions from "./Reunions";
import Contact from './Contact';
import APropos from './APropos';
import LiensUtiles from './LiensUtiles';
import Galerie from './Galerie';

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
          </Routes>
      </Router>
  );
}

export default App;
