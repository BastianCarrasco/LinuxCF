// src/Consultas/GET/getDatosSemana.js

import axios from 'axios';

export const obtenerDatosSemana = async () => {
  try {
    const response = await axios.get('http://192.168.78.98:5150/datosSemana');
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de la semana:', error);
    throw error;
  }
};
