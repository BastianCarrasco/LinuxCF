import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ user }) {

  const [semana,setsemana] = useState(false);
  const [stock,setsetstock] = useState(false);



  return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 w-full p-4 flex justify-between items-center">
      <h1 className="text-xl">Colaciones Fanny</h1>
      <div style={{fontSize:"24px"}} className="flex justify-around flex-1">
        <Link to="/" className="hover:underline mx-4">Home</Link>
        {user === 'Eduardo' && (
          <>
            <Link to="/caja" className="hover:underline mx-4">Caja</Link>
            <Link to="/cola" className="hover:underline mx-4">Cola</Link>
            <Link to="/encargo" className="hover:underline mx-4">Encargos</Link>
            <Link to="/semana" className="hover:underline mx-4">Semana</Link>
            <Link to="/stock" className="hover:underline mx-4">Stock</Link>
            <Link to="/ventas" className="hover:underline mx-4">Ventas</Link>
          </>
        )}
        {user === 'Tablet' && (
          <>
            <Link to="/caja" className="hover:underline mx-4">Caja</Link>
            <Link to="/cola" className="hover:underline mx-4">Cola</Link>
            <Link to="/encargo" className="hover:underline mx-4">Encargos</Link>
          </>
        )}
      </div>
    </nav>
  );
}
