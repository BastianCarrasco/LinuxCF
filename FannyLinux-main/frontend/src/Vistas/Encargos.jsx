import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { obtenerDatosPedidos } from '../funciones backend/consultas';
import { FaUndoAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import { actualizarEstado } from '../funciones backend/consultas';


import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
Modal.setAppElement('#root');

function Encargos() {
  const [pedidos, setPedidos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [numeroOrdenSeleccionado, setNumeroOrdenSeleccionado] = useState(null);
  const [pedidosConNumeroOrden, setPedidosConNumeroOrden] = useState([]);
  const [numerosOrdenMostrados, setNumerosOrdenMostrados] = useState([]);
  const [rowSpanCount, setRowSpanCount] = useState(1); // Contador de filas fusionadas


  useEffect(() => {
    async function fetchPedidos() {
      try {
        const data = await obtenerDatosPedidos();
        setPedidos(data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
      }
    }
    const intervalId = setInterval(fetchPedidos, 1000);

    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleGuardarPedidosPorNumeroOrden = (numeroOrden) => {
    const pedidosFiltrados = pedidos.filter(pedido => pedido.NumOrden === numeroOrden);
    setPedidosConNumeroOrden(pedidosFiltrados);
  };

  const handleButtonOnClick = (numeroOrden) => {
    setNumeroOrdenSeleccionado(numeroOrden);
    handleGuardarPedidosPorNumeroOrden(numeroOrden);
    openModal();
    setNumerosOrdenMostrados(prevState => [...prevState, numeroOrden]);
    setRowSpanCount(1); // Reiniciar el contador de filas fusionadas
  };

  const createAndPrintPDF = (pedidosConNumeroOrden, Barra) => {
    // Crear un nuevo objeto jsPDF
    const doc = new jsPDF({
      format: [80, 200], // Anchura y altura en milímetros
    });

    // Generar el código de barras
    const barcodeValue = Barra; // Valor del código de barras
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barcodeValue, { format: 'CODE128' });
    const barcodeImageUrl = canvas.toDataURL('image/png');

    // Cargar la imagen del código de barras en el PDF
    doc.addImage(barcodeImageUrl, 'PNG', 10, 10, 60, 20); // Ajustar el tamaño del código de barras para que quepa en 80mm

    // Definir el tamaño de fuente para el número de orden
    const fontSizeNumOrden = 16;
    doc.setFontSize(fontSizeNumOrden);

    // Definir el tamaño de fuente para el resto del contenido
    const fontSizeResto = 9;
    doc.setFontSize(fontSizeResto);

    // Definir el contenido del PDF
    let content = 'Datos de los pedidos:\n\n';
    let previousNumOrden = null;
    let totalPrice = 0;

    // Agregar cada elemento del arreglo al contenido del PDF
    pedidosConNumeroOrden.forEach((pedido, index) => {
        // Verificar si el número de orden es diferente al pedido anterior
        if (pedido.NumOrden !== previousNumOrden) {
            doc.setFontSize(fontSizeNumOrden); // Establecer el tamaño de fuente para el número de orden
            content += `Número de Orden: ${pedido.NumOrden}\n`;
            previousNumOrden = pedido.NumOrden;
        }

        // Establecer el tamaño de fuente para el resto del contenido
        doc.setFontSize(fontSizeResto);

        content += `Orden: ${pedido.OrdenTxt}\nCantidad: ${pedido.Cantidad}\nComentario: ${pedido.Comentario}\nPrecio: ${pedido.Precio}\n`;
        
        // Sumar el precio al total
        totalPrice += parseFloat(pedido.Precio);
     
        content += '\n'; // Agregar una línea en blanco entre cada pedido
    });

    // Agregar el total al contenido del PDF
    content += `TOTAL: ${totalPrice.toFixed(2)}\n`;

    // Dividir el contenido en líneas que quepan en 80mm de ancho
    const lines = doc.splitTextToSize(content, 80);

    // Agregar las líneas al PDF
    doc.text(lines, 10, 40);

    // Guardar el archivo PDF
    doc.save('boleta.pdf');

    // Imprimir el archivo PDF después de guardarlo
    doc.autoPrint();
};

function crearboleta (){
  actualizarEstado(pedidosConNumeroOrden[0].Barra);
  createAndPrintPDF(pedidosConNumeroOrden,pedidosConNumeroOrden[0].Barra);

  async function fetchPedidos() {
    try {
      const data = await obtenerDatosPedidos();
      setPedidos(data);
    } catch (error) {
      console.error('Error al obtener los pedidos:', error);
    }
  }

  fetchPedidos();

};



  return (
    <div>

      <table style={{ width: '100%', border:'solid' }}>
        <thead style={{border:'solid'}} >
          <tr style={{border:'solid'}} >
            {/* <th>ID</th> */}
            <th style={{border:'solid'}} >Orden</th>
            <th style={{border:'solid'}} >Cantidad</th>
            {/* <th>Llaves</th> */}
            <th style={{border:'solid'}} >Comentario</th>
            <th style={{border:'solid'}} >Precio</th>
            {/* <th>Estado</th> */}
            {/* <th>Barra</th> */}
            <th style={{border:'solid'}} >Nombre Cliente</th>
            <th style={{border:'solid'}} >Número de Orden</th>
          </tr>
        </thead>
        <tbody>
          {pedidos
            .filter(pedido => pedido.Estado === 1)
            .map((pedido, index, array) => {
              const isFirstRowOfGroup = array.findIndex(p => p.NumOrden === pedido.NumOrden) === index;
              return (
                <tr style={{border:'solid'}}  key={index}>
                  {/* <td>{pedido.Id_pedidos}</td> */}
                  <td style={{border:'solid'}} >{pedido.OrdenTxt}</td>
                  <td style={{border:'solid'}} >{pedido.Cantidad}</td>
                  {/* <td>{pedido.Llaves}</td> */}
                  <td style={{border:'solid'}} >
                    {pedido.Comentario.split('\n').map((linea, i) => (
                      <div key={i}>{linea}</div>
                    ))}
                  </td>
                  <td style={{border:'solid'}}>{pedido.Precio}</td>
                  {/* <td>{pedido.Estado}</td> */}
                  {/* <td>{pedido.Barra}</td> */}
                  <td style={{border:'solid'}}>{pedido.Cliente}</td>
                  {isFirstRowOfGroup && (
                    <td rowSpan={rowSpanCount}>{pedido.NumOrden}</td>
                  )}
                  <td style={{border:'solid'}}>
                    {isFirstRowOfGroup && (
                      <button style={{scale:'90%', backgroundColor:'green', color:'white'}} onClick={() => handleButtonOnClick(pedido.NumOrden)}>Crear Boleta</button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>


      

      <Modal  isOpen={modalIsOpen} onRequestClose={closeModal} style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Fondo semitransparente negro para el modal
          },
          content: {
            backgroundColor: 'black', // Fondo negro para el contenido del modal
            color: 'yellow', // Texto blanco para el contenido del modal
            width: '80%', // Ancho del modal (puedes ajustar según tus necesidades)
            margin: 'auto', // Centrar el modal horizontalmente en la pantalla
            border:"solid"
          }
        }}>
        <div >
          <h2>Pedidos con Número de Orden: {numeroOrdenSeleccionado}</h2>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Orden</th>
                <th>Cantidad</th>
                <th>Llaves</th>
                <th>Comentario</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Barra</th>
                <th>Cliente</th>
                <th>Número de Orden</th>
              </tr>
            </thead>
            <tbody>
              {pedidosConNumeroOrden.map((pedido, index) => (
                <tr key={index}>
                  <td>{pedido.Id_pedidos}</td>
                  <td>{pedido.OrdenTxt}</td>
                  <td>{pedido.Cantidad}</td>
                  <td>{pedido.Llaves}</td>
                  <td>
                    {pedido.Comentario.split('\n').map((linea, i) => (
                      <div key={i}>{linea}</div>
                    ))}
                  </td>
                  <td>{pedido.Precio}</td>
                  <td>{pedido.Estado}</td>
                  <td>{pedido.Barra}</td>
                  <td>{pedido.Cliente}</td>
                  <td>{pedido.NumOrden}</td>
                </tr>
              ))}
            </tbody>
          </table>

          
          <button onClick={closeModal}>Cerrar</button>
          <button onClick={crearboleta}>Boleta</button>
        </div>
      </Modal>
    </div>
  );
}

export default Encargos;






