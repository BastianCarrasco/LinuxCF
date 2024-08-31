import axios from "axios";
import { link } from "../servidor"; // Asegúrate de que la ruta sea correcta

export const SUMARStockGlobal = async (id, cantidad) => {
  try {
    const url = `http://${link}:5150/aumentar-stockMayor`;

    // Realizar la solicitud PUT al endpoint con id y cantidad en el cuerpo
    const response = await axios.put(url, { id, cantidad });

    return response.data; // Retorna los datos de la respuesta del servidor
  } catch (error) {
    console.error('Error al actualizar el stock global:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
