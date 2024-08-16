import { useEffect, useState, useRef } from "react";
import { obtenerDatosPedidos } from "../Consultas/GET/getPedidos";
import { eliminarPedido } from "../Consultas/DELETE/eliminarPedido";
import { ImFire } from "react-icons/im";

export default function Cola() {
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState("");
  const rojos = [31, 32, 43, 44, 45, 77, 78, 79, 80];
  const inputRef = useRef(null); // Referencia al input

  useEffect(() => {
    pedidos.forEach(element => {
      const partes = element.stringSelecteDataId.split('-');
      const contieneRojo = partes.some(parte => rojos.includes(parseInt(parte)));
      if (contieneRojo) {
        console.log("Elemento con rojo encontrado:", element);
      }
    });
  }, [pedidos]);

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

    // Coloca el foco en el input cuando se carga la vista
    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFilter(value);

    if (value.length === 9) {
      handleDelete(value);
      setFilter("");
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

  const filteredPedidos = pedidos.filter(pedido => pedido.estado === 1 || pedido.estado === 0);

  const mergeOrders = (pedidos) => {
    const mergedPedidos = [];
    let currentOrder = null;
    let rowSpan = 0;

    pedidos.forEach((pedido, index) => {
      const partes = pedido.stringSelecteDataId.split('-');
      const contieneRojo = partes.some(parte => rojos.includes(parseInt(parte)));

      const textoOrdenConIcono = (
        <span>
          {pedido.textoOrden} {contieneRojo && <ImFire style={{ color: 'red', display: 'inline-block', marginLeft: '50px', scale:'150%',marginRight: '-50px' }} />}
        </span>
      );

      if (currentOrder && currentOrder.numeroOrden === pedido.numeroOrden) {
        rowSpan++;
        mergedPedidos.push({ ...pedido, rowSpan: 0, textoOrdenConIcono });
      } else {
        if (currentOrder) {
          mergedPedidos[mergedPedidos.length - rowSpan - 1].rowSpan = rowSpan + 1;
        }
        currentOrder = pedido;
        rowSpan = 0;
        mergedPedidos.push({ ...pedido, rowSpan: 1, textoOrdenConIcono });
      }
    });

    if (currentOrder) {
      mergedPedidos[mergedPedidos.length - rowSpan - 1].rowSpan = rowSpan + 1;
    }

    return mergedPedidos;
  };

  const mergedPedidos = mergeOrders(filteredPedidos);

  return (
    <div className="w-full min-h-screen p-4 flex flex-col">
      <h2 className="text-4xl font-bold mb-6">Cola</h2>

      {/* Campo de entrada para ingresar el código de barra */}
      <input
        type="text"
        value={filter}
        onChange={handleInputChange}
        placeholder="Ingresar ID de nueve dígitos..."
        className="mb-4 p-2 border border-black-300 rounded"
        style={{ fontSize: "18px", color: "black" }}
        ref={inputRef} // Asocia el input con la referencia
      />

      {/* Contenedor con scroll para la tabla */}
      <div className="flex-1 overflow-y-auto">
        <div style={{ maxHeight: '850px', overflowY: 'auto' }}>
          <table
            style={{ textAlign: 'left', backgroundColor: 'white' }}
            className="min-w-full divide-y divide-black-200"
          >
            <thead style={{ color: 'black' }}>
              <tr>
                <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">
                  N
                </th>
                <th className="px-4 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">
                  Texto Orden
                </th>
                <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">
                  Comentario
                </th>
                <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black-200">
              {mergedPedidos.map((pedido, index) => (
                <tr
                  key={index}
                  className={pedido.estado === 1 ? "bg-blue-500 text-white" : "bg-white-500 text-black"}
                >
                  {pedido.rowSpan > 0 && (
                    <td className="px-2 py-4 whitespace-nowrap text-xl" rowSpan={pedido.rowSpan}>
                      {pedido.numeroOrden}
                    </td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap text-xl">{pedido.textoOrdenConIcono}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-xl">{pedido.cantidad}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-xl">{pedido.comentario}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-xl">$ {parseInt(pedido.precio, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


