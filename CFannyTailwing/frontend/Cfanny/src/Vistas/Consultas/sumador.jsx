import React, { useState, useEffect } from "react";
import { obtenerDatosMenu } from "./GET/getmenu";
import { tiempo } from "../Caja/nombreDia";
import { SUMARStockDIARIO } from "./UPDATE/repararCajaStockD";
import { SUMARStockGlobal } from "./UPDATE/repararCajaStockG";

const Sumador = ({ pedidos }) => {
  const [menu, setMenu] = useState([]);
  const [general, setGeneral] = useState([]);
  const [semana, setSemana] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayName, setDayName] = useState('');

  useEffect(() => {
    // Función que llama a `tiempo` con los setters de estado
    const updateDateTime = () => tiempo(setDayName, setCurrentDate);

    updateDateTime(); // Inicializa el estado al montar el componente
    const timerId = setInterval(updateDateTime, 1000); // Llama a `updateDateTime` cada segundo

    return () => clearInterval(timerId); // Limpia el intervalo al desmontar el componente
  }, []);

  const numericDay = new Date().getDay(); // 0 (Domingo) a 6 (Sábado)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const datosMenu = await obtenerDatosMenu();
        setMenu(datosMenu);
        console.log('Datos del menú:', datosMenu); // Muestra los datos del menú en la consola

        // Crea los arreglos `general` y `semana`
        const generalTipos = [0, 5, 6, 7, 8, 9, 13, 14];
        const semanaTipos = [1, 2, 3, 4, 10, 12];

        const generalData = datosMenu.filter(item => generalTipos.includes(item.tipo));
        const semanaData = datosMenu.filter(item => semanaTipos.includes(item.tipo));

        setGeneral(generalData.map(item => item.id)); // Guarda solo los IDs de general
        setSemana(semanaData.map(item => item.id)); // Guarda solo los IDs de semana

        console.log('Datos General:', generalData);
        console.log('Datos Semana:', semanaData);

      } catch (error) {
        console.error('Error al obtener datos del menú:', error);
      }
    };

    fetchMenu();
  }, []);

  const sumarD = async (id_menu, id_dia, cantidad) => {
    try {
      const resultado = await SUMARStockDIARIO(id_menu, id_dia, cantidad);
      console.log('Resultado de sumarD:', resultado);
    } catch (error) {
      console.error('Error al llamar a SUMARStockDIARIO:', error);
      throw error; // Re-lanza el error para que pueda ser capturado en `handleCancel`
    }
  };

  const sumarG = async (id, cantidad) => {
    try {
      const resultado = await SUMARStockGlobal(id, cantidad);
      console.log('Resultado de sumarG:', resultado);
    } catch (error) {
      console.error('Error al llamar a SUMARStockGlobal:', error);
      throw error; // Re-lanza el error para que pueda ser capturado en `handleCancel`
    }
  };

  useEffect(() => {
    if (menu.length > 0 && pedidos.length > 0) {
      for (const element of pedidos) {
        const siglas = element.stringSelecteDataId.split('-').map(id => parseInt(id, 10)).filter(Boolean);
        const multi = element.cantidad;

        console.log(siglas, multi, numericDay);

        // Manejar las funciones `sumarD` y `sumarG` con manejo de errores
        siglas.forEach(async (sigla) => {
          if (general.includes(sigla)) {
            try {
              await sumarG(sigla, multi);
            } catch (error) {
              console.error('Error en SUMARStockGlobal:', error);
            }
          } else {
            try {
              await sumarD(sigla, numericDay, multi);
            } catch (error) {
              console.error('Error en SUMARStockDIARIO, intentando SUMARStockGlobal:', error);
              try {
                await sumarG(sigla, multi);
              } catch (innerError) {
                console.error('Error en SUMARStockGlobal:', innerError);
              }
            }
          }
        });
      }
    }
  }, [menu, pedidos]); // Dependencias para ejecutar la lógica cuando cambian

  return (
    <div>
      <p>Revisa la consola para los datos del menú.</p>
    </div>
  );
};

export default Sumador;


