import { useEffect, useState } from "react";
import { obtenerVentas } from "../Consultas/GET/getVentas";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);

  // Función para obtener y establecer los datos de ventas
  const fetchVentas = async () => {
    try {
      const data = await obtenerVentas();
      setVentas(data); // Almacena los datos en el estado
    } catch (error) {
      console.error('Error al obtener datos de las ventas:', error);
    }
  };

  useEffect(() => {
    fetchVentas(); // Llama a la función para obtener los datos al cargar el componente

    // Configura un intervalo para actualizar las ventas cada 5 segundos
    const intervalId = setInterval(fetchVentas, 5000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  // Formatea la fecha en formato latinoamericano
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-CO', options);
  };

  // Calcula las ganancias totales
  const calculateTotalEarnings = () => {
    return Math.round(ventas.reduce((total, venta) => total + parseFloat(venta.precio), 0));
  };

  // Cuenta cuántos clientes son 'Caja' y cuántos son 'Encargos'
  const countClientTypes = () => {
    const clientCounts = {
      Caja: 0,
      Encargos: 0
    };

    ventas.forEach(venta => {
      if (venta.estado === 0) {
        clientCounts.Caja += 1;
      } else if (venta.estado === 1) {
        clientCounts.Encargos += 1;
      }
    });

    return clientCounts;
  };
  

  // Obtiene el top 10 de Texto Orden
  const getTop10TextoOrden = () => {
    const textoOrdenCount = ventas.reduce((acc, venta) => {
      acc[venta.textoOrden] = (acc[venta.textoOrden] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(textoOrdenCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  // Cuenta pedidos por día
  const countOrdersByDay = () => {
    const ordersByDay = ventas.reduce((acc, venta) => {
      const day = formatDate(venta.fechaVenta);
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    return ordersByDay;
  };

  // Cuenta pedidos por mes
  const countOrdersByMonth = () => {
    const ordersByMonth = ventas.reduce((acc, venta) => {
      const month = new Date(venta.fechaVenta).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
    return ordersByMonth;
  };

  // Función para descargar los datos como CSV
  const downloadCSV = () => {
    const header = ['Número de Orden', 'Cliente', 'Texto Orden', 'Cantidad', 'Comentario', 'Precio', 'Fecha'];
    const rows = ventas.map(venta => [
    
      venta.numeroOrden,
      venta.estado === 0 ? 'Caja' : venta.estado === 1 ? 'Encargo' : venta.estado === 5 ? 'Cancelado' : venta.estado === 3 ? 'Encargo en espera' : 'Desconocido',
      venta.textoOrden,
      venta.cantidad,
      venta.comentario,
      Math.round(venta.precio),
      formatDate(venta.fechaVenta),
    ]);

    // Crear contenido CSV
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Crear un blob y descargarlo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ventas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-screen p-4 flex flex-row">
      {/* Sección de resumen de ganancias totales */}
      <div style={{ backgroundColor: "black", textAlign:'left' }} className="w-1/4 p-4 bg-gray-100 border-r border-gray-300">
        <br /><br /><br />

        <div className="mb-4">
          <br />
          <span style={{ fontSize: "30px" }} className="text-xl font-bold">Ganancias Totales:</span>
          <br /><br />
          <p style={{ fontSize: "30px" }} className="text-2xl text-white-700">$ {calculateTotalEarnings()}</p>
          <br /><br />
        </div>
        <div className="mb-4">
          <span style={{ fontSize: "30px" }} className="text-xl font-bold">Clientes 'Caja' y 'Encargos':</span>
          <br /><br />
          <p style={{ fontSize: "30px" }} className="text-2xl text-white-700">
            Caja: {countClientTypes().Caja}
          </p>
          <p style={{ fontSize: "30px" }} className="text-2xl text-white-700">
            Encargos: {countClientTypes().Encargos}
          </p>
        </div>
        <div className="mb-4">
          <br /><br /><br />
          <span style={{ fontSize: "30px" }} className="text-xl font-bold">Top 10 Colaciones:</span>
          <ul style={{ fontSize: "20px" }} className="text-xl text-white-700">
            {getTop10TextoOrden().map(([texto, count], index) => (
              <li key={index}>{texto} - {count} veces</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <span className="text-xl font-bold">Pedidos por Día:</span>
          <ul className="text-xl text-white-700">
            {Object.entries(countOrdersByDay()).map(([day, count], index) => (
              <li key={index}>{day} - {count} pedidos</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <span className="text-xl font-bold">Pedidos por Mes:</span>
          <ul className="text-xl text-white-700">
            {Object.entries(countOrdersByMonth()).map(([month, count], index) => (
              <li key={index}>{month} - {count} pedidos</li>
            ))}
          </ul>
        </div>

        {/* Botón para descargar CSV */}
        <button
          onClick={downloadCSV}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Descargar CSV
        </button>
      </div>

      {/* Sección de la tabla de ventas */}
      <div className="w-5/6 p-4 overflow-auto">
        <h2 style={{ textAlign: "center" }} className="text-4xl font-bold mb-6">Ventas</h2>

        <div style={{ textAlign: "center" }} className="flex-1 overflow-auto">
          <table style={{ textAlign: "center" }} className="min-w-full divide-y divide-gray-200">
            <thead style={{ textAlign: "center" }}>
              <tr style={{ textAlign: "center" }}>
                <th style={{ textAlign: "center" }} className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">N</th>
                <th style={{ textAlign: "center" }} className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th style={{ textAlign: "center" }} className="px-4 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Texto Orden</th>
                <th style={{ textAlign: "center" }} className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th style={{ textAlign: "center" }} className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Comentario</th>
                <th style={{ textAlign: "center" }} className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th style={{ textAlign: "center" }} className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "center" }} className="bg-white divide-y divide-gray-200">
              {ventas.map((venta, index) => (
                <tr key={index}>
                  <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">{venta.numeroOrden}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">
                    {venta.estado === 0 ? 'Caja' : venta.estado === 1 ? 'Encargo' : venta.estado === 5 ? 'Cancelado' : venta.estado === 3 ? 'Encargo en espera' : 'Desconocido'}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">{venta.textoOrden}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">{venta.cantidad}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">{venta.comentario}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">${Math.round(venta.precio)}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">{formatDate(venta.fechaVenta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

