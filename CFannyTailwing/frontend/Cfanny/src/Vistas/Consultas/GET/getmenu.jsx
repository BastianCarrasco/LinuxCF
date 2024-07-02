import axios from 'axios';

// Función para obtener datos del menú desde el servidor
export const obtenerDatosMenu = async () => {
  try {
    const response = await axios.get('http://192.168.78.98:5150/datosMenu');
    return response.data; // Retorna los datos obtenidos del menú
  } catch (error) {
    console.error('Error al obtener datos del menú:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
