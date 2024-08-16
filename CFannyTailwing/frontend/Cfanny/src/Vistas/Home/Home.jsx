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
     <h1 style={{scale:"500%", marginBottom:"150px"}} className="text-3xl font-bold mb-4">COLACIONES FANNY</h1>
      <h2 className="text-3xl font-bold mb-4">Identificación de Usuario</h2>
      <form style={{scale:"200%", marginTop:"20px"}} className="space-x-10">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleUserSelection('Eduardo')}
        >
          CAJA
        </button>
        <button
          type="button"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleUserSelection('Tablet')}
        >
          TABLET
        </button>
      </form>
    </div>
  );
}
