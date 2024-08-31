import { useEffect, useState } from "react";
import { obtenerDatosPedidos } from "../Consultas/GET/getPedidos";
import { eliminarPedido } from "../Consultas/DELETE/eliminarPedido";

import { createAndPrintPDF } from "./BoletaEncargo"; // Import the function correctly
import reparador_stock from "../Caja/repararStock/reparador";
import { actualizarEstadoPedido } from "../Consultas/UPDATE/editarEstado";

export default function Encargos() {
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedBarra, setSelectedBarra] = useState(null);



  
  const handleActualizarEstado = async (pedido) => {
    try {
      const barra = pedido.barra; // Asumimos que 'barra' está en el objeto pedido
      const nuevoEstado = 5; // Por ejemplo, '5' puede ser el estado para cancelado
  
      // Actualizar el estado del pedido
      const resultadoEstado = await actualizarEstadoPedido(barra, nuevoEstado);
      console.log('Estado actualizado:', resultadoEstado);
  
      // Eliminar el pedido
      const resultadoEliminacion = await eliminarPedido(parseInt(barra, 10));
      console.log('Pedido eliminado:', resultadoEliminacion);
  
    } catch (error) {
      console.error('Error al actualizar el estado o eliminar el pedido:', error);
    }

    fetchPedidos();
  };


  const handleCancel = async (n) => {
    const barraCancelar = n.barra;
  
    // Utilizamos un bucle for...of para poder usar await dentro del bucle
    for (const element of pedidos) {
      if (element.barra === barraCancelar) {
        // Ejecuta reparador_stock y espera a que termine antes de continuar
        await reparador_stock(element);
  
        // Actualiza el estado del pedido después de procesarlo
        handleActualizarEstado(element);
      }
    }
  
    
    fetchPedidos();
  };


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
        return;
      }
      for (const pedido of pedidosToDelete) {
        await eliminarPedido(parseInt(pedido.barra, 10));
      }
      const updatedPedidos = pedidos.filter(pedido => pedido.barra !== barra);
      setPedidos(updatedPedidos);
    } catch (error) {
      console.error('Error al eliminar pedidos:', error);
    }
  };

  const handleUpdateEstado = async (barra) => {
    try {
      const nuevoEstado = 1; // Ajusta el valor según tu lógica de negocio
      const resultado = await actualizarEstadoPedido(barra, nuevoEstado);

      setPedidos((prevPedidos) => prevPedidos.map((pedido) =>
        pedido.barra === barra ? { ...pedido, estado: nuevoEstado } : pedido
      ));
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  };

  const handlePrintBoleta = async (barra) => {
    const pedidosToPrint = pedidos.filter(pedido => pedido.barra === barra);
    if (pedidosToPrint.length > 0) {
      await handleUpdateEstado(barra);
      createAndPrintPDF(pedidosToPrint, barra); // Call the function directly
      fetchPedidos();
    }
  };

  const filteredPedidos = pedidos.filter(pedido => pedido.estado === 3);

  const mergeOrders = (pedidos) => {
    const mergedPedidos = [];
    let currentOrder = null;
    let rowSpan = 0;

    pedidos.forEach((pedido, index) => {
      if (currentOrder && currentOrder.numeroOrden === pedido.numeroOrden) {
        rowSpan++;
        mergedPedidos.push({ ...pedido, rowSpan: 0 });
      } else {
        if (currentOrder) {
          mergedPedidos[mergedPedidos.length - rowSpan - 1].rowSpan = rowSpan + 1;
        }
        currentOrder = pedido;
        rowSpan = 0;
        mergedPedidos.push({ ...pedido, rowSpan: 1 });
      }
    });

    if (currentOrder) {
      mergedPedidos[mergedPedidos.length - rowSpan - 1].rowSpan = rowSpan + 1;
    }

    return mergedPedidos;
  };

  const mergedPedidos = mergeOrders(filteredPedidos);

  return (
    <div className="w-full mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Encargos</h1> */}
      {/* <input
        className="border border-black-400 p-2 mb-6 w-full text-center"
        type="text"
        value={filter}
        onChange={handleInputChange}
        placeholder="Escanea o ingresa el código de barra aquí"
      /> */}
      <div className="overflow-x-auto w-full">
        <table  style={{ textAlign: 'left',backgroundColor:'white', color: 'black' }} className="min-w-full divide-y divide-black-200 w-full">
          <thead>
            <tr>
              <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">N</th>
              <th className="px-4 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">Texto Orden</th>
              <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">Comentario</th>
              <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">Precio</th>
              <th className="px-4 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody style={{backgroundColor:'white', color: 'black'}}  className="bg-white divide-y divide-black-200 w-full">
            {mergedPedidos.map((pedido, index) => (
              <tr style={{backgroundColor:'white', color: 'black'}}  key={index} className={pedido.estado !== 3 ? "bg-blue-500 text-white" : ""}>
                {pedido.rowSpan > 0 && (
                  <td  tyle={{backgroundColor:'white', color: 'black'}}  className="px-2 py-4 whitespace-nowrap text-xl text-black-500" rowSpan={pedido.rowSpan}>
                    {pedido.numeroOrden}
                  </td>
                )}
                <td className="px-4 py-4 whitespace-nowrap text-xl text-black-500">{pedido.textoOrden}</td>
                <td className="px-2 py-4 whitespace-nowrap text-xl text-black-500">{pedido.cantidad}</td>
                <td className="px-2 py-4 whitespace-nowrap text-xl text-black-500">{pedido.comentario}</td>
                <td className="px-2 py-4 whitespace-nowrap text-xl text-black-500">$ {parseInt(pedido.precio, 10)}</td>

                {pedido.rowSpan > 0 && (

                <td tyle={{backgroundColor:'white', color: 'black'}}  className="px-2 py-4 whitespace-nowrap text-xl text-black-500">{pedido.cliente}</td>
              )}
                {pedido.rowSpan > 0 && (
                <td style={{backgroundColor:'white'}} className="px-6 py-4 whitespace-nowrap text-xl text-black-500">

                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handlePrintBoleta(pedido.barra)}
                  >
                    Voucher/Boleta
                  </button>

                  <button
                      onClick={() => handleCancel(pedido)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Cancelar
                    </button>
                </td>
 )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
