import axios from 'axios';
import { link } from '../servidor';

// Función para insertar un combo
export const insertarCombo = async (
  tipo_combo, proteina, acompana, acompanaG, guiso, postre,
  ensaladaC, ensaladaG, papasC, papasG, bebida, Precio
) => {
  try {
    const response = await axios.post(`http://${link}:5150/crear-combo`, {
      tipo_combo,
      proteina,
      acompana,
      acompanaG,
      guiso,
      postre,
      ensaladaC,
      ensaladaG,
      papasC,
      papasG,
      bebida,
      Precio
    });
    return response.data; // Retorna los datos de respuesta del servidor si es necesario
  } catch (error) {
    console.error('Error al insertar datos:', error);
    throw error; // Lanza el error para manejarlo en el contexto donde se llama esta función
  }
};


