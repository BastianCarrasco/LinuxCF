import axios from "axios";
import { link } from "../servidor"; // Asegúrate de que la ruta sea correcta

export const actualizarComentario = async (idPedido, nuevoComentario) => {
  try {
    const url = `http://${link}:5150/actualizar-comentario`;

    // Realizar la solicitud PUT al endpoint con idPedido y nuevoComentario en el cuerpo
    const response = await axios.put(url, { idPedido, nuevoComentario });

    return response.data; // Retorna los datos de la respuesta del servidor
  } catch (error) {
    console.error('Error al actualizar el comentario:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
