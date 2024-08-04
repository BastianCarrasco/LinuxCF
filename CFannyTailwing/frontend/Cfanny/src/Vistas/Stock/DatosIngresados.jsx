import React, { useState, useEffect } from 'react';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import { actualizarMenu } from '../Consultas/UPDATE/editarStockG';

export default function DatosIngresados({ onInsertSuccess, setTodoOculto  }) {
  const [datosMenu, setDatosMenu] = useState([]);
  const [datosModificados, setDatosModificados] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState(null); // Estado para almacenar el tipo seleccionado
  const [tablaVisible, setTablaVisible] = useState(false); // Estado para controlar la visibilidad de la tabla

  useEffect(() => {
    // Función para obtener los datos del menú
    const fetchData = async () => {
      try {
        const data = await obtenerDatosMenu();
        setDatosMenu(data);
        // Inicializar datosModificados con los datos originales
        setDatosModificados(data.map(item => ({ id: item.id, nombre: item.nombre, precio: item.precio, stockG: item.stockG })));
      } catch (error) {
        console.error('Error al obtener datos del menú:', error);
      }
    };

    fetchData(); // Llama a la función para cargar los datos al montar el componente
  }, []);

  // Función para manejar el cambio de un atributo
  const handleInputChange = (id, campo, valor) => {
    const nuevosDatos = datosModificados.map(item => {
      if (item.id === id) {
        return { ...item, [campo]: valor };
      }
      return item;
    });

    setDatosModificados(nuevosDatos);
  };


  // Función para actualizar todos los datos modificados
  const actualizarTodosLosDatos = async () => {
    try {
      await Promise.all(datosModificados.map(item => actualizarMenu(item.id, item.nombre, item.tipo, item.precio, item.stockG)));
      console.log('Todos los datos modificados han sido actualizados.');

      // Después de actualizar, actualizar los datos mostrados en la tabla
      const nuevosDatosMenu = await obtenerDatosMenu();
      setDatosMenu(nuevosDatosMenu); // Actualizar los datos en el estado
      onInsertSuccess(); // Llamar al callback prop para manejar el éxito de la inserción
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };

  // Función para filtrar por tipo
  const filtrarPorTipo = (tipo) => {
    setFiltroTipo(tipo);
  };

  // Aplicar filtro si hay uno seleccionado
  const datosFiltrados = filtroTipo ? datosMenu.filter(item => item.tipo === filtroTipo) : datosMenu;

  // Función para alternar la visibilidad de la tabla
  const toggleTablaVisible = () => {
    setTablaVisible(!tablaVisible);

    if(!tablaVisible){
      setTodoOculto(true);
    }else  setTodoOculto(false);
  };

  return (
    <div className="w-1/2 bg-black p-4 rounded shadow-md border-white">
       <div className="bg-black">

        <button style={{fontSize:"20px"}} onClick={toggleTablaVisible} className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4">
          {tablaVisible ? 'Cerrar' : 'Editar Stock/Nombre/Precio'}
        </button>

        {tablaVisible && (

          <div className="overflow-x-auto">
            <div className="flex space-x-4 mb-4">
          <button onClick={() => filtrarPorTipo(5)} className="text-white hover:underline">Bebidas</button>
          <button onClick={() => filtrarPorTipo(6)} className="text-white hover:underline">Ensalada</button>
          <button onClick={() => filtrarPorTipo(7)} className="text-white hover:underline">Postre</button>
          <button onClick={() => filtrarPorTipo(8)} className="text-white hover:underline">Otro</button>
          <button onClick={() => filtrarPorTipo(9)} className="text-white hover:underline">Special</button>
        </div>
            <div className="max-h-96 overflow-y-auto" style={{border:'solid'}}>
              <table className="min-w-full divide-y divide-gray-200" >
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
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gray-200">
                  {datosFiltrados.map(item => (
                    <tr key={item.id} className="text-white">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.nombre}<br></br>
                        <input
                          type="text"
                          value={datosModificados.find(dato => dato.id === item.id)?.nombre || item.nombre}
                          onChange={(e) => handleInputChange(item.id, 'nombre', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded text-black w-full mt-2"
                          placeholder="Modificar Nombre"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.precio}<br></br>
                        <input
                          type="text"
                          value={datosModificados.find(dato => dato.id === item.id)?.precio || item.precio}
                          onChange={(e) => handleInputChange(item.id, 'precio', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded text-black w-full mt-2"
                          placeholder="Modificar Precio"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.stockG}<br></br>
                        <input
                          type="text"
                          value={datosModificados.find(dato => dato.id === item.id)?.stockG || item.stockG}
                          onChange={(e) => handleInputChange(item.id, 'stockG', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded text-black w-full mt-2"
                          placeholder="Modificar Stock"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {tablaVisible && (
        <div className="flex justify-end mt-4">

          <button onClick={actualizarTodosLosDatos} className="bg-green-500 text-white font-bold py-2 px-4 rounded">
            Actualizar Todos los Datos
          </button>

        </div>
      )}
    </div>
  );
}
