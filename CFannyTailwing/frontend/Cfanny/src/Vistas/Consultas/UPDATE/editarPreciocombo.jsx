import axios from 'axios';
import { link } from '../servidor';

// Función para actualizar el precio de un combo
export const actualizarPreciocombo = async (idcombo, nuevoPrecio) => {
  try {
    // Realiza la solicitud PUT al servidor con el idcombo y el nuevo precio
    const response = await axios.put(`http://${link}:5150/actualizar-precioCombo`, {
      idcombo: idcombo,
      nuevoPrecio: nuevoPrecio
    });

    // Imprime el resultado de la actualización
    console.log('Precio del combo actualizado correctamente:', response.data);
    return response.data;
  } catch (error) {
    // Maneja el error si ocurre
    console.error('Error al actualizar el precio del combo:', error.response ? error.response.data : error.message);
    throw error;
  }
};
