import axios from 'axios';
import {link} from '../servidor';
// Función para obtener datos del menú desde el servidor

export const numeroCliente = async () => {
  try {
    const response = await axios.get(`http://${link}:5150/numeroCliente`);

    return response.data; // Retorna los datos obtenidos del menú
  } catch (error) {
    console.error('Error al obtener datos del menú:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};