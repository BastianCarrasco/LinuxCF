import axios from 'axios';
import { link } from '../servidor';

// Función para actualizar el estado de un pedido a 1
export const actualizarEstadoPedido = async (barra, nuevoEstado) => {
  try {
    // Establece el nuevo estado a 1
    

    // Realiza la solicitud PUT al servidor con el código de barra y el nuevo estado
    const response = await axios.put(`http://${link}:5150/actualizar-estado`, {
      barra: barra,
      nuevoEstado: nuevoEstado
    });

    // Imprime el resultado de la actualización
    console.log('Estado del pedido actualizado correctamente:', response.data);
    return response.data;
  } catch (error) {
    // Maneja el error si ocurre
    console.error('Error al actualizar el estado del pedido:', error.response ? error.response.data : error.message);
    throw error;
  }
};
