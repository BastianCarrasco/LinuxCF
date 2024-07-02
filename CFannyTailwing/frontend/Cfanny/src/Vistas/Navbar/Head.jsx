import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white fixed top-0 left-0 w-full p-4 flex justify-between items-center">
      <h1 className="text-xl">Colaciones Fanny</h1>
      <div className="flex justify-around flex-1">
        <a href="/" className="hover:underline mx-4">Home</a>
        <a href="/caja" className="hover:underline mx-4">Caja</a>
        <a href="/cola" className="hover:underline mx-4">Cola</a>
        <a href="/encargo" className="hover:underline mx-4">Encargos</a>
        <a href="/semana" className="hover:underline mx-4">Semana</a>
        <a href="/stock" className="hover:underline mx-4">Stock</a>
        <a href="/ventas" className="hover:underline mx-4">Ventas</a>
        {/* Agrega otros enlaces aquí */}
      </div>
    </nav>
  );
}
