import React, { useEffect, useState } from 'react';
import 'jspdf-autotable';
import { insertarPedido } from '../Consultas/INSERT/InsertPedido';
import { createAndPrintPDF } from './constructorBoleta';
import { reducirStock } from '../Consultas/UPDATE/Reducir-stockSemana';
import { obtenerDatosmenuNoEnSemana } from '../Consultas/GET/get_menuNoSemana';
import { reducirStockG } from '../Consultas/UPDATE/ReducirSockG';

const Boleta = ({ 
  ListaMayor, 
  isOpen, 
  onClose, 
  precioTotal, 
  borrar, 
  barra, 
  filter, 
  clearCliente, 
  aumentarCliente, 
  nombre, 
  funcionboleta,
  dayname 
}) => {


  const [barraunico, setbarraunico] = useState(0);
  const [filtroMenu, setFiltroMenu] = useState([]);

  

  const manejarDatosMenu = async () => {
   try {
     const datosMenu = await obtenerDatosmenuNoEnSemana();
     setFiltroMenu(datosMenu); // Actualiza el estado con los datos obtenidos
   } catch (error) {
     console.error('Error al manejar los datos del menú:', error);
   }
 };

  const getCurrentDateInLatinoFormat = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(()=>{setFiltroMenu(manejarDatosMenu()),console.log(filtroMenu)},[])

  useEffect(() => {
    setbarraunico(funcionboleta());
  }, [funcionboleta]);

  // Función que combina onClose y borrar después de insertar pedidos
  const handleCloseAndClear = async () => {
    try {
      // Insertar cada pedido en la base de datos
      await insertarPedidos();
      borrar();
    } catch (error) {
      console.error('Error al insertar pedidos:', error);
    } finally {
      // Cerrar el modal
      onClose();
    }
  };

  const insertarPedidos = async () => {
    // Primero, actualiza todos los objetos en ListaMayor para que tengan el valor de barraunico
    const updatedListaMayor = ListaMayor.map(pedido => ({
      ...pedido,
      barra: barraunico,
    }));

    // Ahora, usa la lista actualizada para insertar los pedidos en la base de datos
    const insertPromises = updatedListaMayor.map(pedido => {
      if (filter !== "") {
        pedido.cliente = filter;
      }
      const estado = pedido.cliente !== null ? 3 : pedido.estado;

      return insertarPedido(
        pedido.barra,
        pedido.cantidad,
        pedido.cliente,
        pedido.comentario || '',
        estado,
        pedido.numeroOrden,
        pedido.precio,
        pedido.precioUnitario,
        pedido.stringSelecteDataId,
        pedido.textoOrden
      );
    });

    // Esperar a que todas las inserciones se completen
    await Promise.all(insertPromises);
   
    aumentarCliente();
  };

  const guardarImprimir = async (nombre) => {

    const ArraydayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

    const index = ArraydayNames.indexOf(dayname);
    ListaMayor.forEach(element => {

      const stringToCheck = element.stringSelecteDataId;
      const lengthOfString = stringToCheck.length;
      if(lengthOfString===1){
        console.log(lengthOfString)

        if (filtroMenu.some(item => item.id === parseInt(element.stringSelecteDataId,10)) ===false ){
        
          reducir(parseInt(element.stringSelecteDataId,10), index, element.cantidad); // Llama a reducir con id_menu como entero
        }else{
          reducirG(parseInt(element.stringSelecteDataId,10),element.cantidad); // Llama a reducir con id_menu como entero
        }
      }

    else if (element.stringSelecteDataId && typeof element.stringSelecteDataId === 'string' && lengthOfString>1 ) {
        const idMenus = element.stringSelecteDataId.split('-'); // Divide el string en partes
        idMenus.forEach(id_menu => {
          const idMenuInt = parseInt(id_menu, 10); // Convierte id_menu a entero

          if (filtroMenu.some(item => item.id === idMenuInt) ===false){
            reducir(idMenuInt, index, element.cantidad); // Llama a reducir con id_menu como entero
          }else{
            reducirG(idMenuInt,element.cantidad); // Llama a reducir con id_menu como entero
          }
          //console.log(idMenuInt)
        });
      } else {
        console.log('stringSelecteDataId is not a string:', element.stringSelecteDataId);
      }
    });
  
    if (nombre === null) {
      // Aseguramos que las funciones se completen antes de redirigir
      await handleCloseAndClear();
      await createAndPrintPDF(ListaMayor, barraunico, precioTotal);
      await clearCliente();
     
    } else {
      await handleCloseAndClear();
      await clearCliente();
    }

     window.location.reload();
  };
  

  const reducir = async (id_menu, id_dia, cantidad) => {
    try {
      
      const resultado = await reducirStock(id_menu, id_dia, cantidad);
      console.log('Resultado:', resultado);
    } catch (error) {
      console.error('Error al llamar a reducirStock:', error);
    }
  };
  const reducirG = async (id, cantidad) => {
    try {
      
      const resultado = await reducirStockG(id, cantidad);
      console.log('Resultado:', resultado);
    } catch (error) {
      console.error('Error al llamar a reducirStockG:', error);
    }
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
              onClick={() => guardarImprimir(nombre)}
              style={{ fontSize: "20px" }}
            >
              Imprimir
            </button>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {/* Renderiza los elementos de ListaMayor */}
            <div>
              {ListaMayor.map((element, index) => (
                <span key={index}> {element.stringSelecteDataId}</span>
              ))}
            </div>

            {/* Renderiza información del voucher */}
            {ListaMayor.length > 0 && ListaMayor[0].numeroOrden ? (
              <h3 className="text-2xl leading-6 font-medium text-gray-900 mb-4 flex justify-between">
                <span style={{ fontSize: "25px" }}>Numero de Orden: {ListaMayor[0].numeroOrden}</span>
                <span style={{ fontSize: "25px" }}>VOUCHER</span>
                <span style={{ fontSize: "25px" }}>{getCurrentDateInLatinoFormat()}</span>
              </h3>
            ) : null}

            {/* Renderiza la tabla */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-250 text-2xl">
                <thead>
                  <tr>
                    <th style={{ fontSize: "23px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th style={{ fontSize: "23px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th style={{ fontSize: "23px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th style={{ fontSize: "23px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentario</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: 'left' }} className="bg-white divide-y divide-gray-250">
                  {ListaMayor.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontSize: "23px", textAlign: "left" }} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.textoOrden}</td>
                      <td style={{ fontSize: "23px", textAlign: "center" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cantidad}</td>
                      <td style={{ fontSize: "23px", textAlign: "left" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${Math.round(item.precio)}</td>
                      <td style={{ fontSize: "23px", textAlign: "left" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.comentario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Información adicional */}
            <div className="flex justify-between">
              <h4 style={{ fontSize: "30px" }} className="text-2xl leading-6 font-medium text-gray-900">Codigo {barraunico}</h4>
              <h4 style={{ fontSize: "30px" }} className="text-2xl leading-6 font-medium text-gray-900">Total: ${Math.round(precioTotal)}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boleta;
