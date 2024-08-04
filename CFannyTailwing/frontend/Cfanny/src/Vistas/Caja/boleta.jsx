import React from 'react';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { insertarPedido } from '../Consultas/INSERT/InsertPedido';

const Boleta = ({ ListaMayor, isOpen, onClose, precioTotal, borrar, barra, filter,clearFilter,aumentarCliente}) => {

  // Función que combina onClose y borrar después de insertar pedidos
  const handleCloseAndClear = async () => {
    try {
      // Insertar cada pedido en la base de datos
      await insertarPedidos();

      // Borrar los datos después de la inserción

    } catch (error) {
      console.error('Error al insertar pedidos:', error);
    }
    borrar();

    // Cerrar el modal
    onClose();
  };

  // Función para insertar todos los pedidos en la base de datos
  const insertarPedidos = async () => {
    const insertPromises = ListaMayor.map(pedido => {
      if (filter !== "") {
        pedido.cliente = filter; // Actualiza el valor de cliente con el valor de filter si filter no está vacío
      }
      return insertarPedido(
        pedido.barra,
        pedido.cantidad,
        pedido.cliente,
        pedido.comentario,
        pedido.estado,
        pedido.numeroOrden,
        pedido.precio,
        pedido.precioUnitario,
        pedido.stringSelecteDataId,
        pedido.textoOrden
      );
    });


    // Esperar a que todas las inserciones se completen
    await Promise.all(insertPromises);
    clearFilter();
    aumentarCliente();
  };

  // Función para crear y imprimir el PDF
  const createAndPrintPDF = () => {
    // Crear un nuevo objeto jsPDF
    const doc = new jsPDF({
      format: [80, 200], // Anchura y altura en milímetros
    });

    // Generar el código de barras
    const barcodeValue = barra; // Valor del código de barras
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
    ListaMayor.forEach((pedido) => {
      // Verificar si el número de orden es diferente al pedido anterior
      if (pedido.NumOrden !== previousNumOrden) {
        doc.setFontSize(fontSizeNumOrden); // Establecer el tamaño de fuente para el número de orden
        content += `Número de Orden: ${pedido.NumOrden}\n`;
        previousNumOrden = pedido.NumOrden;
      }

      // Establecer el tamaño de fuente para el resto del contenido
      doc.setFontSize(fontSizeResto);

      content += `Orden: ${pedido.textoOrden}\nCantidad: ${pedido.cantidad}\nComentario: ${pedido.Comentario}\nPrecio: ${pedido.precio}\n`;

      // Sumar el precio al total
      totalPrice += parseFloat(pedido.precio);

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

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} fixed z-10 inset-0 overflow-y-auto`}>
      <div className="flex items-center justify-center min-h-screen px-8">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all" style={{ width: '80%', maxWidth: '1250px' }}>
          <div className="bg-gray-500 px-4 py-2 sm:px-6 sm:flex sm:justify-between">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={onClose}
              style={{ fontSize: "20px" }}
            >
              Cerrar
            </button>

            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => {
                handleCloseAndClear();
                createAndPrintPDF();
              }}
              style={{ fontSize: "20px" }}
            >
              Imprimir
            </button>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <h3 style={{ fontSize: "25px" }} className="text-2xl leading-6 font-medium text-gray-900 mb-4">VOUCHER</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-250 text-2xl">
                <thead>
                  <tr>
                    <th style={{ fontSize: "23px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th style={{ fontSize: "23px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th style={{ fontSize: "23px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-250">
                  {ListaMayor.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "23px", textAlign: "left" }} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.textoOrden}</td>
                      <td style={{ fontSize: "23px", textAlign: "center" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cantidad}</td>
                      <td style={{ fontSize: "23px", textAlign: "left" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.precio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <h4 style={{ fontSize: "30px" }} className="text-2xl leading-6 font-medium text-gray-900">Total: ${precioTotal}</h4><br></br>
              <h4 style={{ fontSize: "30px" }} className="text-2xl leading-6 font-medium text-gray-900">Codigo {barra}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boleta;
