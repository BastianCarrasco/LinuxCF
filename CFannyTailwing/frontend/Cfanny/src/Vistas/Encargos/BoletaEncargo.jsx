import React from 'react';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LOGO from '../Caja/LOGO.png';

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

  // Añadir título o logo
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Colaciones Fanny     ${getCurrentDateInLatinoFormat()}`, 5, 10);
  doc.setFontSize(8);
  doc.text('Gracias por su compra!', 5, 15);

  // Generar el código de barras
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, barra, { format: 'CODE128' });
  const barcodeImageUrl = canvas.toDataURL('image/png');

  // Añadir imagen del código de barras
  doc.addImage(barcodeImageUrl, 'PNG', 5, 20, 60, 20);

  // Añadir número de orden
  let yPosition = 50;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Número de Orden: ${ListaMayor[0].numeroOrden}`, 5, yPosition);
  yPosition += 10;

  doc.setFontSize(15);
  doc.setFont('helvetica', 'normal');
  doc.text(`Cliente: ${ListaMayor[0].cliente}`, 5, yPosition);  // Añadir el nombre del cliente
  yPosition += 5;

  // Añadir los encabezados de las columnas
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Orden', 5, yPosition);
  doc.text('#', 50, yPosition);
  doc.text('Precio', 65, yPosition);
  yPosition += 6;

  let totalPrice = 0;

  // Añadir detalles del pedido en formato tabla
  ListaMayor.forEach((pedido, index) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    let lineasOrden = doc.splitTextToSize(pedido.textoOrden, 40);
    doc.text(lineasOrden[0], 5, yPosition); // Primera línea del texto de la orden

    // Añadir más líneas si el texto es largo
    if (lineasOrden.length > 1) {
      lineasOrden.slice(1).forEach((linea) => {
        yPosition += 5;
        doc.text(linea, 5, yPosition);
      });
    }

    // Añadir cantidad y precio
    doc.text(`${pedido.cantidad}`, 50, yPosition);
    doc.text(`$${Math.round(pedido.precio)}`, 65, yPosition); // Cambia a Math.round para quitar los decimales
    doc.text(`(${index + 1})`, 75, yPosition); // Índice de la orden

    yPosition += 5;
    totalPrice += parseFloat(pedido.precio);
  });

  // Añadir el precio total
  yPosition += 5;
  // Añadir el precio total
  yPosition += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`TOTAL: $${Math.round(totalPrice)}`, 5, yPosition); // Cambia a Math.round para quitar los decimales

  yPosition += 5;

  // Añadir comentarios
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  yPosition += 5;
  doc.text('Comentarios:', 5, yPosition);
  yPosition += 5;

  ListaMayor.forEach((pedido, index) => {
    if (pedido.comentario && pedido.comentario.trim() !== "") {
      doc.text(`- (${index + 1}) ${pedido.comentario}`, 5, yPosition);
      yPosition += 5;
    }
  });

  // Añadir mensaje de agradecimiento
  yPosition += 5;
  doc.text('¡Gracias por su preferencia!', 5, yPosition);
  yPosition += 5;

  // Añadir logo al final
  doc.addImage(LOGO, 'PNG', 5, yPosition, 60, 20);
  yPosition += 40;

  // Guardar e imprimir el PDF
  const pdfData = doc.output('datauristring');
  const link = document.createElement('a');
  link.href = pdfData;
  link.download = 'boleta.pdf';
  link.click();
};
