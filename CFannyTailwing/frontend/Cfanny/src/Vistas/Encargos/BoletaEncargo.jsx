import React from 'react';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Boleta = {
  createAndPrintPDF: (ListaMayor, barra) => {
    const doc = new jsPDF({
      format: [80, 200],
    });

    const barcodeValue = barra;
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barcodeValue, { format: 'CODE128' });
    const barcodeImageUrl = canvas.toDataURL('image/png');

    doc.addImage(barcodeImageUrl, 'PNG', 10, 10, 60, 20);

    const fontSizeNumOrden = 16;
    doc.setFontSize(fontSizeNumOrden);

    const fontSizeResto = 9;
    doc.setFontSize(fontSizeResto);

    let content = 'Datos de los pedidos:\n\n';
    let previousNumOrden = null;
    let totalPrice = 0;

    ListaMayor.forEach((pedido) => {
      if (pedido.NumOrden !== previousNumOrden) {
        doc.setFontSize(fontSizeNumOrden);
        content += `Número de Orden: ${pedido.NumOrden}\n`;
        previousNumOrden = pedido.NumOrden;
      }

      doc.setFontSize(fontSizeResto);

      content += `Orden: ${pedido.textoOrden}\nCantidad: ${pedido.cantidad}\nComentario: ${pedido.Comentario}\nPrecio: ${pedido.precio}\n`;

      totalPrice += parseFloat(pedido.precio);

      content += '\n';
    });

    content += `TOTAL: ${totalPrice.toFixed(2)}\n`;

    const lines = doc.splitTextToSize(content, 80);

    doc.text(lines, 10, 40);

    const pdfData = doc.output('datauristring');

    const link = document.createElement('a');
    link.href = pdfData;
    link.download = 'boleta.pdf';

    link.click();
  }
};

export default Boleta;
