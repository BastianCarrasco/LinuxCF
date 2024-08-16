import axios from "axios";
import { link } from "../servidor";

export const reducirStockG = async (id, cantidad) => {
  try {
    const response = await axios.put(`http://${link}:5150/reducir-stockMayor`, {
      id,
      cantidad
    });
    console.log('Stock reducido correctamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al reducir el stock:', error.response ? error.response.data : error.message);
    throw error;
  }
};