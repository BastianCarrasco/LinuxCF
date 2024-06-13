import React, { useEffect, useState } from 'react';
import Orden_Cantidad_Comentario from './Componentes Caja/Orden_Cantidad_Comentario';
import Botones from './Componentes Caja/Botones';
import ListaCaja from './Componentes Caja/listaCaja';
import {
  resetearValores,
  calcularTotalPrecios,
  cerrarPedido,
  Cantidad,
  cambiarPrecio,
  ArregloPedidos,
  NumOrden,
  cambiarNumOrden,
  resetearArregloPedidos,
  ListaPedido,
  Barra
} from './Componentes Caja/partesOrden';
import { obtenerPrecios, insertarPedido, insertarEncargo } from '../funciones backend/consultas';
import Modal from 'react-modal';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { FaBox,FaArrowUp, FaArrowDown } from 'react-icons/fa';

Modal.setAppElement('#root');



function Caja() {


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEncargoIsOpen, setModalEncargoIsOpen] = useState(false);
  const [precios, setPrecios] = useState([]);
  const [n, setn] = useState(NumOrden);
  const [total, setTotal] = useState(0);
  const [nuevoCliente, setNuevoCliente] = useState('');
  const [cambiarEstado, setcambiarEstado] = useState(0);

  const obtenerFechaActual = () => {
    const fechaActual = new Date();
    return fechaActual.toLocaleDateString(); // Formato de fecha según el idioma del navegador
    // Ejemplo de formato personalizado: fechaActual.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const createAndPrintPDF = (ArregloPedidos, Barra) => {
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
    ArregloPedidos.forEach((pedido, index) => {
      // Verificar si el número de orden es diferente al pedido anterior
      if (pedido.NumOrden !== previousNumOrden) {
        doc.setFontSize(fontSizeNumOrden); // Establecer el tamaño de fuente para el número de orden
        content += `Número de Orden: ${pedido.NumOrden}\n`;
        previousNumOrden = pedido.NumOrden;
      }

      // Establecer el tamaño de fuente para el resto del contenido
      doc.setFontSize(fontSizeResto);

      content += `Orden: ${pedido.TextoOrden}\nCantidad: ${pedido.Cantidad}\nComentario: ${pedido.Comentario}\nPrecio: ${pedido.Precio}\n`;

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

    // Guarda el PDF como una URL de datos
    const pdfData = doc.output('datauristring');

    // Crea un elemento de enlace
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = 'boleta.pdf';

    // Haz clic en el enlace de forma programática para iniciar la descarga
    link.click();
  };









  const handleNuevoClienteChange = (e) => {
    setNuevoCliente(e.target.value);
  };

  const handleResetClick = () => {
    resetearValores();
    resetearArregloPedidos();

  };

  function openModalEncargo() {
    setModalEncargoIsOpen(true);
    setcambiarEstado(1);
    // Actualiza el valor de Estado en el localStorage
  };
  function closeModalEncargo() {
    setModalEncargoIsOpen(false);
    setcambiarEstado(0);
    // Actualiza el valor de Estado en el localStorage
  };

  function openModal() {
    const totalPrecios = calcularTotalPrecios();
    setTotal(totalPrecios);
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  useEffect(() => {
    obtenerPrecios()
      .then(data => {
        // Asignar los datos a la variable de estado precios
        setPrecios(data);
      })
      .catch(error => {
        console.error('Error al obtener precios:', error);
        // Manejar el error según sea necesario
      });
  }, []);

  function buscarPorId(id) {
    return ListaPedido.some(item => item.id === id);
  }
  function buscarPorTipo(tipo) {
    return ListaPedido.some(item => item.tipo === tipo);
  }

  function contarCantidadPorTipo(tipo) {
    return ListaPedido.filter(item => item.tipo === tipo).length;
  }


  function precio() {

    const CantidadAcompanna = contarCantidadPorTipo(2);

    const EnsaladaG = buscarPorId(36);
    const Proteina = buscarPorTipo(1);
    const Guiso = buscarPorTipo(10);
    const Acompanna = buscarPorTipo(2);
    const EnsaladaC = buscarPorId(24);
    const PapaC = buscarPorId(31);
    const Jalea = buscarPorId(42);
    const Flan = buscarPorId(66);
    const Pebre = buscarPorId(74);
    const LargoPedido = ListaPedido.length;
    let resultado = 0;


    // Proteína + acompañamiento + ensalada chica + pan
    if (EnsaladaC && Acompanna && Proteina && LargoPedido === 3) {
      resultado = Cantidad * precios[0].valor;
      cambiarPrecio(resultado);
    }
    // Proteína + ensalada grande + pan
    if (EnsaladaG && Proteina && LargoPedido === 2) {
      resultado = Cantidad * precios[0].valor;
      cambiarPrecio(resultado);
    }
    //Proteína + acompañamiento + postre (jalea o flan) + pan
    // Proteína + acompañamiento + pebre + pan
    if (Proteina && Acompanna && (Flan || Pebre || Jalea) && LargoPedido === 3) {
      resultado = Cantidad * precios[0].valor;
      cambiarPrecio(resultado);
    }

    // Proteína + 2 acompañamientos + postre (jalea o flan) + pan
    //     Proteína + 2 acompañamientos + pebre + pan

    if (Proteina && CantidadAcompanna === 2 && (Flan || Pebre || Jalea) && LargoPedido === 4) {
      resultado = Cantidad * precios[0].valor;
      cambiarPrecio(resultado);
    }
    // Proteína + 2 acompañamientos + ensalada chica + pan
    if (Proteina && CantidadAcompanna === 2 && EnsaladaC && LargoPedido === 4) {
      resultado = Cantidad * precios[0].valor;
      cambiarPrecio(resultado);
    }

    // Guisado + postre (jalea o flan) + pan
    //     Guisado + pebre + pan

    if (Guiso && (Flan || Pebre || Jalea) && LargoPedido === 2) {
      resultado = Cantidad * precios[0].valor;
      cambiarPrecio(resultado);
    }

    // Proteína + papa frita chica + ensalada chica + pan

    if (Proteina && EnsaladaC && PapaC && LargoPedido === 3) {
      resultado = Cantidad * precios[1].valor;
      cambiarPrecio(resultado);
    }
    // Proteína + acompañamiento + papa frita + ensalada chica + pan
    if (Proteina && EnsaladaC && PapaC && Acompanna && LargoPedido === 4) {
      resultado = Cantidad * precios[1].valor;
      cambiarPrecio(resultado);
    }

    // Proteína + papa frita chica + postre (jalea o flan) + pan
    // Proteína + papa frita chica +pebre + pan
    if (Proteina && PapaC && (Flan || Pebre || Jalea) && LargoPedido === 3) {
      resultado = Cantidad * precios[1].valor;
      cambiarPrecio(resultado);
    }
    // Proteína + acompañamiento + papa frita chica +postre (jalea o flan) + pan

    if (Proteina && PapaC && (Flan || Pebre || Jalea) && Acompanna && LargoPedido === 4) {
      resultado = Cantidad * precios[1].valor;
      cambiarPrecio(resultado);
    }
    // Guiso solo / proteína + acompañamiento = $3,500
    if ((Guiso && LargoPedido === 1) || (Proteina && Acompanna && LargoPedido === 2)) {
      resultado = Cantidad * precios[2].valor;
      cambiarPrecio(resultado);
    }

    // INDIVIDUALES

    if (LargoPedido === 1) {
      const dato = ListaPedido[0];
      const precioUnitario = dato.precio;
      resultado = Cantidad * precioUnitario;
      cambiarPrecio(resultado);
    }
    cerrarPedido();
  }

  function insertarPedidoHandler() {
    // Recorrer cada elemento de ArregloPedidos

    if (cambiarEstado === 0) {
      for (let i = 0; i < ArregloPedidos.length; i++) {
        const pedido = ArregloPedidos[i];
        // Insertar el pedido actual
        insertarPedido(pedido)
          .then(data => {
            console.log('Pedido insertado correctamente:', data);
            // Lógica adicional después de insertar el pedido si es necesario
          })
          .catch(error => {
            console.error('Error al insertar el pedido:', error);
            // Manejar el error según sea necesario
          });
      }

      createAndPrintPDF(ArregloPedidos, Barra);

    } else {
      for (let i = 0; i < ArregloPedidos.length; i++) {
        const pedido = ArregloPedidos[i];
        // Insertar el pedido actual
        insertarEncargo(pedido, nuevoCliente)
          .then(data => {
            console.log('Pedido insertado correctamente:', data);
            // Lógica adicional después de insertar el pedido si es necesario
          })
          .catch(error => {
            console.error('Error al insertar el pedido:', error);
            // Manejar el error según sea necesario
          });
      }


    }



    // Incrementar el número de orden en 1

    // Obtener el nuevo valor de NumOrden y sumarle 1
    const nuevoNumOrden = NumOrden + 1;
    // Actualizar el valor de NumOrden en el almacenamiento local
    localStorage.setItem('NumOrden', nuevoNumOrden.toString());
    // Actualizar el estado 'n' con el nuevo valor de NumOrden
    setn(nuevoNumOrden);
    // Resetear el arreglo de pedidos
    cambiarNumOrden(nuevoNumOrden);
    resetearArregloPedidos();
  }


  return (
    <div style={{ backgroundColor: "black", color: "yellow" }}>
      <div className="container_Caja">
        <div className="column_Caja" style={{ borderRight: "solid" }}>
          <Orden_Cantidad_Comentario />
          <Botones />
        </div>
        <div className="column_Caja">
          NUMERO DE ORDEN: {n}
          <ListaCaja />
        </div>
      </div>
    
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between',backgroundColor: "black" }}>
        <div >
          <button style={{ marginLeft: "10px", marginTop: "5px", backgroundColor: "cyan",  border: "solid", borderColor: "white" }} onClick={precio}> <FaArrowDown style={{ marginRight: "5px" }} />Crear Orden</button>
          <button style={{ marginLeft: "10px" , border: "solid", borderColor: "white" , backgroundColor: "darkcyan" }} onClick={openModal}>   <FaArrowUp style={{ marginRight: "5px" }} />Crear Pedido</button>
          <button style={{ marginLeft: "10px", border: "solid", backgroundColor: "orange", borderColor:"white"  }} onClick={openModalEncargo}>
        <FaBox style={{ marginRight: "5px" }} />
        Crear Encargo
      </button>

        </div>
        <button className='cancelar' style={{ scale: '80%', fontSize: '18px' }} onClick={handleResetClick}>CANCELAR PEDIDO</button>
      </div>

    <div style={{ backgroundColor: "gray", color: "white", padding: "90px", textAlign: "center", marginTop:"45px" }}>
        Este es el footer de la página.
      </div>



      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ejemplo Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Fondo semitransparente negro para el modal
          },
          content: {
            backgroundColor: 'black', // Fondo negro para el contenido del modal
            color: 'white', // Texto blanco para el contenido del modal
            width: '50%', // Ancho del modal (puedes ajustar según tus necesidades)
            margin: 'auto', // Centrar el modal horizontalmente en la pantalla
            border:"solid"
          }
        }}
      >
        
        <div style={{textAlign:"center"}} className="modal-headerV">
          <h2>Voucher</h2>
        </div>

        <div style={{ textAlign: 'right', padding: '10px', fontSize:"20px" }}>
          <p>{obtenerFechaActual()}</p>
        </div>
        <div className="modal-bodyV">
          <ListaCaja />
        </div>
        <div style={{marginTop:"20px", textAlign:"center"}} className="modal-footerV">
        <button style={{marginRight:"200px"}} onClick={closeModal}>Volver</button>
          <button  onClick={insertarPedidoHandler}>Generar Voucher</button>
         
        </div>
      </Modal>

      <Modal
        isOpen={modalEncargoIsOpen}
        onRequestClose={closeModalEncargo}
        contentLabel="Ejemplo Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Fondo semitransparente negro para el modal
          },
          content: {
            backgroundColor: 'black', // Fondo negro para el contenido del modal
            color: 'white', // Texto blanco para el contenido del modal
            width: '50%', // Ancho del modal (puedes ajustar según tus necesidades)
            margin: 'auto', // Centrar el modal horizontalmente en la pantalla
            border:"solid"
          }
        }}
      >
        <div style={{textAlign:"center"}} className="modal-headerV">
          <h2>Encargo</h2>
        </div>
        <input
          type="text"
          value={nuevoCliente}
          onChange={handleNuevoClienteChange}
          placeholder="Ingrese nombre de cliente"
        />
        <div className="modal-bodyV">
          <ListaCaja />
        </div>
        <div style={{marginTop:"20px", textAlign:"center"}} className="modal-footerV">
          <button style={{marginRight:"200px"}} onClick={closeModalEncargo}>Volver</button>
          <button onClick={insertarPedidoHandler}>Generar Voucher</button>
   
        </div>
      </Modal>


    </div>
  );
}

export default Caja;
