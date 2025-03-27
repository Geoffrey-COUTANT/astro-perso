import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Meteo from './Meteo';
import Reunions from "./Reunions";

function App() {
  return (
      <Router>
          <Routes>
              <Route path={'/'} element={<Home />} />
              <Route path={'/meteo'} element={<Meteo />} />
              <Route path={'/reunions'} element={<Reunions />} />
          </Routes>
      </Router>
  );
}

export default App;
