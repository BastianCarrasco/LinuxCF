import axios from 'axios';
import { link } from '../servidor';

// Función para obtener datos del menú desde el servidor
export const obtenerDatosPedidos = async () => {
  try {
    const response = await axios.get(`http://${link}:5150/pedidos`);
    return response.data; // Retorna los datos obtenidos del menú
  } catch (error) {
    console.error('Error al obtener datos del pedido:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};