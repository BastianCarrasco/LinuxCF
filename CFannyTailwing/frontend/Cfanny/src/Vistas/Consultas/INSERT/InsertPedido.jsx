import axios from 'axios';
import { link } from '../servidor';

// Función para insertar un pedido
export const insertarPedido = async (barra, cantidad, cliente, comentario, estado, numeroOrden, precio, precioUnitario, stringSelecteDataId, textoOrden) => {
  try {
    const response = await axios.post(`http://${link}:5150/Subirpedidos`, {
      barra: barra,
      cantidad: cantidad,
      cliente: cliente,
      comentario: comentario,
      estado: estado,
      numeroOrden: numeroOrden,
      precio: precio,
      precioUnitario: precioUnitario,
      stringSelecteDataId: stringSelecteDataId,
      textoOrden: textoOrden
    });
    return response.data; // Retorna los datos de respuesta del servidor si es necesario
  } catch (error) {
    console.error('Error al insertar datos:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
