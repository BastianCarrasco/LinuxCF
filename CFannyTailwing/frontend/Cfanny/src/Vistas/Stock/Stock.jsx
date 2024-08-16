import React, { useEffect, useState } from 'react';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import NuevoItem from './ingresarItem';
import DatosIngresados from './DatosIngresados';
import MenuTable from './funcion_tabla';
import { eliminarMenu } from '../Consultas/DELETE/elminarMenu';

export default function Stock() {
  const [datosMenu, setDatosMenu] = useState([]);
  const [activeTab, setActiveTab] = useState(null); // Estado para controlar qué mostrar

  useEffect(() => {
    // Obtener datos del menú al montar el componente
    obtenerDatosMenu()
      .then(data => setDatosMenu(data))
      .catch(error => console.error('Error al obtener datos del menú:', error));
  }, []);

  // Función para eliminar un ítem del menú
  const handleEliminarItem = async (nombre) => {
    try {
      await eliminarMenu(nombre); // Llamar a la función para eliminar el ítem usando el nombre
      setDatosMenu(prevDatosMenu => prevDatosMenu.filter(item => item.nombre !== nombre)); // Actualizar el estado después de eliminar
    } catch (error) {
      console.error('Error al eliminar el ítem:', error);
    }
  };

  // Función para mostrar la tabla del menú
  const handleShowMenu = () => {
    setActiveTab('menu');
  };

  // Función para mostrar el componente de ingresar ítem
  const handleShowIngresarItem = () => {
    setActiveTab('ingresarItem');
  };

  // Función para mostrar el componente de datos ingresados
  const handleShowDatosIngresados = () => {
    setActiveTab('editarStock');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuTable datosMenu={datosMenu} handleEliminarItem={handleEliminarItem} />;
      case 'ingresarItem':
        return <NuevoItem />;
      case 'editarStock':
        return <DatosIngresados />;
      default:
        return <div>Selecciona una opción</div>;
    }
  };

  

  return (
    <div className="flex w-screen h-screen bg-black text-white">
      {/* Columna izquierda (10%) */}
      <div className="w-[10%] p-4 bg-gray-800 flex flex-col items-center justify-start">
        <button 
          style={{marginTop:"100px", width: "100%", padding: "12px 0"}}
          onClick={handleShowMenu}
          className="bg-yellow-500 text-black px-4 py-2 rounded mb-4"
        >
          Menu
        </button>
        <button 
          style={{width: "100%", padding: "12px 0"}}
          onClick={handleShowIngresarItem}
          className="bg-yellow-500 text-black px-4 py-2 rounded mb-4"
        >
          Ingresar Item
        </button>
        <button 
          style={{width: "100%", padding: "12px 0"}}
          onClick={handleShowDatosIngresados}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          Editar Stock
        </button>
      </div>
      {/* Columna derecha (90%) */}
      <div className="w-[90%] p-4 overflow-y-auto">
        {/* Mostrar el contenido basado en el estado activeTab */}
        {renderContent()}
      </div>
    </div>
  );
}
