import React, { useState, useEffect } from 'react';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import { actualizarMenu } from '../Consultas/UPDATE/editarStockG';
import { obtenerDatosTiposMenu } from '../Consultas/GET/gettiposMenu';

export default function DatosIngresados({ onInsertSuccess, setTodoOculto }) {
  const [datosMenu, setDatosMenu] = useState([]);
  const [datosModificados, setDatosModificados] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState(null); // Estado para almacenar el tipo seleccionado
  const [filtroNombre, setFiltroNombre] = useState(''); // Estado para almacenar el nombre a filtrar
  const [tiposMenu, setTiposMenu] = useState([]);
  const [tiposDisponibles, setTiposDisponibles] = useState([]); // Estado para almacenar los tipos disponibles

  // Agregar los tipos prohibidos aquí
  const tiposProhibidos = [];
  const tiposProhibidosStock = [1,2, 4, 10, 3, 12];

  useEffect(() => {
    // Función para obtener los datos del menú y tipos disponibles
    const fetchData = async () => {
      try {
        const data = await obtenerDatosMenu();
        setDatosMenu(data);

        // Inicializar datosModificados con los datos originales
        setDatosModificados(data.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          stockG: item.stockG,
          tipo: item.tipo
        })));

        // Obtener los tipos disponibles
        const tipos = Array.from(new Set(data.map(item => item.tipo))); // Obtiene tipos únicos
        const tiposFiltrados = tipos.filter(tipo => !tiposProhibidos.includes(tipo)); // Filtra tipos prohibidos
        setTiposDisponibles(tiposFiltrados);

      } catch (error) {
        console.error('Error al obtener datos del menú:', error);
      }
    };

    fetchData(); // Llama a la función para cargar los datos al montar el componente
  }, []);

  function buscar_por_tipo(tipo) {
    // Check if tiposMenu is defined and is an array
    if (!Array.isArray(tiposMenu)) {
      console.error('tiposMenu no es un array o no está definido.');
      return '';
    }

    // Find the item with the given tipo
    const item = tiposMenu.find(element => element.id_tipo === tipo);

    // Return the name or a default value if not found
    return item ? item.nombre : 'Tipo no encontrado';
  }



  useEffect(() => {
    // Obtener los datos de tipos de menú al montar el componente
    obtenerDatosTiposMenu()
      .then(data => {
        setTiposMenu(data);
        console.log('Datos de tipos de menú:', data); // Imprime los datos obtenidos
      })
      .catch(error => console.error('Error al obtener datos de tipos de menú:', error));
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
      await Promise.all(datosModificados.map(item =>
        actualizarMenu(item.id, item.nombre, item.tipo, item.precio, item.stockG)
      ));
      console.log('Todos los datos modificados han sido actualizados.');

      // Después de actualizar, actualizar los datos mostrados en la tabla
      const nuevosDatosMenu = await obtenerDatosMenu();
      setDatosMenu(nuevosDatosMenu); // Actualizar los datos en el estado
      onInsertSuccess(); // Llamar al callback prop para manejar el éxito de la inserción
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  };

  // Función para manejar el cambio en el filtro de tipo
  const handleTipoFilterChange = (e) => {
    setFiltroTipo(Number(e.target.value)); // Convertir el valor a número
  };

  // Función para manejar el cambio en el filtro de nombre
  const handleNombreFilterChange = (e) => {
    setFiltroNombre(e.target.value);
  };

  // Aplicar filtro si hay uno seleccionado
  const datosFiltrados = datosMenu
    .filter(item => filtroTipo ? item.tipo === filtroTipo : true)
    .filter(item => !tiposProhibidos.includes(item.tipo)) // Filtrar tipos prohibidos
    .filter(item => item.nombre.toLowerCase().includes(filtroNombre.toLowerCase()));

  // Función para alternar la visibilidad de la tabla


  return (
    <div className="w-full bg-black p-4 rounded shadow-md border-white">
      <div className="bg-black">
        <div className="flex flex-col mb-4">
          <div style={{ marginTop: "50px" }} className="flex items-center mb-4">
            <input
              type="text"
              value={filtroNombre}
              onChange={handleNombreFilterChange}
              placeholder="Filtrar por nombre"
              className="px-3 py-2 border border-gray-300 rounded text-black mr-4"
            />
            <select
              value={filtroTipo || ''}
              onChange={handleTipoFilterChange}
              className="px-3 py-2 border border-gray-300 rounded text-black mr-4"
            >
              <option value="">Seleccionar Tipo</option>
              {tiposDisponibles.map(tipo => (
                <option key={tipo} value={tipo} style={{ color: 'black' }}>
                  {buscar_por_tipo(tipo).toUpperCase()}
                </option>
              ))}
            </select>


            <button
              onClick={actualizarTodosLosDatos}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
              Actualizar Todos los Datos
            </button>
          </div>
          <div className="max-h-100 overflow-y-auto border border-gray-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black">
                <tr>
                  <th style={{fontSize:"25px"}} scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nombre
                  </th>
                  <th style={{fontSize:"25px"}}scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Precio
                  </th>
                  <th style={{fontSize:"25px"}}scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-300">
                {datosFiltrados.map(item => (
                  <tr key={item.id} className="text-white">
                    <td style={{fontSize:"20px"}}className="px-6 py-4 whitespace-nowrap">
                      {item.nombre}<br />
                      <input
                        type="text"
                        value={datosModificados.find(dato => dato.id === item.id)?.nombre || item.nombre}
                        onChange={(e) => handleInputChange(item.id, 'nombre', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded text-black w-full mt-2"
                        placeholder="Modificar Nombre"
                      />
                    </td>
                    <td  style={{fontSize:"20px"}}className="px-6 py-4 whitespace-nowrap">
                      {item.precio}<br />
                      <input
                        type="text"
                        value={datosModificados.find(dato => dato.id === item.id)?.precio || item.precio}
                        onChange={(e) => handleInputChange(item.id, 'precio', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded text-black w-full mt-2"
                        placeholder="Modificar Precio"
                      />
                    </td>
                    <td style={{ fontSize: "20px" }} className="px-6 py-4 whitespace-nowrap">
                      {item.stockG}<br />
                      {tiposProhibidosStock.includes(item.tipo) ? (
                        <span>No editable</span>
                      ) : (
                        <input
                          type="text"
                          value={datosModificados.find(dato => dato.id === item.id)?.stockG || item.stockG}
                          onChange={(e) => handleInputChange(item.id, 'stockG', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded text-black w-full mt-2"
                          placeholder="Modificar Stock"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
