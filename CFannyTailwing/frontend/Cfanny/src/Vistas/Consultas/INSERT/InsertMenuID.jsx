import axios from "axios";
import { link } from "../servidor";

export const insertarMenuID = async (id, nombre, tipo, precio, stockG) => {
  try {
    const response = await axios.post(`http://${link}:5150/insertar-menuid`, {
      id: id,
      nombre: nombre,
      tipo: tipo,
      precio: precio,
      stockG: stockG,
    });
    return response.data; // Retorna los datos de respuesta del servidor si es necesario
  } catch (error) {
    console.error("Error al insertar datos:", error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};
