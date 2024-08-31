import axios from "axios";
import { link } from "../servidor"; // Asegúrate de que la ruta sea correcta

export const SUMARStockDIARIO = async (id_menu, id_dia, cantidad) => {
  try {
    const url = `http://${link}:5150/aumentar-stock`;

    // Realizar la solicitud PUT al endpoint con id_menu, id_dia y cantidad en el cuerpo
    const response = await axios.put(url, { id_menu, id_dia, cantidad });

    return response.data; // Retorna los datos de la respuesta del servidor
  } catch (error) {
    console.error('Error al actualizar el stock global:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};

