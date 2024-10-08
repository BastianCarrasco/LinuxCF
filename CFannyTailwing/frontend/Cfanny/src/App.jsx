import React, { useState, useEffect } from 'react';
import './App.css'; // Asegúrate de tener los estilos de Tailwind incluidos aquí
import Navbar from './Vistas/Navbar/Head';
import Footer from './Vistas/Navbar/Footer';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Home from './Vistas/Home/Home';
import Caja from './Vistas/Caja/Caja';
import Cola from './Vistas/Cola/Cola';
import Encargos from './Vistas/Encargos/Encargos';
import Semana from './Vistas/Semana/Semana';
import Stock from './Vistas/Stock/Stock';
import Ventas from './Vistas/Ventas/Ventas';
import Caja2 from './Vistas/Caja/Caja2';
import Encargos2 from './Vistas/Encargos/Encargos2';
import ColaT from './Vistas/Cola/ColaT';

function App() {
  const [user, setUser] = useState(null);
  const [bandera, setbandera] = useState(0);

  useEffect(() => {
    // Cargar el usuario del localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    setUser(savedUser);
  }, []);

  useEffect(()=>{
    console.log(user);
  },[user])

  // Función para verificar el acceso
  const hasAccess = (view) => {
    if (user === 'Eduardo') return true;
    if (user === 'Tablet' && ['Caja2', 'ColaT', 'Encargos2'].includes(view)) return true;
    return false;
  };

  // Si no hay usuario confirmado, mostrar el componente Home
  if (!user) {
    return (
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Home setUser={setUser} />
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Navbar user={user} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home setUser={setUser} />} />
            <Route path="/caja" element={hasAccess('Caja') ? <Caja /> : <Navigate to="/" />} />
            <Route path="/caja2" element={hasAccess('Caja2') ? <Caja2 /> : <Navigate to="/" />} />
            <Route path="/cola" element={hasAccess('Cola') ? <Cola /> : <Navigate to="/" />} />
            <Route path="/colat" element={hasAccess('ColaT') ? <ColaT /> : <Navigate to="/" />} />
            <Route path="/encargo" element={hasAccess('Encargos') ? <Encargos /> : <Navigate to="/" />} />
            <Route path="/encargo2" element={hasAccess('Encargos2') ? <Encargos2 /> : <Navigate to="/" />} />
            <Route path="/semana" element={hasAccess('Semana') ? <Semana /> : <Navigate to="/" />} />
            <Route path="/stock" element={hasAccess('Stock') ? <Stock /> : <Navigate to="/" />} />
            <Route path="/ventas" element={hasAccess('Ventas') ? <Ventas /> : <Navigate to="/" />} />
          </Routes>
        </main>
       
      </div>
    </Router>
  );
}

export default App;
