// archivo: servicios/menuService.js

import axios from 'axios';
import { link } from '../servidor';

// Función para enviar la solicitud DELETE a /borrar_ventas
export const borrarVentas = async () => {
  try {
    const response = await axios.delete(`http://${link}:5150/borrar_ventas`);
    console.log('Respuesta del servidor:', response.data);
    return response.data; // Retorna los datos de respuesta del servidor si es necesario
  } catch (error) {
    console.error('Error al borrar datos de ventas:', error);
    throw error; // Manejo de errores o propagación hacia arriba si es necesario
  }
};
