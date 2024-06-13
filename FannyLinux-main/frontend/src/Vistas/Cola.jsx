import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importa Axios si aún no lo has hecho
import { obtenerDatosPedidos, insertarVenta } from '../funciones backend/consultas';

function Cola() {
  const [pedidos, setPedidos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const data = await obtenerDatosPedidos();
        setPedidos(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    }

    fetchPedidos();
  }, []);

  
  useEffect(() => {
    console.log(inputValue);
    // Verificar si inputValue tiene 9 dígitos
    const barraEnPedidos = pedidos.find(pedido => pedido.Barra === parseInt(inputValue) ); // Verificar si Barra es igual a inputValue y si tiene 9 dígitos
    console.log(Boolean(barraEnPedidos));
  
    const handleVenta = async () => {
      if (Boolean(barraEnPedidos)) {
        // Filtrar todos los elementos que coinciden con el código de barra
        const elementosCoincidentes = pedidos.filter(pedido => pedido.Barra === parseInt(inputValue) );
    
        // Recorrer los elementos coincidentes y procesar cada uno
        for (const elemento of elementosCoincidentes) {
          const ventaData = {
            Estado: elemento.Estado,
            Pedido: elemento.OrdenTxt,
            Cantidad: elemento.Cantidad,
            Comentario: elemento.Comentario,
            Precio: elemento.Precio,
            NumeroOrden: elemento.NumOrden
          };
    
          try {
            // Insertar el elemento en ventas
            const response = await insertarVenta(ventaData);
            console.log('Venta insertada correctamente:', response);
    
            // Eliminar el pedido de la lista de pedidos
            axios.delete('http://192.168.78.98:5150/eliminar-pedidos-barra', {
              data: {
                barra: elemento.Barra
              }
            })
            .then(response => {
              console.log(response.data); // Mensaje de éxito
              // Actualizar los pedidos después de eliminar el pedido
              setPedidos(pedidos.filter(pedido => pedido.Barra !== elemento.Barra));
            })
            .catch(error => {
              console.error('Error al eliminar pedidos:', error); // Manejo de errores
            });
          } catch (error) {
            console.error('Error al insertar la venta:', error);
          }
        }
    
        // Limpiar el valor del input después de procesar los elementos coincidentes
        setInputValue('');
      }
    };
    
    handleVenta();
       
    async function fetchPedidos() {
      try {
        const data = await obtenerDatosPedidos();
        setPedidos(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    }
  
    fetchPedidos();
  
  }, [inputValue]);
  






  useEffect(() => {
    const input = document.getElementById('inputBarra');
    if (input) {
      input.focus();
    }
  }, []); // Enfocar el input cuando se monta el componente

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Función para determinar si un texto contiene alguna de las palabras específicas
  const contienePalabraEspecifica = (texto, palabras) => {
    return palabras.some(palabra => texto.toLowerCase().includes(palabra.toLowerCase()));
  };




  return (
    <div style={{ backgroundColor: "black", color: "yellow" }}>

      <div style={{ display: "flex", textAlign: "center" }}>
        <h2 style={{ marginRight: "20px" }}>Ingrese codigo de barra</h2>
        <input
          id="inputBarra"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ingrese el número de barra"
        /></div>



      <table style={{ width: '100%', border: "solid" }}>
        <thead style={{ border: "solid" }}>
          <tr style={{ border: "solid" }}>
            {/* <th>ID</th> */}
            <th style={{ border: "solid" }}>Orden</th>
            <th style={{ border: "solid" }}>Cantidad</th>
            {/* <th>Llaves</th> */}
            <th style={{ border: "solid" }}>Comentario</th>
            <th style={{ border: "solid" }}>Precio</th>
            {/* <th>Estado</th> */}
            {/* <th>Barra</th> */}
            {/* <th>Cliente</th> */}
            <th style={{ border: "solid" }}>Número de Orden</th>
          </tr>
        </thead>
        <tbody style={{ border: "solid" }}>
          {pedidos.filter(pedido => pedido.Estado === 0 || pedido.Estado === 2).map((pedido, index) => (
            <tr key={index} style={{ backgroundColor: pedido.Estado === 2 ? 'darkblue' : 'transparent' }}>
              {/* <td>{pedido.Id_pedidos}</td> */}
              <td style={{ border: "solid" }}>
                {/* Dividir la orden en fragmentos y aplicar estilos si contiene alguna de las palabras específicas */}
                {pedido.OrdenTxt.split(' ').map((fragmento, i) => (
                  contienePalabraEspecifica(fragmento, ['PapasFritasC', 'PapasFritasG', 'QuesCamFrita', 'Sopaipilla', 'Quesofrita', 'PesFrito']) ?
                    <span key={i} style={{ color: 'red' }}>{fragmento} </span> :
                    <span key={i}>{fragmento} </span>
                ))}
              </td>

              <td style={{ border: "solid" }}>{pedido.Cantidad}</td>
              {/* <td>{pedido.Llaves}</td> */}
              <td style={{ border: "solid" }}>
                {pedido.Comentario.split('\n').map((linea, i) => (
                  <div key={i}>{linea}</div>
                ))}
              </td>
              <td style={{ border: "solid" }}>{pedido.Precio}</td>
              {/* <td>{pedido.Estado}</td> */}
              {/* <td>{pedido.Barra}</td> */}
              {/* <td>{pedido.Cliente}</td> */}
              <td style={{ border: "solid" }}>{pedido.NumOrden}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default Cola;



