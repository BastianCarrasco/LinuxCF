import React, { useEffect, useState } from 'react';
import { eliminarPedido, manejarEntregaEmpanada, manejarEntregaBebida,manejarEntregaPostre } from './partesOrden';
import { FaTrashAlt, FaIceCream, FaBreadSlice, FaMugHot } from 'react-icons/fa'; // Importa los íconos desde React Icons

function ListaBebidas() {
  const [pedidos, setPedidos] = useState([]);
  const [sumaTotalPrecios, setSumaTotalPrecios] = useState(0); // Estado para almacenar la suma total de precios

  useEffect(() => {
    const storedPedidos = JSON.parse(localStorage.getItem('ArregloPedidos')) || [];
    setPedidos(storedPedidos);

    // Calcular la suma total de precios
    const total = storedPedidos.reduce((acc, pedido) => acc + pedido.Precio, 0);
    setSumaTotalPrecios(total);

    // Agregar event listener al montar el componente
    document.body.addEventListener('click', handleClick);

    // Remover event listener al desmontar el componente
    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, []); // El efecto solo se ejecutará una vez al montar el componente

  // Función para manejar el clic en cualquier parte de la página
  const handleClick = () => {
    // Actualizar pedidos (simplemente volvemos a obtenerlos del localStorage)
    const storedPedidos = JSON.parse(localStorage.getItem('ArregloPedidos')) || [];
    setPedidos(storedPedidos);

    // Recalcular la suma total de precios
    const total = storedPedidos.reduce((acc, pedido) => acc + pedido.Precio, 0);
    setSumaTotalPrecios(total);
  };

  const handleBorrarPedido = (index) => {
    eliminarPedido(index);
    const newPedidos = [...pedidos];
    newPedidos.splice(index, 1);
    setPedidos(newPedidos);
  };

  const handlerEmpanada =(index)=>{
    manejarEntregaEmpanada(index);
  };
  const handlerBebida =(index)=>{
    manejarEntregaBebida(index);
  };
  const handlerPostre =(index)=>{
    manejarEntregaPostre(index);
  };

  return (
    <div style={{ color: "yellow", marginTop: "20px" }}>

      <table style={{ textAlign: "center" }} className="full-width-table">
        <thead style={{ color: "yellow", border: "solid" }}>
          <tr style={{ color: "yellow", border: "solid" }}>
            <th >ID</th>
            <th>Texto de la Orden</th>
            <th>#</th>
            <th>Comentario</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody style={{ color: "yellow", border: "solid" }}>
          {pedidos.filter(pedido => pedido.tipo === 5).map((pedido, index) => (
            <tr style={{ color: "yellow", border: "solid" }} key={index}>
              <td  >{index + 1}</td>
              <td>{pedido.TextoOrden}</td>
              <td>{"x" + pedido.Cantidad}</td>
              <td>
                {pedido.Comentario.split('\n').map((linea, i) => (
                  <div key={i}>{linea}</div>
                ))}
              </td>
              <td>{pedido.Precio}</td>
              <td>
                <FaTrashAlt onClick={() => handleBorrarPedido(index)} />
                <FaIceCream onClick={() => handlerPostre(index)} />
                <FaBreadSlice onClick={() => handlerEmpanada(index)} />
                <FaMugHot onClick={() => handlerBebida(index)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default ListaBebidas;