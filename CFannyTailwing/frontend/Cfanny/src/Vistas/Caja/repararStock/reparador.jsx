import React, { useEffect, useState } from "react";
import { obtenerNumeroDelDia } from '../nombreDia';
import { SUMARStockDIARIO } from '../../Consultas/UPDATE/repararCajaStockD';
import { SUMARStockGlobal } from '../../Consultas/UPDATE/repararCajaStockG';
import { obtenerDatosmenuNoEnSemana } from "../../Consultas/GET/get_menuNoSemana";

const reparador_stock = async (n) => {
  let llaves = [];
  let multiplicador = n.cantidad;

  // Verifica que 'n' es un objeto y 'stringSelecteDataId' es una cadena
  if (n && typeof n.stringSelecteDataId === 'string') {
    // Obtiene el valor de 'stringSelecteDataId' y lo recorta
    const valor = n.stringSelecteDataId.trim();
    
    // Verifica si el valor contiene un guion
    if (valor.includes('-')) {
      // Divide la cadena por '-'
      const partes = valor.split('-');
      
      // Convierte cada parte a número entero y agrega al array 'llaves'
      llaves = partes.map(parte => parseInt(parte.trim(), 10)).filter(num => !isNaN(num));
    } else {
      // Si no hay guion, convierte el valor entero y lo agrega al array
      const numero = parseInt(valor, 10);
      if (!isNaN(numero)) {
        llaves.push(numero);
      }
    }
  } else {
    console.error('El objeto n debe tener una propiedad stringSelecteDataId de tipo cadena.');
    return; // Salir de la función si hay un error en la entrada
  }

  try {
    const datosMenu = await obtenerDatosmenuNoEnSemana();
    const NOsemana = datosMenu; // Guarda los datos en la constante NOsemana

    // Asegúrate de que NOsemana es un array y tiene la estructura esperada
    if (Array.isArray(NOsemana)) {
      // Recorre cada valor de 'llaves' y verifica si está en NOsemana por la propiedad 'id'
      await Promise.all(llaves.map(async (valor) => {
        const encontrado = NOsemana.some(item => item.id === valor);
        if (encontrado) {
         
          await SUMARStockGlobal(valor, multiplicador);
        } else {
         
          await SUMARStockDIARIO(valor, obtenerNumeroDelDia(), multiplicador);
        }
      }));
    } else {
      
    }

  } catch (error) {
    console.error('Error al obtener datos del menú:', error);
  }
};

export default reparador_stock;

