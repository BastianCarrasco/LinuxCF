import axios from "axios";
import { link } from "../servidor"; // Asumiendo que link contiene la dirección del servidor

export const actualizarStockSemana = async (p_id_dia, p_id_menu, p_stockD) => {
  const url = `http://${link}:5150/actualizar-stock-semana`;

  const response = await axios.put(url, {
    p_id_dia,
    p_id_menu,
    p_stockD
  });

  return response.data; // Retorna los datos de la respuesta del servidor
};
