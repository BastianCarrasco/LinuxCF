// archivo: servicios/menuService.js

import axios from 'axios';
import { link } from '../servidor';

// Función para enviar la solicitud DELETE
export const eliminarPedido = async (barra) => {
  try {
    const response = await axios.delete(`http://${link}:5150/quitar-pedido`, {
      data: { barra } // Envía el nombre como parte del cuerpo de la solicitud
    });
    console.log('Respuesta del servidor:', response.data);
    return response.data; // Retorna los datos de respuesta del servidor si es necesario
  } catch (error) {
    console.error('Error al eliminar datos:', error);
    throw error; // Manejo de errores o propagación hacia arriba si es necesario
  }
};
