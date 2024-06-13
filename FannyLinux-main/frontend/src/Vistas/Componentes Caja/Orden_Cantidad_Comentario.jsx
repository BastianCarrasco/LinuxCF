import React, { useState, useEffect } from 'react';
import {
  TextoOrden,
  Comentario,
  Cantidad,
  resetearValores, cambiarComentario, cambiarCantidad, resetearArregloPedidos, borrarUltimoElementoListaPedido
} from './partesOrden';
import { FaUndoAlt } from 'react-icons/fa'; // Importa el ícono de flecha hacia atrás desde React Icons

function Orden_Cantidad_Comentario() {
  const [key, setKey] = useState(0);
  const [cantidadlocal, setCantidad] = useState(Cantidad);
  const [comentariolocal, setComentario] = useState(Comentario);
  const [txt, settxt] = useState(TextoOrden);
  const [textoJson, setTextoJson] = useState('');
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [clickCount]); // Se suscribe nuevamente cada vez que clickCount cambie

  const handleCantidadChange = (event) => {
    const { value } = event.target;
    if (!isNaN(value)) {
      setCantidad(value);
    }

  };

  useEffect(() => { cambiarCantidad(cantidadlocal); setCantidad(Cantidad); }, [cantidadlocal])
  useEffect(() => { cambiarComentario(comentariolocal); setComentario(Comentario); }, [comentariolocal])

  const handleComentarioChange = (event) => {
    const { value } = event.target;
    setComentario(value);

  };

  const handleResetClick = () => {
    resetearValores();
    resetearArregloPedidos();

  };

  const countClick = () => {
    setClickCount(clickCount + 1);
    settxt(TextoOrden);
    setCantidad(Cantidad);
    setComentario(Comentario);
  };

  const handleDocumentClick = () => {
    countClick(); // Llama a la función countClick para contar los clics
  };

  const handleBorrarUltimoClick = () => {
    borrarUltimoElementoListaPedido();
    setKey(key + 1); // Actualiza el estado key para forzar la actualización del componente
  };

  return (
    <div key={key}>
      <div>
        <label>Orden:</label>
        <input style={{ width: "80%", marginBottom: "5px", backgroundColor:"black", color:"yellow" }} type="text" value={txt} readOnly />
        <button style={{ marginLeft: "15px", marginBottom: "5px",  scale:"90%", backgroundColor:"blue", color:"white", border:"solid", borderBlockColor:"white" }} onClick={handleBorrarUltimoClick}><FaUndoAlt /></button> {/* Botón con el ícono de flecha hacia atrás */}

      </div>

      <div>
        <label>Comentario:</label>
        <input style={{ width: "60%", marginLeft: "10px" , backgroundColor:"black", color:"yellow"}} type="text" value={comentariolocal} onChange={handleComentarioChange} />
        <label style={{ maxWidth: "10%", marginLeft: "10px", backgroundColor:"black", color:"yellow" }}>Cantidad:</label>

        <input style={{ maxWidth: "10%", marginLeft: "10px", backgroundColor:"black", color:"yellow"  }} type="text" value={cantidadlocal} onChange={handleCantidadChange} />
      </div>

      {/* <button className='cancelar' style={{scale:"80%", fontSize:"18px"}}  onClick={handleResetClick}>CANCELAR</button> */}

      {/* Mostrar la representación JSON de TextoOrden */}
      {/* <p>Clicks en cualquier parte: {clickCount}</p> */}
    </div>
  );
}

export default Orden_Cantidad_Comentario;













