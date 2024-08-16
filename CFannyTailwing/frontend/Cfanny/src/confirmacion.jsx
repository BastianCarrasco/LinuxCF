// confirmacion.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';

const CurrentPathLogger = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextPath, setNextPath] = useState('');

  // Función para mostrar el modal de confirmación
  const showConfirmationModal = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  useEffect(() => {
    // Detectar cambios de ruta
    const handleNavigation = (event) => {
      if (location.pathname === '/semana' || location.pathname === '/stock') {
        // Usar preventDefault para evitar la navegación
        event.preventDefault();
        setNextPath(location.pathname);
        showConfirmationModal(event);
      }
    };

    // Manejar eventos de navegación
    const unblock = navigate.block((tx) => {
      handleNavigation({ preventDefault: () => tx.retry() });
    });

    return () => {
      unblock();
    };
  }, [location, navigate]);

  // Confirmar la navegación
  const handleConfirm = () => {
    setIsModalOpen(false);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  // Cancelar la navegación
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-black w-80">
            <h2 className="text-xl font-bold mb-4">Confirmar salida</h2>
            <p>¿Estás seguro de que deseas salir de esta vista?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCancel}
                className="mr-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CurrentPathLogger;


