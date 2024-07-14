import React, { useState, useEffect } from 'react';
import { obtenerDatosSemana } from '../Consultas/GET/getDatosSemana';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import TablaDia from './TablaSemana';

const Semana = () => {
  const [datosSemana, setDatosSemana] = useState([]);

  const diasSemana = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];

  useEffect(() => {
    // Función para obtener los datos de la semana
    const fetchData = async () => {
      try {
        const data = await obtenerDatosSemana();
        setDatosSemana(data);
      } catch (error) {
        console.error('Error al obtener datos de la semana:', error);
      }
    };

    fetchData(); // Llama a la función para cargar los datos al montar el componente
  }, []);



  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-black text-white p-6" style={{ paddingTop: '50px' }}>
      <h3 className="text-2xl font-bold mb-4">Semana</h3>

      {/* Renderizar las 6 tablas en una sola fila */}
      <div className="flex flex-wrap justify-center w-full overflow-x-auto">
        {diasSemana.map(dia => (
          <TablaDia key={dia} dia={dia} datosSemana={datosSemana} />
        ))}
      </div>
    </div>
  );
};

export default Semana;
