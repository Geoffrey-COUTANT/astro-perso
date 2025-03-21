import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Meteo from './Meteo';

function App() {
  return (
      <Router>
          <Routes>
              <Route path={'/'} element={<Home />} />
              <Route path={'/meteo'} element={<Meteo />} />
          </Routes>
      </Router>
  );
}

export default App;
