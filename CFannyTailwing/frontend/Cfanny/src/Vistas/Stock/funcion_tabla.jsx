import React, { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { obtenerDatosTiposMenu } from '../Consultas/GET/gettiposMenu';

// Definir los tipos válidos
const tiposValidos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const tiposValidosCascada = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const MenuTable = ({ datosMenu, handleEliminarItem }) => {
  const [tiposMenu, setTiposMenu] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroPrecioMin, setFiltroPrecioMin] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');
  const [datosFiltrados, setDatosFiltrados] = useState(datosMenu);

  useEffect(() => {
    // Obtener los datos de tipos de menú al montar el componente
    obtenerDatosTiposMenu()
      .then(data => {
        setTiposMenu(data);
        console.log('Datos de tipos de menú:', data); // Imprime los datos obtenidos
      })
      .catch(error => console.error('Error al obtener datos de tipos de menú:', error));
  }, []);

  useEffect(() => {
    // Filtrar los datos cuando cambie alguno de los filtros
    setDatosFiltrados(
      datosMenu.filter(item => {
        const tipoValido = filtroTipo === '' || item.tipo === parseInt(filtroTipo, 10);
        const nombreValido = filtroNombre === '' || item.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
        const precioValido = (
          (filtroPrecioMin === '' || item.precio >= parseFloat(filtroPrecioMin)) &&
          (filtroPrecioMax === '' || item.precio <= parseFloat(filtroPrecioMax))
        );

        return tipoValido && nombreValido && precioValido && tiposValidos.includes(item.tipo);
      })
    );
  }, [filtroTipo, filtroNombre, filtroPrecioMin, filtroPrecioMax, datosMenu]);

  return (
    <div className="flex h-full">
      {/* Contenedor para el título y filtro */}
      <div style={{ marginTop: "60px" }} className="w-1/4 p-4 bg-gray-800">
        <h1 className="text-xl font-semibold text-white mb-2">Menú</h1>
        
        {/* Filtros o campos de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full mb-4"
        />

        <input
          type="number"
          placeholder="Precio mínimo..."
          value={filtroPrecioMin}
          onChange={(e) => setFiltroPrecioMin(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full mb-4"
        />
        
        <input
          type="number"
          placeholder="Precio máximo..."
          value={filtroPrecioMax}
          onChange={(e) => setFiltroPrecioMax(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full mb-4"
        />
        
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600 w-full"
        >
          <option value="">Todos los tipos</option>
          {tiposMenu
            .filter(tipo => tiposValidosCascada.includes(tipo.id_tipo))
            .map(tipo => (
              <option key={tipo.id_tipo} value={tipo.id_tipo}>
                {tipo.nombre.toUpperCase()}
              </option>
            ))}
        </select>
      </div>

      {/* Contenedor para la tabla con scroll */}
      <div style={{ marginTop: "60px" }} className="w-3/4 p-4 overflow-y-auto">
        <div className="min-h-[400px]"> {/* Ajusta la altura según sea necesario */}
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 border-solid table-fixed">
              <thead className="bg-gray-800 sticky top-0">
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
                      <button
                        onClick={() => handleEliminarItem(item.nombre)}
                        className="text-red-600 hover:text-red-800 focus:outline-none"
                      >
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
    </div>
  );
};

export default MenuTable;









