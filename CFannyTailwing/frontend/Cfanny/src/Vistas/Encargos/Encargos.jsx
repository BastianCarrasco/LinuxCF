import { useEffect, useState } from "react";
import { obtenerDatosPedidos } from "../Consultas/GET/getPedidos";
import { eliminarPedido } from "../Consultas/DELETE/eliminarPedido";
import { actualizarEstadoPedido } from "../Consultas/UPDATE/editarEstado";
import Boleta from "./BoletaEncargo";

export default function Encargos() {
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedBarra, setSelectedBarra] = useState(null);
  const [isBoletaOpen, setIsBoletaOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  const fetchPedidos = async () => {
    try {
      const data = await obtenerDatosPedidos();
      setPedidos(data);
    } catch (error) {
      console.error('Error al obtener datos de los pedidos:', error);
    }
  };

  useEffect(() => {
    fetchPedidos();
    const intervalId = setInterval(fetchPedidos, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value.length === 9) {
      handleDelete(value);
    }
  };

  const handleDelete = async (barra) => {
    try {
      const pedidosToDelete = pedidos.filter(pedido => pedido.barra === barra);
      if (pedidosToDelete.length === 0) {
        console.log("No se encontraron pedidos con el código de barra proporcionado.");
        return;
      }
      for (const pedido of pedidosToDelete) {
        await eliminarPedido(parseInt(pedido.barra, 10));
      }
      const updatedPedidos = pedidos.filter(pedido => pedido.barra !== barra);
      setPedidos(updatedPedidos);
      console.log("Pedidos eliminados:", pedidosToDelete);
    } catch (error) {
      console.error('Error al eliminar pedidos:', error);
    }
  };

  const handleUpdateEstado = async () => {
    if (selectedBarra) {
      try {
        await actualizarEstadoPedido(selectedBarra);
        setPedidos((prevPedidos) => prevPedidos.map((pedido) =>
          pedido.barra === selectedBarra ? { ...pedido, estado: 'Actualizado' } : pedido
        ));
        console.log("Estado del pedido actualizado");
      } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
      }
    }
  };

  const handlePrintBoleta = (pedido) => {
    setSelectedPedido(pedido);
    setIsBoletaOpen(true);
  };

  const filteredPedidos = pedidos.filter(pedido => pedido.cliente !== null && pedido.estado !== 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Encargos</h1>
      <input
        className="border border-gray-400 p-2 mb-6 w-full text-center"
        type="text"
        value={filter}
        onChange={handleInputChange}
        placeholder="Escanea o ingresa el código de barra aquí"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Número de Orden</th>
              <th className="px-4 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Texto Orden</th>
              <th className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Comentario</th>
              <th className="px-2 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Barra</th>
              <th className="px-6 py-3 text-left text-2xl font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPedidos.map((pedido, index) => (
              <tr
                key={index}
                className={pedido.estado === 1 ? "bg-blue-500 text-white" : ""}
              >
                <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">{pedido.numeroOrden}</td>
                <td className="px-4 py-4 whitespace-nowrap text-xl text-gray-500">{pedido.textoOrden}</td>
                <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">{pedido.cantidad}</td>
                <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">{pedido.comentario}</td>
                <td className="px-2 py-4 whitespace-nowrap text-xl text-gray-500">$ {parseInt(pedido.precio, 10)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">{pedido.barra}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xl text-gray-500">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handlePrintBoleta(pedido)}
                  >
                    Boucher
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPedido && (
        <Boleta
          ListaMayor={[selectedPedido]}
          isOpen={isBoletaOpen}
          onClose={() => setIsBoletaOpen(false)}
          precioTotal={selectedPedido.precio}
          borrar={() => setSelectedPedido(null)}
          barra={selectedPedido.barra}
          filter={filter}
          clearFilter={() => setFilter('')}
          aumentarCliente={handleUpdateEstado(selectedPedido.barra)}
        />
      )}
    </div>
  );
}
