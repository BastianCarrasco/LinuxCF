import React from 'react';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


/**
 * Devuelve la fecha actual en formato latinoamericano (DD/MM/YYYY).
 * @returns {string} - Fecha actual formateada en formato DD/MM/YYYY.
 */
export const getCurrentDateInLatinoFormat = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Función para crear y imprimir el PDF
 * @param {Array} ListaMayor - Array de objetos con los detalles de los pedidos
 * @param {string} barra - Valor del código de barras
 */
export const createAndPrintPDF = (ListaMayor, barra) => {
  const doc = new jsPDF({
    format: [80, 200],
  });

  // Añadir título y fecha
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Colaciones Fanny     ${getCurrentDateInLatinoFormat()}`, 10, 10);
  doc.setFontSize(8);
  doc.text('Gracias por su compra!', 10, 15);

  // Generar el código de barras
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, barra, { format: 'CODE128' });
  const barcodeImageUrl = canvas.toDataURL('image/png');

  // Añadir imagen del código de barras
  doc.addImage(barcodeImageUrl, 'PNG', 10, 20, 60, 20);

  // Añadir detalles del pedido
  let yPosition = 50;
  doc.setFontSize(12);
  doc.text('Datos de los pedidos:', 10, yPosition);
  yPosition += 6;

  let previousNumOrden = null;
  let totalPrice = 0;

  ListaMayor.forEach((pedido) => {
    if (pedido.numeroOrden !== previousNumOrden) {
      doc.setFont('helvetica', 'bold');
      doc.text(`Número de Orden: ${pedido.numeroOrden}`, 10, yPosition);
      previousNumOrden = pedido.numOrden;
      yPosition += 6;
      doc.text(`CLIENTE: ${pedido.cliente}`, 10, yPosition);
      yPosition += 6;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Orden: `, 10, yPosition);
    yPosition += 5;
    doc.text(`${pedido.textoOrden}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Cantidad: ${pedido.cantidad}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Comentario: `, 10, yPosition);
    yPosition += 5;
    doc.text(`${pedido.comentario || 'N/A'}`, 10, yPosition);
    yPosition += 5;
    doc.text(`Precio: $${Math.round(pedido.precio)}`, 10, yPosition);
    yPosition += 8;

    totalPrice += parseFloat(pedido.precio);
  });

  // Añadir el precio total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`TOTAL: $${totalPrice.toFixed(0)}`, 10, yPosition);
  yPosition += 10;

  // Footer opcional
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('¡Gracias por su preferencia!', 10, yPosition);

  // Guardar e imprimir el PDF
  const pdfData = doc.output('datauristring');
  const link = document.createElement('a');
  link.href = pdfData;
  link.download = 'boleta.pdf';
  link.click();
};
