import axios from "axios";
import { link } from "../servidor"; // Asegúrate de que la ruta sea correcta

export const actualizarEstado = async (barra, estado) => {
  try {
    const url = `http://${link}:5150/actualizar-estado`;

    // Realizar la solicitud PUT al endpoint con id y cliente en el cuerpo
    const response = await axios.put(url, { barra, estado });

    return response.data; // Retorna los datos de la respuesta del servidor
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
