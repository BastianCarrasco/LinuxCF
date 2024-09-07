import { useEffect, useState } from "react";
import { obtenerVentas } from "../Consultas/GET/getVentas";
import { formatDate, countOrdersByMonth, calculateTotalEarnings, countClientTypes, getTop10TextoOrden, countOrdersByDay, downloadCSV } from "./funciones_ventas";
import { borrarVentas } from "../Consultas/DELETE/elimnarVentas";

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState(""); // State for day filter
  const [password, setPassword] = useState(""); // State for the password input
  const correctPassword = "2601123"; // Hardcoded password for confirmation
  const [showModal, setShowModal] = useState(false); // State for showing modal


  const handleDeleteVentas = () => {
    if (password === correctPassword) {
      borrarVentas()
        .then(() => {
          alert("Las ventas han sido eliminadas correctamente.");
          setShowModal(false); // Close the modal
          fetchVentas(); // Refresh the ventas list
        })
        .catch((error) => {
          console.error("Error al borrar ventas:", error);
        });
    } else {
      alert("Contraseña incorrecta. Intenta de nuevo.");
    }
  };





  // Handler for month filter
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Handler for day filter
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  // Filter ventas by month and day
  const filteredVentas = ventas.filter((venta) => {
    const ventaDate = new Date(venta.fechaVenta);
    const ventaMonth = ventaDate.getMonth() + 1;
    const ventaDay = ventaDate.getDate();

    // Return ventas filtered by both month and day
    return (
      (selectedMonth === "" || ventaMonth === parseInt(selectedMonth)) &&
      (selectedDay === "" || ventaDay === parseInt(selectedDay))
    );
  });

  // Fetch ventas data
  const fetchVentas = async () => {
    try {
      const data = await obtenerVentas();
      setVentas(data); // Store ventas data in state
    } catch (error) {
      console.error('Error al obtener datos de las ventas:', error);
    }
  };

  useEffect(() => {
    fetchVentas(); // Call fetchVentas on component mount

    // Set an interval to fetch ventas every 5 seconds
    const intervalId = setInterval(fetchVentas, 5000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  // Trigger CSV download
  function activarCSV() {
    downloadCSV(filteredVentas);
  }

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
          <span style={{ fontSize: "30px" }} className="text-xl font-bold text-white">
            Ganancias Totales:
          </span>
          <br />
          <br />
          <p style={{ fontSize: "30px" }} className="text-2xl text-white">
            $ {calculateTotalEarnings(ventas)}
          </p>
          <br />
          <br />
        </div>
        <div className="mb-4">
          <span style={{ fontSize: "30px" }} className="text-xl font-bold text-white">
            Eventos:
          </span>
          <br />
          <br />
          <p style={{ fontSize: "30px" }} className="text-2xl text-white">
            Caja: {countClientTypes(ventas).Caja}
          </p>
          <p style={{ fontSize: "30px" }} className="text-2xl text-white">
            Encargos: {countClientTypes(ventas).Encargos}
          </p>
          <p style={{ fontSize: "30px" }} className="text-2xl text-white">
            Cancelados: {countClientTypes(ventas).Cancelados}
          </p>
        </div>
        <div className="mb-4">
          <br />
          <br />
          <br />
          <span style={{ fontSize: "30px" }} className="text-xl font-bold text-white">
            Top 10 Colaciones:
          </span>
          <ul style={{ fontSize: "20px" }} className="text-xl text-white">
            {getTop10TextoOrden(ventas).map(([texto, count], index) => (
              <li key={index}>
                {texto} - {count} veces
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <span className="text-xl font-bold text-white">Pedidos por Día:</span>
          <ul className="text-xl text-white">
            {Object.entries(countOrdersByDay(ventas)).map(([day, count], index) => (
              <li key={index}>
                {day} - {count} pedidos
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <span className="text-xl font-bold text-white">Pedidos por Mes:</span>
          <ul className="text-xl text-white">
            {Object.entries(countOrdersByMonth(ventas)).map(([month, count], index) => (
              <li key={index}>
                {month} - {count} pedidos
              </li>
            ))}
          </ul>
        </div>

        {/* Botón para descargar CSV */}
        <button
          onClick={activarCSV}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Descargar CSV
        </button>

        <button
          onClick={() => setShowModal(true)} // Show the modal when clicked
          className="p-2 bg-red-500 text-white rounded"
          style={{marginLeft:"10px"}}
        >
          Borrar Ventas
        </button>
      </div>

      {showModal && (
        <div style={{scale:"150%", border:"solid", borderColor:"white"}} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div style={{border:"solid"}} className="bg-black p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">Confirmar Borrado</h2>
            <p className="mb-4 text-white">Por favor, ingresa la contraseña para borrar las ventas:</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 text-black" // Input text stays black
              placeholder="Contraseña"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteVentas}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Sección de la tabla de ventas */}
      <div className="w-5/6 p-4 overflow-y-auto" style={{ maxHeight: "90vh", textAlign: "center" }}>
        {/* Filtro de meses */}
        <div className="mb-4 flex justify-between">
          {/* Filtro de días a la izquierda */}
          <div>
            <label htmlFor="day-select" className="text-xl font-bold text-white">
              Filtrar por Día:
            </label>
            <select
              id="day-select"
              value={selectedDay}
              onChange={handleDayChange}
              className="ml-2 p-2 bg-white text-black rounded"
            >
              <option value="">Todos</option>
              {[...Array(31).keys()].map((day) => (
                <option key={day + 1} value={day + 1}>
                  {day + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de meses a la derecha */}
          <div>
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
        </div>


        {/* Tabla de ventas */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-black">
            <thead className="text-center" style={{ backgroundColor: "white" }}>
              <tr>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">N</th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">Cliente</th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">Colación</th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">Cantidad</th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">Comentario</th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">Precio</th>
                <th className="px-2 py-3 text-2xl font-medium text-black uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black text-center">
              {filteredVentas.map((venta, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">{venta.numeroOrden}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">
                    {venta.estado === 0 ? "Caja" : venta.estado === 1 ? "Encargo" : venta.estado === 5 ? "Cancelado" : "Desconocido"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">{venta.textoOrden}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">{venta.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">{venta.comentario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">$ {Math.round(venta.precio)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium text-black">{formatDate(venta.fechaVenta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
