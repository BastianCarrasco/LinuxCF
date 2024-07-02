import React, { useEffect, useState } from 'react';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import NuevoItem from './ingresarItem';
import { eliminarMenu } from '../Consultas/DELETE/elminarMenu';
import { AiOutlineDelete } from 'react-icons/ai'; // Importar el ícono de basura
import DatosIngresados from './DatosIngresados'; // Importar el componente de datos ingresados

export default function Stock() {
  const [datosMenu, setDatosMenu] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState(null); // Estado para almacenar el tipo seleccionado
  const [mostrarNuevoItem, setMostrarNuevoItem] = useState(false);
  const [datosIngresados, setDatosIngresados] = useState({});

  useEffect(() => {
    obtenerDatosMenu()
      .then(data => {
        setDatosMenu(data);
      })
      .catch(error => {
        console.error('Error al obtener datos del menú:', error);
      });
  }, []);

  const handleInsertSuccess = () => {
    obtenerDatosMenu()
      .then(data => {
        setDatosMenu(data);
      })
      .catch(error => {
        console.error('Error al obtener datos del menú:', error);
      });
  };

  // Función para filtrar por tipo
  const filtrarPorTipo = (tipo) => {
    setFiltroTipo(tipo);
  };

  // Función para eliminar un ítem del menú
  const handleEliminarItem = (nombre) => {
    eliminarMenu(nombre)
      .then(() => {
        // Actualizar datos del menú después de la eliminación
        obtenerDatosMenu()
          .then(data => {
            setDatosMenu(data);
          })
          .catch(error => {
            console.error('Error al obtener datos del menú después de eliminar:', error);
          });
      })
      .catch(error => {
        console.error('Error al eliminar el ítem del menú:', error);
        // Manejo de errores si es necesario
      });
  };

  // Aplicar filtro si hay uno seleccionado
  const datosFiltrados = filtroTipo ? datosMenu.filter(item => item.tipo === filtroTipo) : datosMenu;


  return (
    <div  className="flex items-center justify-center w-full  min-h-screen bg-black text-white">
      <div className="flex w-full">
        <div className="w-1/2 bg-black p-4 rounded shadow-md border-white border-r">
          <h2 className="text-3xl font-bold mb-8">Stock</h2>
          <div className="bg-black">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold mr-4">Menú Disponible</h3>
              <div className="flex space-x-4" >
                <button onClick={() => filtrarPorTipo(1)} className="text-white hover:underline">Proteina</button>
                <button onClick={() => filtrarPorTipo(2)} className="text-white hover:underline">Acompaña</button>
                <button onClick={() => filtrarPorTipo(3)} className="text-white hover:underline">Papas</button>
                <button onClick={() => filtrarPorTipo(4)} className="text-white hover:underline">Empanadas</button>
                <button onClick={() => filtrarPorTipo(5)} className="text-white hover:underline">Bebidas</button>
                <button onClick={() => filtrarPorTipo(6)} className="text-white hover:underline">Ensalada</button>
                <button onClick={() => filtrarPorTipo(7)} className="text-white hover:underline">Postre</button>
                <button onClick={() => filtrarPorTipo(8)} className="text-white hover:underline">Otro</button>
                <button onClick={() => filtrarPorTipo(9)} className="text-white hover:underline">Special</button>
                <button onClick={() => filtrarPorTipo(10)} className="text-white hover:underline">Guiso</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200" style={{border:'solid'}}>
                  <thead className="bg-black">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Precio
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-black divide-y divide-gray-200">
                    {datosFiltrados.map(item => (
                      <tr key={item.id} className="text-white">
                        <td className="px-6 py-4 whitespace-nowrap">{item.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.precio}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.stockG}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button onClick={() => handleEliminarItem(item.nombre)} className="text-red-600 hover:text-red-800 focus:outline-none">
                            <AiOutlineDelete size={25} /> {/* Icono de basura */}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <button onClick={() => setMostrarNuevoItem(!mostrarNuevoItem)} className="bg-yellow-500 text-black font-bold py-2 px-4 rounded">
              {mostrarNuevoItem ? 'Ocultar Formulario' : 'Agregar a Menu'}
            </button>
          </div>
          {mostrarNuevoItem && <NuevoItem onInsertSuccess={handleInsertSuccess} />}
        </div>
        {/* Renderizando el componente DatosIngresados */}
        <DatosIngresados onInsertSuccess={handleInsertSuccess} />
      </div>
    </div>
  );
}





