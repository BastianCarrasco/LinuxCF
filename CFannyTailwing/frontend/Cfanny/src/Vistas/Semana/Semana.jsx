import React, { useState, useEffect } from 'react';
import { obtenerDatosSemana } from '../Consultas/GET/getDatosSemana';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';

export default function Semana() {
  const [datosSemana, setDatosSemana] = useState([]);
  const [datosMenu, setDatosMenu] = useState([]);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('menuPrincipal'); // Estado para almacenar el filtro seleccionado
  const [diaSeleccionado, setDiaSeleccionado] = useState(null); // Estado para almacenar el día seleccionado

  const diasSemana = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"]; // Quitamos "DOMINGO"


  const handleStockChange = (event, id) => {
    const newStock = event.target.value;
    setDatosSemana(prevDatos =>
      prevDatos.map(item =>
        item.id === id ? { ...item, stock: newStock } : item
      )
    );
  };
  


  useEffect(() => {
    // Función para obtener los datos de la semana
    const fetchData = async () => {
      try {
        const data = await obtenerDatosSemana();
        setDatosSemana(data);
      } catch (error) {
        console.error('Error al obtener datos de la semana:', error);
      }
    };

    fetchData(); // Llama a la función para cargar los datos al montar el componente
  }, []);

  useEffect(() => {
    // Función para obtener los datos del menú
    const fetchMenuData = async () => {
      try {
        const menuData = await obtenerDatosMenu();
        setDatosMenu(menuData);
      } catch (error) {
        console.error('Error al obtener datos del menú:', error);
      }
    };

    fetchMenuData(); // Llama a la función para cargar los datos del menú al montar el componente
  }, []);

  // Agrupar datos por día
  const datosPorDia = diasSemana.map(dia => ({
    dia,
    datos: datosSemana.filter(item => item.dia === dia)
  }));

  // Función para filtrar los datos según el filtro seleccionado
  const filtrarDatos = (datos) => {
    switch (filtroSeleccionado) {
      case 'menuPrincipal':
        return datos.slice(0, 9);
      case 'papas':
        return datos.filter(item => item.nombre === 'PapasFritasC' || item.nombre === 'PapasfritasG');
      case 'empanadas':
        return datos.filter(item => item.tipo === 4); // Filtrar por tipo 4 (empanadas)
      default:
        return datos;
    }
  };

  // Manejar el click en un día para mostrar el modal con el nombre completo del día
  const handleDiaClick = (dia) => {
    setDiaSeleccionado(dia); // Mostrar el modal del día seleccionado
  };

  // Filtrar y mapear los datos según el filtro seleccionado
  const datosFiltrados = datosPorDia.map(({ dia, datos }) => ({
    dia,
    datos: filtrarDatos(datos)
  }));

  // Función para obtener los botones del menú según el tipo
  const obtenerBotonesMenu = (tipo) => {
    return datosMenu
      .filter(item => item.tipo === tipo)
      .map(item => (
        <button
          key={item.id}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-2 mr-2"
          onClick={() => console.log(`Seleccionado: ${item.nombre}`)} // Acción al seleccionar el botón
        >
          {item.nombre}
        </button>
      ));
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-black text-white p-6" style={{ paddingTop: '150px' }}>
      <h3 className="text-2xl font-bold mb-4">Semana</h3>

      {/* Selector de filtro */}
      <div className="flex justify-center mb-4 space-x-4">
        <button className={`px-4 py-2 rounded ${filtroSeleccionado === 'menuPrincipal' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`} onClick={() => setFiltroSeleccionado('menuPrincipal')}>
          Menú Principal
        </button>
        <button className={`px-4 py-2 rounded ${filtroSeleccionado === 'papas' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`} onClick={() => setFiltroSeleccionado('papas')}>
          Papas
        </button>
        <button className={`px-4 py-2 rounded ${filtroSeleccionado === 'empanadas' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`} onClick={() => setFiltroSeleccionado('empanadas')}>
          Empanadas
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-700">
            <tr>
              {diasSemana.map(dia => (
                <th key={dia} scope="col" className="px-4 py-2 text-center text-xs font-medium text-white uppercase tracking-wider">
                  <div className="relative">
                    <button
                      onClick={() => handleDiaClick(dia)}
                      className="focus:outline-none"
                    >
                      {dia}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-500 divide-y divide-gray-600">
            {Array.from({ length: Math.max(...datosFiltrados.map(({ datos }) => datos.length)) }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {datosFiltrados.map(({ dia, datos }, columnIndex) => (
                  <td key={`${dia}-${rowIndex}`} className={`px-4 py-2 whitespace-nowrap text-xs text-center ${columnIndex !== 0 ? 'border-l border-gray-400' : ''}`}>
                    {datos[rowIndex] &&
                      <div style={{ fontSize: '18px' }}>{`${datos[rowIndex].nombre} (${datos[rowIndex].stockD})`}</div>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal con Tailwind CSS */}
      {diaSeleccionado && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
  <div className="absolute inset-0 flex items-center justify-center" >
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl w-full flex" style={{background:'black'}}>

      {/* Primera sección: Botones por tipo */}
      <div className="mr-4 flex-1">
        <h2 className="text-lg font-semibold mb-4">{diaSeleccionado}</h2>
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Tipo 1</h3>
          <div className="flex flex-wrap gap-2">
            {obtenerBotonesMenu(1)}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Tipo 2</h3>
          <div className="flex flex-wrap gap-2">
            {obtenerBotonesMenu(2)}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Tipo 3</h3>
          <div className="flex flex-wrap gap-2">
            {obtenerBotonesMenu(3)}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Tipo 4</h3>
          <div className="flex flex-wrap gap-2">
            {obtenerBotonesMenu(4)}
          </div>
        </div>
      </div>

      {/* Segunda sección: Tabla del día seleccionado */}
      <div className="flex-1 max-h-96 overflow-y-auto" style={{paddingTop:'50px'}}>
        <h2 className="text-lg font-semibold mb-4">Detalles del día</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Stock</th>
            </tr>
          </thead>
          <tbody className="bg-gray-500 divide-y divide-gray-600">
            {datosSemana.filter(item => item.dia === diaSeleccionado).map(item => (
              <tr key={item.id}>
                <td className="px-4 py-2">{item.nombre}</td>
                <td className="px-4 py-2">{item.tipo}</td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={item.stock}
                    className="w-full bg-gray-300 rounded px-2 py-1"
                    onChange={(e) => handleStockChange(e, item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>

    {/* Botón de Cerrar */}
    <button className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => setDiaSeleccionado(null)}>Cerrar</button>

  </div>
</div>


 
  
     
      
      )}

    </div>
  );
}













  