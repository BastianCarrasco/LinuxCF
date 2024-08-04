import React, { useState, useEffect } from 'react';

export default function Home({ setUser }) {
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    // Cargar el usuario del localStorage al iniciar
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setSelectedUser(savedUser);
    }
  }, []);

  const handleUserSelection = (user) => {
    localStorage.setItem('user', user);
    setSelectedUser(user);
    setUser(user);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Identificación de Usuario</h1>
      <form className="space-y-4">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleUserSelection('Eduardo')}
        >
          Ingresar como Eduardo
        </button>
        <button
          type="button"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleUserSelection('Tablet')}
        >
          Ingresar como Tablet
        </button>
      </form>
    </div>
  );
}
