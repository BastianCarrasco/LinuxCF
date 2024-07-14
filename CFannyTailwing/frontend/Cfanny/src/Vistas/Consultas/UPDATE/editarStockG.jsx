import axios from 'axios';
import { link } from '../servidor';
export const actualizarMenu = async (id, nombre, tipo, precio, stockG) => {
  try {
    const response = await axios.put(`http://${link}:5150/actualizar-menu/${id}`, {
      nombre: nombre,
      tipo: tipo,
      precio: precio,
      stockG: stockG
    });
    console.log('Menú actualizado correctamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el menú:', error.response ? error.response.data : error.message);
    throw error;
  }
};
