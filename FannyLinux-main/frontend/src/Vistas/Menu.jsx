import React, { useEffect, useState } from 'react';
import { obtenerDatosSemana,actualizarStockSemana, actualizarStockG } from '../funciones backend/consultas';
import SelecionMenuSemana from '../Modal/Componentes Semana/SelecionMenuSemana';



function Menu() {
  const [semana, setSemana] = useState([]);
  const [semanaEditable, setSemanaEditable] = useState([]);
  const [mostrarSolo7, setMostrarSolo7] = useState(true);
  const [diaM,setdia] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerDatosSemana();
        setSemana(data);
        setSemanaEditable(data.slice()); // Crear una copia editable de los datos
      } catch (error) {
        console.error('Error al obtener datos de la semana:', error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   console.log(semanaEditable.filter(item => item.dia === 'LUNES'));
  // }, [semanaEditable]);
  
  async function llamarActualizarStockG() {
    try {
      const resultado = await actualizarStockG();
      console.log('Resultado de la actualización:', resultado);
      window.location.reload();
    } catch (error) {
      console.error('Error al llamar a actualizarStockG:', error);
    }
  }



  

  const handleStockChange = (event, dia, nombre) => {
    const value = parseInt(event.target.value); // Convertir el valor a un número
    if (!isNaN(value)) {
      const newSemanaEditable = semanaEditable.map((item) => {
        if (item.dia === dia && item.nombre === nombre) {
          return { ...item, stockD: value };
        }
        return item;
      });
      setSemanaEditable(newSemanaEditable); // Actualizar el estado semanaEditable
    }
  };
  

  const handleMostrarSolo7Change = (event) => {
    setMostrarSolo7(event.target.checked);
  };

  const handleActualizarStock = async () => {
    try {
      // Objeto para mapear los nombres de los días a sus claves
      const diasClaves = {
        LUNES: 1,
        MARTES: 2,
        MIÉRCOLES: 3,
        JUEVES: 4,
        VIERNES: 5,
        SÁBADO: 6
      };
  
      // Utilizar Promise.all para esperar la finalización de todas las actualizaciones de stock
      await Promise.all(semanaEditable.map(async (item) => {
        // Obtener la clave del día actual
        const clave = diasClaves[item.dia];
        // Verificar si la clave existe
        if (clave !== undefined) {
          // Ejecutar la actualización de stock
          await actualizarStockSemana(item.numero, clave, item.stockD);
        }
      }));

      llamarActualizarStockG();

  
    
    } catch (error) {
      console.error('Error al actualizar el stock de la semana:', error);
    }
  };
  

  return (
    <div className="menu-container">
     <row className="fila_botones_semana"> <SelecionMenuSemana></SelecionMenuSemana>
      <button onClick={handleActualizarStock}>Actualizar Stock</button>
      </row>
     
      <div>
        <input
          type="checkbox"
          checked={mostrarSolo7}
          onChange={handleMostrarSolo7Change}
        />
        <label>Mostrar solo platillos</label>

     
      </div>
      <div style={{border:"solid"}} className="tables-container">
        {['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'].map((dia, indexDia) => (
          <table style={{border:"solid"}} key={indexDia} className="day-table">
            <thead>
              <h3>{dia}</h3>
            
              <tr>
                <th style={{ width: '50%' }}>Nombre</th>
                <th style={{ width: '50%' }}>Stock</th>
              </tr>
            </thead>
            <tbody style={{border:"solid"}}>
              {mostrarSolo7
                ? semanaEditable
                    .filter((item) => item.dia === dia)
                    .slice(0, 7) // Mostrar solo los primeros 7 elementos
                    .map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: '50%' }}>{item.nombre}</td>
                        <td style={{ width: '50%' }}>
                          <input
                            style={{ width: '50%' }}
                            type="number"
                            value={item.stockD}
                            min="0"
                            onChange={(event) => handleStockChange(event, item.dia, item.nombre)}
                          />
                        </td>
                      </tr>
                    ))
                : semanaEditable
                    .filter((item) => item.dia === dia)
                    .slice(7) // Mostrar los elementos después de los primeros 7
                    .map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: '50%' }}>{item.nombre}</td>
                        <td style={{ width: '50%' }}>
                          <input
                            style={{ width: '50%' }}
                            type="number"
                            value={item.stockD}
                            min="0"
                            onChange={(event) => handleStockChange(event, item.dia, item.nombre)}
                          />
                        </td>
                      </tr>
                    ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}

export default Menu;






