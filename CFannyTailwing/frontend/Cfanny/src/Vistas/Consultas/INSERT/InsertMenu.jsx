import axios from 'axios';

export const insertarMenu = async (nombre, tipo, precio, stockG) => {
  try {
    const response = await axios.post('http://192.168.78.98:5150/insertar-menu', {
      nombre: nombre,
      tipo: tipo,
      precio: precio,
      stockG: stockG
    });
    return response.data; // Retorna los datos de respuesta del servidor si es necesario
  } catch (error) {
    console.error('Error al insertar datos:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
