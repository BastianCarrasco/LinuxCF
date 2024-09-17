import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import LOGO from '../Caja/LOGO.png';

/**
 * Función para crear y imprimir el PDF
 * @param {Array} listaMayor - Array de objetos con los detalles de los pedidos
 * @param {string} barra - Valor del código de barras
 */

/**
 * Devuelve la fecha actual en formato latinoamericano (DD/MM/YYYY).
 * @returns {string} - Fecha actual formateada en formato DD/MM/YYYY.
 */
export const getCurrentDateInLatinoFormat = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
  const year = now.getFullYear();

  return `${day}/${month}/${year}`;
};

export const createAndPrintPDF = (listaMayor, barra) => {
  const doc = new jsPDF({
    format: [80, 200],
  });

  // Añadir título o logo opcional en la parte superior
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Colaciones Fanny     ${getCurrentDateInLatinoFormat()}`, 5, 10); // Ajuste a la izquierda
  doc.setFontSize(8);
  doc.text('Gracias por su compra!', 5, 15);

  // Generar el código de barras
  const barcodeValue = barra;
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, barcodeValue, { format: 'CODE128' });
  const barcodeImageUrl = canvas.toDataURL('image/png');

  // Añadir imagen del código de barras
  doc.addImage(barcodeImageUrl, 'PNG', 5, 20, 60, 20);

  // Añadir el número de orden solo una vez
  let yPosition = 50; // Posición inicial después del código de barras
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Número de Orden: ${listaMayor[0].numeroOrden}`, 5, yPosition);
  yPosition += 10;

  // Añadir los encabezados de las columnas
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Orden', 5, yPosition);
  doc.text('#', 50, yPosition);
  doc.text('Precio', 65, yPosition);
  yPosition += 6;

  let totalPrice = 0;

  // Añadir detalles del pedido en formato de tabla
  listaMayor.forEach((pedido, index) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    let textoOrden = pedido.textoOrden;
    let lineasOrden = doc.splitTextToSize(textoOrden, 40); // Máximo de 40 unidades de ancho

    // Añadir la primera línea de la orden
    doc.text(lineasOrden[0], 5, yPosition); // Columna Orden

    // Si hay más líneas, añadirlas
    if (lineasOrden.length > 1) {
      lineasOrden.slice(1).forEach((linea) => {
        yPosition += 5;
        doc.text(linea, 5, yPosition);
      });
    }

    // Añadir las otras columnas
    doc.text(`${pedido.cantidad}`, 50, yPosition); // Columna #
    doc.text(`$${pedido.precio}`, 65, yPosition); // Columna Precio
    doc.text(`(${index + 1})`, 75, yPosition); // Añadir índice + 1 para empezar desde 1

    yPosition += 5; // Espacio después de cada fila
    totalPrice += parseFloat(pedido.precio);
  });


  // Añadir el precio total
  yPosition += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`TOTAL: $${totalPrice.toFixed(0)}`, 5, yPosition);
  yPosition += 5;

  // Añadir comentarios al final
doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
yPosition += 5;
doc.text('Comentarios:', 5, yPosition);
yPosition += 5;

listaMayor.forEach((pedido, index) => {
  // Asegurarse que el comentario sea diferente de 'null' y no esté vacío ('')
  if(pedido.comentario !== null && pedido.comentario.trim() !== "") {
    // Agregar el índice del pedido al comentario
    doc.text(`- (${index + 1}) ${pedido.comentario}`, 5, yPosition);
    yPosition += 5; // Incrementar la posición Y después de añadir texto
  }
});



  // Añadir mensaje de agradecimiento
  yPosition += 5;
  doc.text('¡Gracias por su preferencia!', 5, yPosition);
  yPosition += 5;

  // Añadir la imagen al final de la boleta
  doc.addImage(LOGO, 'PNG', 5, yPosition, 60, 20);
  yPosition += 40;

  // Guardar e imprimir el PDF
  const pdfData = doc.output('datauristring');
  const link = document.createElement('a');
  link.href = pdfData;
  link.download = 'boleta.pdf';
  link.click();
};
