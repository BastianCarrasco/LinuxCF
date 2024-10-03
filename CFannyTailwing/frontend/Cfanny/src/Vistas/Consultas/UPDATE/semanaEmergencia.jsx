import axios from "axios";
import { link } from "../servidor"; // Asegúrate de que la ruta sea correcta

export const actualizarEmergencia = async (id_semana, stockD) => {
  try {
    // Construir la URL sin el parámetro id_semana (lo enviaremos en el cuerpo)
    const url = `http://${link}:5150/actualizar-semanaEmergencia`;

    // Realizar la solicitud PUT al endpoint con id_semana y stockD en el cuerpo
    const response = await axios.put(url, {id_semana, stockD});

    // Retorna los datos de la respuesta del servidor
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el stockD:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
