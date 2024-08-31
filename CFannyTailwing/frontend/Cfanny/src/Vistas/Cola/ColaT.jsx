import React, { useEffect, useState, useRef } from "react";
import { obtenerDatosPedidos } from "../Consultas/GET/getPedidos";
import { eliminarPedido } from "../Consultas/DELETE/eliminarPedido";
import { ImFire } from "react-icons/im";
import { actualizarComentario } from "../Consultas/UPDATE/actualizar_comentario_pedido";
import { actualizarEstadoPedido } from "../Consultas/UPDATE/editarEstado";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice, faIceCream, faWineBottle, faFile } from '@fortawesome/free-solid-svg-icons';

export default function ColaT() {
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [newComment, setNewComment] = useState("");
  const rojos = [31, 32, 43, 44, 45, 77, 78, 79, 80];
  const inputRef = useRef(null);
  const [EmpanadaV, setEmpanadaV] = useState(false);
  const [BebidaV, setBebidaV] = useState(false);
  const [PostreV, setPostreV] = useState(false)

  const activar_empanada = (pedido) => {
    setSelectedPedido(pedido);
    setEmpanadaV(true);
  };

  const Empanada = async () => {
    if (selectedPedido) {
      let comentario_actual = selectedPedido.comentario || "";
      const frase = "- Se entrego Empanada";
      let updatedComment;

      if (comentario_actual.includes(frase)) {
        updatedComment = comentario_actual.replace(frase, "").trim();
      } else {
        updatedComment = comentario_actual + " " + frase;
      }

      setNewComment(updatedComment);

      console.log("Comentario actual:", comentario_actual);
      console.log("Nuevo comentario:", updatedComment);

      try {
        // Actualiza el comentario en el servidor
        await actualizarComentario(selectedPedido.id, updatedComment);
        console.log('Comentario actualizado:', newComment);

        // Puedes volver a cargar los pedidos aquí si es necesario
        await fetchPedidos();
      } catch (error) {
        console.error('Error al actualizar el comentario:', error);
      }

      setEmpanadaV(false);
      setNewComment('');
      setShowModal(false); // Close the modal after updating
    }
  };
  useEffect(() => {
    if (EmpanadaV && selectedPedido) {
      Empanada();
    }
  }, [EmpanadaV]);


  ////////////////////////////////////////////

  const activar_bebida = (pedido) => {
    setSelectedPedido(pedido);
    setBebidaV(true);
  };

  const Bebida = async () => {
    if (selectedPedido) {
      let comentario_actual = selectedPedido.comentario || "";
      const frase = "- Se entrego Bebida";
      let updatedComment;

      if (comentario_actual.includes(frase)) {
        updatedComment = comentario_actual.replace(frase, "").trim();
      } else {
        updatedComment = comentario_actual + " " + frase;
      }

      setNewComment(updatedComment);

      console.log("Comentario actual:", comentario_actual);
      console.log("Nuevo comentario:", updatedComment);

      try {
        // Actualiza el comentario en el servidor
        await actualizarComentario(selectedPedido.id, updatedComment);
        console.log('Comentario actualizado:', newComment);

        // Puedes volver a cargar los pedidos aquí si es necesario
        await fetchPedidos();
      } catch (error) {
        console.error('Error al actualizar el comentario:', error);
      }

      setBebidaV(false);
      setNewComment('');
      setShowModal(false); // Close the modal after updating
    }
  };

  useEffect(() => {
    if (BebidaV && selectedPedido) {
      Bebida();
    }
  }, [BebidaV]);

//////////////////////////////////////////////////////////////////////////



const activar_postre = (pedido) => {
  setSelectedPedido(pedido);
  setPostreV(true);
};

const Postre = async () => {
  if (selectedPedido) {
    let comentario_actual = selectedPedido.comentario || "";
    const frase = "- Se entrego Postre";
    let updatedComment;

    if (comentario_actual.includes(frase)) {
      updatedComment = comentario_actual.replace(frase, "").trim();
    } else {
      updatedComment = comentario_actual + " " + frase;
    }

    setNewComment(updatedComment);

    console.log("Comentario actual:", comentario_actual);
    console.log("Nuevo comentario:", updatedComment);

    try {
      // Actualiza el comentario en el servidor
      await actualizarComentario(selectedPedido.id, updatedComment);
      console.log('Comentario actualizado:', newComment);

      // Puedes volver a cargar los pedidos aquí si es necesario
      await fetchPedidos();
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
    }

    setPostreV(false);
    setNewComment('');
    setShowModal(false); // Close the modal after updating
  }
};
useEffect(() => {
  if (PostreV && selectedPedido) {
    Postre();
  }
}, [PostreV]);


//////////////////////////////////////////////////////////////////////////

  const handleEditarComentario = async () => {

    try {
      if (selectedPedido && newComment) {
        await actualizarComentario(selectedPedido.id, newComment);
        fetchPedidos();
        console.log('Comentario actualizado:', newComment);
        setShowModal(false); // Close the modal after updating
      }
    } catch (error) {
      console.error('Error al actualizar el comentario:', error);
    }
    setNewComment('');
  };

  const handleActualizarEstado = async (pedido) => {
    try {
      const barra = pedido.barra;
      const nuevoEstado = 5;

      const resultadoEstado = await actualizarEstadoPedido(barra, nuevoEstado);
      console.log('Estado actualizado:', resultadoEstado);

      const resultadoEliminacion = await eliminarPedido(parseInt(barra, 10));
      console.log('Pedido eliminado:', resultadoEliminacion);

    } catch (error) {
      console.error('Error al actualizar el estado o eliminar el pedido:', error);
    }
  };

  useEffect(() => {
    pedidos.forEach(element => {
      const partes = element.stringSelecteDataId.split('-');
      const contieneRojo = partes.some(parte => rojos.includes(parseInt(parte)));
      if (contieneRojo) {
     
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

  const handleCancel = (pedido) => {
    let barraCancelar = pedido.barra;

    pedidos.forEach(element => {
      if (element.barra === barraCancelar) {
        handleActualizarEstado(element);
      }
    });

    fetchPedidos();

    
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
          {pedido.textoOrden} {contieneRojo && <ImFire style={{ color: 'red', display: 'inline-block', marginLeft: '50px', scale: '150%', marginRight: '-50px' }} />}
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
      
      <input
        type="text"
        value={filter}
        onChange={handleInputChange}
        placeholder="Ingresar ID de nueve dígitos..."
        className="mb-4 p-2 border border-black-300 rounded"
        style={{ fontSize: "18px", color: "black" }}
        ref={inputRef}
      />
  
      <div className="flex-1 overflow-y-auto">
        <div style={{ maxHeight: '850px', overflowY: 'auto' }}>
          <table
            style={{ textAlign: 'left', backgroundColor: 'white', scale:"93%", marginLeft:"-45px" }}
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
                <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider w-32">
                  Acciones
                </th>
                <th className="px-2 py-3 text-left text-2xl font-medium text-black-500 uppercase tracking-wider w-32">
                  Cancelar
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
                  <td className="px-2 py-4 whitespace-nowrap text-xl w-32">
                    <button
                      onClick={() => {
                        setSelectedPedido(pedido);
                        setShowModal(true);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      <FontAwesomeIcon icon={faFile} />
                    </button>
  
                    <button
                      onClick={() => {
                        activar_empanada(pedido);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      style={{ marginLeft: "10px" }}
                    >
                      <FontAwesomeIcon icon={faBreadSlice} />
                    </button>
  
                    <button
                      onClick={() => {
                        activar_bebida(pedido);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      style={{ marginLeft: "10px" }}
                    >
                      <FontAwesomeIcon icon={faWineBottle} />
                    </button>
  
                    <button
                      onClick={() => {
                        activar_postre(pedido);
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      style={{ marginLeft: "10px" }}
                    >
                      <FontAwesomeIcon icon={faIceCream} />
                    </button>
                  </td>
                  {pedido.rowSpan > 0 && (
                    <td className="px-2 py-4 whitespace-nowrap text-xl w-32">
                      <button
                        onClick={() => handleCancel(pedido)}
                        className="bg-red-500 text-white px-4 py-2 rounded mt-2"
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
  
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div style={{ backgroundColor: "black", border: "solid" }} className="bg-white p-6 rounded shadow-lg relative z-10">
            <h3 className="text-2xl mb-4">Editar Comentario</h3>
  
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="p-2 border border-black-300 rounded w-full"
              style={{ color: "black" }}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditarComentario}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}




