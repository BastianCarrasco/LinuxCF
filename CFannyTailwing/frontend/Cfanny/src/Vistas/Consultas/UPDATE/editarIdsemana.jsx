import axios from "axios";
import { link } from "../servidor"; // Asumiendo que link contiene la dirección del servidor

export const actualizarIdSemana = async (p_id_dia, p_nuevo_id_menu, p_numero) => {
  const url = `http://${link}:5150/actualizar-id-semana`;

  const response = await axios.put(url, {
    p_id_dia,
    p_nuevo_id_menu,
    p_numero
  });

  return response.data; // Retorna los datos de la respuesta del servidor
};
