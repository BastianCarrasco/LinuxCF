import { useEffect, useState } from "react";
import { obtenerDatosPedidos } from "../Consultas/GET/getPedidos";
import { eliminarPedido } from "../Consultas/DELETE/eliminarPedido";

export default function Encargos() {
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState(""); // Estado para el valor del filtro

  // Función para obtener y establecer los datos de pedidos
  const fetchPedidos = async () => {
    try {
      const data = await obtenerDatosPedidos();
      setPedidos(data); // Almacena los datos en el estado
    } catch (error) {
      console.error('Error al obtener datos de los pedidos:', error);
    }
  };

  useEffect(() => {
    fetchPedidos(); // Llama a la función para obtener los datos al cargar el componente

    // Configura un intervalo para actualizar los pedidos cada 5 segundos
    const intervalId = setInterval(fetchPedidos, 5000);

    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  // Maneja el cambio en el campo de entrada
  const handleInputChange = (e) => {
    const value = e.target.value;
    setFilter(value); // Actualiza el estado del filtro

    // Si el filtro tiene una longitud de 9 caracteres, intenta eliminar pedidos
    if (value.length === 9) {
      handleDelete(value); // Llama a la función de eliminación
    }
  };

  // Elimina los pedidos que coinciden con el filtro
  const handleDelete = async (barra) => {
    try {
      // Filtra los pedidos a eliminar
      const pedidosToDelete = pedidos.filter(pedido => pedido.barra === barra);

      if (pedidosToDelete.length === 0) {
        console.log("No se encontraron pedidos con el código de barra proporcionado.");
        return;
      }

      // Elimina los pedidos
      for (const pedido of pedidosToDelete) {
        await eliminarPedido(parseInt(pedido.barra, 10));
      }

      // Actualiza el estado para reflejar los cambios
      const updatedPedidos = pedidos.filter(pedido => pedido.barra !== barra);
      setPedidos(updatedPedidos);

      console.log("Pedidos eliminados:", pedidosToDelete);
    } catch (error) {
      console.error('Error al eliminar pedidos:', error);
    }
  };

  // Filtra los pedidos para mostrar solo los que tienen cliente no vacío
  const filteredPedidos = pedidos.filter(pedido => pedido.cliente === null || (pedido.clente!==null && pedido.estado===1) );

  return (
    <div className="w-full min-h-screen p-4 flex flex-col">
      <h2 className="text-4xl font-bold mb-6">Encargos</h2>

      {/* Campo de entrada para ingresar el código de barra */}
      <input
        type="text"
        value={filter}
        onChange={handleInputChange}
        placeholder="Ingresar ID de nueve dígitos..."
        className="mb-4 p-2 border border-gray-300 rounded"
        style={{ fontSize: "18px", color:"black" }}
      />

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Número de Orden</th>
              <th className="px-4 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Texto Orden</th>
              <th className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Comentario</th>
              <th className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Barra</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPedidos.map((pedido, index) => (
              <tr
                key={index}
                className={pedido.estado === 1 ? "bg-blue-500 text-white" : "bg-white-500 text-black"}

              >
                <td className="px-2 py-4 whitespace-nowrap text-xl ">{pedido.numeroOrden}</td>
                <td className="px-4 py-4 whitespace-nowrap text-xl ">{pedido.textoOrden}</td>
                <td className="px-2 py-4 whitespace-nowrap text-xl ">{pedido.cantidad}</td>
                <td className="px-2 py-4 whitespace-nowrap text-xl ">{pedido.comentario}</td>
                <td className="px-2 py-4 whitespace-nowrap text-xl "> $ {parseInt(pedido.precio, 10)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xl ">{pedido.barra}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
