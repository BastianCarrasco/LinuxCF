import { useEffect, useState } from "react";
import { obtenerVentas } from "../Consultas/GET/getVentas";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };
  const filteredVentas = ventas.filter((venta) => {
    const ventaMonth = new Date(venta.fechaVenta).getMonth() + 1; // getMonth() devuelve un índice basado en 0
    return selectedMonth === "" || ventaMonth === parseInt(selectedMonth);
  });
  
  

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
    return Math.round(
      ventas
        .filter(venta => venta.estado !== 5) // Filtra las ventas que no están canceladas
        .reduce((total, venta) => total + parseFloat(venta.precio), 0)
    );
  };

  // Cuenta cuántos clientes son 'Caja', 'Encargos', y 'Cancelados'
  const countClientTypes = () => {
    const clientCounts = {
      Caja: 0,
      Encargos: 0,
      Cancelados: 0
    };

    ventas.forEach(venta => {
      if (venta.estado === 0) {
        clientCounts.Caja += 1;
      } else if (venta.estado === 1) {
        clientCounts.Encargos += 1;
      } else if (venta.estado === 5) {
        clientCounts.Cancelados += 1;
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
  
    // Usar filteredVentas para obtener los datos filtrados
    const rows = filteredVentas.map(venta => [
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
      header.join(','),      // Encabezado
      ...rows.map(row => row.join(','))   // Filas de datos
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
      <div
        style={{
          backgroundColor: "black",
          textAlign: "left",
          maxHeight: "90vh",
          overflowY: "auto",
          marginTop: "-90px",
        }}
        className="w-1/4 p-4 bg-gray-100 border-r border-gray-300"
      >
        <br />
        <br />
        <br />
        <div className="mb-4">
          <br />
          <span
            style={{ fontSize: "30px" }}
            className="text-xl font-bold text-white"
          >
            Ganancias Totales:
          </span>
          <br />
          <br />
          <p style={{ fontSize: "30px" }} className="text-2xl text-white">
            $ {calculateTotalEarnings()}
          </p>
          <br />
          <br />
        </div>
        <div className="mb-4">
          <span
            style={{ fontSize: "30px" }}
            className="text-xl font-bold text-white"
          >
            Eventos:
          </span>
          <br />
          <br />
          <p style={{ fontSize: "30px" }} className="text-2xl text-white">
            Caja: {countClientTypes().Caja}
          </p>
          <p style={{ fontSize: "30px" }} className="text-2xl text-white">
            Encargos: {countClientTypes().Encargos}
          </p>
          <p style={{ fontSize: "30px" }} className="text-2xl text-white">
            Cancelados: {countClientTypes().Cancelados}
          </p>
        </div>
        <div className="mb-4">
          <br />
          <br />
          <br />
          <span
            style={{ fontSize: "30px" }}
            className="text-xl font-bold text-white"
          >
            Top 10 Colaciones:
          </span>
          <ul style={{ fontSize: "20px" }} className="text-xl text-white">
            {getTop10TextoOrden().map(([texto, count], index) => (
              <li key={index}>
                {texto} - {count} veces
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <span className="text-xl font-bold text-white">Pedidos por Día:</span>
          <ul className="text-xl text-white">
            {Object.entries(countOrdersByDay()).map(([day, count], index) => (
              <li key={index}>
                {day} - {count} pedidos
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <span className="text-xl font-bold text-white">Pedidos por Mes:</span>
          <ul className="text-xl text-white">
            {Object.entries(countOrdersByMonth()).map(([month, count], index) => (
              <li key={index}>
                {month} - {count} pedidos
              </li>
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
      <div
        className="w-5/6 p-4 overflow-y-auto"
        style={{ maxHeight: "90vh", textAlign: "center" }}
      >
        {/* Filtro de meses */}
        <div className="mb-4">
          <label htmlFor="month-select" className="text-xl font-bold text-white">
            Filtrar por Mes:
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="ml-2 p-2 bg-white text-black rounded"
          >
            <option value="">Todos</option>
            <option value="01">Enero</option>
            <option value="02">Febrero</option>
            <option value="03">Marzo</option>
            <option value="04">Abril</option>
            <option value="05">Mayo</option>
            <option value="06">Junio</option>
            <option value="07">Julio</option>
            <option value="08">Agosto</option>
            <option value="09">Septiembre</option>
            <option value="10">Octubre</option>
            <option value="11">Noviembre</option>
            <option value="12">Diciembre</option>
          </select>
        </div>
  
        {/* Tabla de ventas */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-black">
            <thead
              className="text-center"
              style={{ backgroundColor: "white" }}
            >
              <tr>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">
                  N
                </th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">
                  Colación
                </th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">
                  Comentario
                </th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody
              className="bg-white divide-y divide-black text-center"
            >
              {filteredVentas.map((venta, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">
                    {venta.numeroOrden}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">
                    {venta.estado === 0
                      ? "Caja"
                      : venta.estado === 1
                      ? "Encargo"
                      : venta.estado === 5
                      ? "Cancelado"
                      : venta.estado === 3
                      ? "Encargo en espera"
                      : "Desconocido"}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black text-left"
                  >
                    {venta.textoOrden}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">
                    {venta.cantidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">
                    {venta.comentario}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">
                    $ {Math.round(venta.precio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">
                    {formatDate(venta.fechaVenta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
}
