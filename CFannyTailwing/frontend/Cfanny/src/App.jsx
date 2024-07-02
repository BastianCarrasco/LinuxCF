import React from 'react';
import './App.css'; // Asegúrate de tener los estilos de Tailwind incluidos aquí
import Navbar from './Vistas/Navbar/Head';
import Footer from './Vistas/Navbar/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Vistas/Home/Home';
import Caja from './Vistas/Caja/Caja';
import Cola from './Vistas/Cola/Cola';
import Encargos from './Vistas/Encargos/Encargos';
import Semana from './Vistas/Semana/Semana';
import Stock from './Vistas/Stock/Stock';
import Ventas from './Vistas/Ventas/Ventas';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="flex-grow ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/caja" element={<Caja />} />
            <Route path="/cola" element={<Cola />} />
            <Route path="/encargo" element={<Encargos />} />
            <Route path="/semana" element={<Semana />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/ventas" element={<Ventas />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
