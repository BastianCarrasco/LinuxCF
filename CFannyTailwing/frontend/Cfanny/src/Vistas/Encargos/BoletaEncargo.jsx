import React from 'react';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Boleta = ({ ListaMayor, isOpen, onClose, precioTotal, borrar, barra, filter, clearFilter, aumentarCliente }) => {

  const handleCloseAndClear = async () => {

    borrar();
    onClose();
  };



  const createAndPrintPDF = () => {
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
                aumentarCliente(barra);

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
