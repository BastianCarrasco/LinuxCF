import axios from "axios";
import { link } from "../servidor"; // Asegúrate de que la ruta sea correcta

export const actualizarStockGlobal = async () => {
  try {
    const url = `http://${link}:5150/actualizar-stock-global`;

    // Realizar la solicitud PUT al endpoint
    const response = await axios.put(url);

    return response.data; // Retorna los datos de la respuesta del servidor
  } catch (error) {
    console.error('Error al actualizar el stock global:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
