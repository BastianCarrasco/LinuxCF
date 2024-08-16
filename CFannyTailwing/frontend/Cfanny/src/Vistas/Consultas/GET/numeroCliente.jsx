import axios from 'axios';
import { link } from '../servidor';

// Función para obtener datos del número de cliente desde el servidor
export const numeroCliente = async () => {
  try {
    const response = await axios.get(`http://${link}:5150/numeroCliente`);
    // console.log('Número de cliente obtenido CONSULTA:', response.data);
    return response.data; // Retorna los datos obtenidos del servidor
  } catch (error) {
    //console.error('Error al obtener el número de cliente:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
