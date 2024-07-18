import React, { useState, useEffect } from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import ButtonList from './ButtonList';
import SelectedDataTable from './SelectedDataTable';
import { obtenerDatosSemana } from '../Consultas/GET/getDatosSemana';
import { obtenerDatosCombos } from '../Consultas/GET/getCombos';
import { obtenerDatosTiposMenu } from '../Consultas/GET/gettiposMenu';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import { textoOrden } from './TextoOrden';

const Caja = () => {
  const [Texto, setTexto] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayName, setDayName] = useState('');
  const [datosSemana, setDatosSemana] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [Combos, setCombos] = useState([]);
  const [Tipos, setTipos] = useState([]);
  const [precio, setPrecio] = useState(null);
  const [contadorTipos, setContadorTipos] = useState({
    proteina: 0,
    acompana: 0,
    acompanaG: 0,
    bebida: 0,
    ensaladaC: 0,
    ensaladaG: 0,
    guiso: 0,
    papasC: 0,
    papasG: 0,
    postre: 0
  });

  useEffect(() => {
    const concatenatedNames = textoOrden(selectedData);
    setTexto(concatenatedNames);

  }, [selectedData]);
  // Efecto para actualizar el contador de tipos
  useEffect(() => {
    // Crear un arreglo para almacenar los nombres de los tipos y contar las ocurrencias
    const nombresTiposSeleccionados = selectedData.map(element => {
      // Encontrar el tipo correspondiente en Tipos
      const tipoEncontrado = Tipos.find(tipo => tipo.id_tipo === element.tipo);

      // Retornar el nombre del tipo si se encontró
      return tipoEncontrado ? tipoEncontrado.nombre : null;
    });

    // Filtrar nombres de tipos no nulos
    const nombresFiltrados = nombresTiposSeleccionados.filter(nombre => nombre !== null);

    // Crear un objeto para contar las ocurrencias de cada nombre de tipo
    const contador = nombresFiltrados.reduce((contador, nombre) => {
      contador[nombre] = (contador[nombre] || 0) + 1;
      return contador;
    }, {});

    // Actualizar el estado con el contador de tipos
    setContadorTipos(contador);

    // Imprimir en consola el objeto contador de tipos
    console.log("Contador de tipos:", contadorTipos);

  }, [selectedData, Tipos]);

  // Efecto para buscar el precio correspondiente en Combos
  useEffect(() => {
    // Comparar contadorTipos con Combos
    const combo = Combos.find(combo =>
      combo.proteina === (contadorTipos['proteina'] || 0) &&
      combo.acompana === (contadorTipos['acompana'] || 0) &&
      combo.acompanaG === (contadorTipos['acompanaG'] || 0) &&
      combo.bebida === (contadorTipos['bebida'] || 0) &&
      combo.ensaladaC === (contadorTipos['ensaladaC'] || 0) &&
      combo.ensaladaG === (contadorTipos['ensaladaG'] || 0) &&
      combo.guiso === (contadorTipos['guiso'] || 0) &&
      combo.papasC === (contadorTipos['papasC'] || 0) &&
      combo.papasG === (contadorTipos['papasG'] || 0) &&
      combo.postre === (contadorTipos['postre'] || 0)
    );

    console.log(combo);

    // Si se encuentra un combo coincidente, actualizar el precio y hacer console.log
    if (combo) {
      setPrecio(combo.Precio);
      console.log(`Precio encontrado: $${combo.Precio}`);
    } else {
      setPrecio(null); // Si no hay coincidencia, poner el precio en null
      console.log("No se encontró un precio coincidente");
    }
  }, [contadorTipos]);



  // useEffect(()=>{console.log(Tipos)},[Tipos]);
   //useEffect(()=>{console.log(Combos)},[Combos]);
   useEffect(()=>{console.log(selectedData)},[selectedData]);
   //useEffect(()=>{console.log(datosSemana)},[datosSemana]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(now);
      const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
      setDayName(dayNames[now.getDay()]);
    };

    updateDateTime();
    const timerId = setInterval(updateDateTime, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // Fetch datos de la semana
        if (dayName) {
          const datos = await obtenerDatosSemana();
          setDatosSemana(datos.filter(dato => dato.dia === dayName));
        }

        // Fetch datos del menú después de obtener datos de la semana
        const data = await obtenerDatosMenu();
        const tiposPermitidos = [5, 6, 7, 8, 9, 13,14];
        const filteredData = data.filter(item => tiposPermitidos.includes(item.tipo));
        setDatosSemana(prevDatosSemana => [...prevDatosSemana, ...filteredData]);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchDatos();
  }, [dayName, obtenerDatosSemana, obtenerDatosMenu]);


  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const data = await obtenerDatosCombos();
        setCombos(data);
      } catch (error) {
        console.error('Error al obtener datos de los combos:', error);
      }
    };

    fetchCombos();
  }, []);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const data = await obtenerDatosTiposMenu();
        setTipos(data);
      } catch (error) {
        console.error('Error al obtener tipos de menú:', error);
      }
    };

    fetchTipos();
  }, []);

  const handleSelectData = (dato) => {
    // Verificar el tipo del dato seleccionado
    const tipo = dato.tipo;

    // Contar cuántos elementos hay actualmente en selectedData de cada tipo
    const countTipo1 = selectedData.filter(item => item.tipo === 1).length;
    const countTipo10 = selectedData.filter(item => item.tipo === 10).length;
    const countTipo2 = selectedData.filter(item => item.tipo === 2).length;

    // Validar las condiciones
    if ((tipo === 1 && countTipo1 === 0 && countTipo10 === 0) || // Puede haber solo uno de tipo 1 si no hay tipo 10
        (tipo === 10 && countTipo10 === 0 && countTipo1 === 0) || // Puede haber solo uno de tipo 10 si no hay tipo 1
        (tipo === 2 && countTipo2 < 2) || // Pueden haber hasta dos de tipo 2
        tipo !== 1 && tipo !== 10 && tipo !== 2) { // Cualquier otro tipo no tiene restricciones
      setSelectedData([...selectedData, dato]);
    } else {
      // Mostrar mensaje de error
      console.log("No cumple con la combinación permitida");
      // Opcionalmente puedes mostrar un mensaje al usuario
      // alert("No cumple con la combinación permitida");
    }
  };




  return (
    <div  className="flex flex-row w-full min-h-screen">
      <div className="w-1/2 p-4">

        <DateTimeDisplay dayName={dayName} currentDate={currentDate} />
        <p style={{fontSize:"24px"}}>{Texto}</p>
        <ButtonList datosSemana={datosSemana} handleSelectData={handleSelectData} />

      </div>
      <div className="w-1/2 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold">Caja</h2>
        <p>Nombre del día: {dayName}</p>
        <SelectedDataTable selectedData={selectedData} />
        <p>HOLA: {precio}</p>
      </div>
    </div>
  );
};

export default Caja;
