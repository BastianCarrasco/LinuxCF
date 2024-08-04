import React, { useEffect, useState } from 'react';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import NuevoItem from './ingresarItem';
import { eliminarMenu } from '../Consultas/DELETE/elminarMenu';
import { AiOutlineDelete } from 'react-icons/ai';
import DatosIngresados from './DatosIngresados';


export default function Stock() {
  const [datosMenu, setDatosMenu] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState(1);
  const [mostrarNuevoItem, setMostrarNuevoItem] = useState(false);
  const [mostrarFunciones, setMostrarFunciones] = useState(false);
  const [todoOculto, setTodoOculto] = useState(false); // Nuevo estado

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

  const handleInsertToggle = () => {
    setMostrarNuevoItem(prev => !prev);
    setTodoOculto(prev => !prev); // Alternar visibilidad de todo
    if (!mostrarNuevoItem) {
      setMostrarFunciones(false);
    }
  };

  const handleEliminarItem = (nombre) => {
    eliminarMenu(nombre)
      .then(() => {
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
      });
  };

  const filtrarPorTipo = (tipo) => {
    setFiltroTipo(tipo);
  };

  const datosFiltrados = filtroTipo ? datosMenu.filter(item => item.tipo === filtroTipo) : datosMenu;

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-black text-white">
      <div className="flex w-full h-full flex-col">
        {/* Mostrar la vista principal solo si no está oculto todo */}
        {!todoOculto && !mostrarFunciones && (
          <div className="flex w-full h-full">
            {/* Sección de la tabla de datos */}
            <div className="w-2/3 bg-black p-4 rounded shadow-md border-white border-r flex flex-col">
              <div className="flex-1 overflow-auto">
                <div className="h-full overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200 border-solid table-fixed">
                    <thead className="bg-black">
                      <tr>
                        <th style={{ width: "25%" }} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Nombre
                        </th>
                        <th style={{ width: "25%" }} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Precio
                        </th>
                        <th style={{ width: "25%" }} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Stock
                        </th>
                        <th style={{ width: "25%" }} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
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
                              <AiOutlineDelete size={25} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sección de filtros */}
            <div className="w-1/3 bg-black p-4 rounded shadow-md border-white flex flex-col">
              <div className="flex-1 flex flex-col space-y-2 overflow-auto">
                <button onClick={() => filtrarPorTipo(1)} className="text-white hover:underline border-solid border-2 border-yellow-500 px-4 py-2 rounded-lg">Proteina</button>
                <button onClick={() => filtrarPorTipo(2)} className="text-white hover:underline border-solid border-2 border-blue-500 px-4 py-2 rounded-lg">Acompaña</button>
                <button onClick={() => filtrarPorTipo(3)} className="text-white hover:underline border-solid border-2 border-green-500 px-4 py-2 rounded-lg">Papas</button>
                <button onClick={() => filtrarPorTipo(4)} className="text-white hover:underline border-solid border-2 border-red-500 px-4 py-2 rounded-lg">Empanadas</button>
                <button onClick={() => filtrarPorTipo(10)} className="text-white hover:underline border-solid border-2 border-green-600 px-4 py-2 rounded-lg">Guiso</button>
                <button onClick={() => filtrarPorTipo(5)} className="text-white hover:underline border-solid border-2 border-purple-500 px-4 py-2 rounded-lg">Bebidas</button>
                <button onClick={() => filtrarPorTipo(6)} className="text-white hover:underline border-solid border-2 border-indigo-500 px-4 py-2 rounded-lg">Ensalada</button>
                <button onClick={() => filtrarPorTipo(7)} className="text-white hover:underline border-solid border-2 border-pink-500 px-4 py-2 rounded-lg">Postre</button>
                <button onClick={() => filtrarPorTipo(8)} className="text-white hover:underline border-solid border-2 border-yellow-600 px-4 py-2 rounded-lg">Otro</button>
                <button style={{marginBottom:"250px"}} onClick={() => filtrarPorTipo(9)} className="text-white hover:underline border-solid border-2 border-blue-600 px-4 py-2 rounded-lg">Special</button>
              </div>
            </div>
          </div>
        )}

        {/* Sección de funciones y botones */}
        {mostrarFunciones && (
          <div className="w-full bg-black p-4 rounded shadow-md border-white flex flex-col items-center space-y-4">
            <button onClick={() => setMostrarFunciones(false)} className="bg-red-500 text-white font-bold py-2 px-4 rounded">
              Volver a la Vista Principal
            </button>
          </div>
        )}

        <div className="flex items-center mb-4">
          <button style={{fontSize:"20px"}}
            onClick={handleInsertToggle} // Usa el nuevo manejador de eventos
            className="bg-yellow-500 text-black font-bold py-2 px-4 rounded"
          >
            {mostrarNuevoItem ? 'Ocultar Formulario' : 'Agregar a Menu'}
          </button>
          <DatosIngresados onInsertSuccess={handleInsertSuccess} setTodoOculto={setTodoOculto} />
        </div>
        {mostrarNuevoItem && <NuevoItem onInsertSuccess={handleInsertSuccess} />}
      </div>
    </div>
  );
}
