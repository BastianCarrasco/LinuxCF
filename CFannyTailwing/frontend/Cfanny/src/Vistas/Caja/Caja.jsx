import React, { useState, useEffect } from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import ButtonList from './ButtonList';
import SelectedDataTable from './SelectedDataTable';
import { obtenerDatosSemana } from '../Consultas/GET/getDatosSemana';
import { obtenerDatosCombos } from '../Consultas/GET/getCombos';
import { obtenerDatosTiposMenu } from '../Consultas/GET/gettiposMenu';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import { textoOrden } from './TextoOrden';
import { generarNumeroUnico } from './Barra';

const Caja = () => {
  const [barra, setBarra] = useState(0);
  const [numeroOrden, setNumeroOrden] = useState(0);
  const [Texto, setTexto] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayName, setDayName] = useState('');
  const [datosSemana, setDatosSemana] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [Combos, setCombos] = useState([]);
  const [Tipos, setTipos] = useState([]);
  const [precio, setPrecio] = useState(0);
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
    postre: 0,
  });

  const [lista, setLista] = useState({
    stringSelecteDataId: '',
    textoOrden: Texto,
    comentario: '',
    precio: 0,
    cantidad: 0,
    numeroOrden: 0,
    barra: 0,
    estado: 0,
    cliente: '',
  });

  const [ListaMayor, setListaMayor] = useState([]);


  const eliminarFila = (index) => {
    const nuevaListaMayor = [...ListaMayor];
    nuevaListaMayor.splice(index, 1);
    setListaMayor(nuevaListaMayor);
  };

  const toggleComentario = (index, comentario) => {
    const nuevaListaMayor = [...ListaMayor];
    const item = nuevaListaMayor[index];
    if (item.comentario.includes(comentario)) {
      item.comentario = item.comentario.replace(comentario, '').trim();
    } else {
      item.comentario = `${item.comentario} ${comentario}`.trim();
    }
    setListaMayor(nuevaListaMayor);
  };


  const incrementarCantidad = (index) => {
    const nuevaListaMayor = [...ListaMayor];
    nuevaListaMayor[index].cantidad += 1;
    nuevaListaMayor[index].precio = nuevaListaMayor[index].precioUnitario * nuevaListaMayor[index].cantidad;
    setListaMayor(nuevaListaMayor);
  };

  const decrementarCantidad = (index) => {
    const nuevaListaMayor = [...ListaMayor];
    if (nuevaListaMayor[index].cantidad > 1) {
      nuevaListaMayor[index].cantidad -= 1;
      nuevaListaMayor[index].precio = nuevaListaMayor[index].precioUnitario * nuevaListaMayor[index].cantidad;
      setListaMayor(nuevaListaMayor);
    }
  };




  useEffect(() => {
    const concatenatedNames = textoOrden(selectedData);
    setTexto(concatenatedNames);
  }, [selectedData]);

  useEffect(() => {
    setTexto('ORDEN');
    setPrecio(0);
    setNumeroOrden(1);
    setBarra(generarNumeroUnico);
  }, []);

  useEffect(() => {
    const nombresTiposSeleccionados = selectedData.map((element) => {
      const tipoEncontrado = Tipos.find((tipo) => tipo.id_tipo === element.tipo);
      return tipoEncontrado ? tipoEncontrado.nombre : null;
    });

    const nombresFiltrados = nombresTiposSeleccionados.filter((nombre) => nombre !== null);

    const contador = nombresFiltrados.reduce((contador, nombre) => {
      contador[nombre] = (contador[nombre] || 0) + 1;
      return contador;
    }, {});

    setContadorTipos(contador);

    console.log('Contador de tipos:', contadorTipos);
  }, [selectedData, Tipos]);

  useEffect(() => {
    const combo = Combos.find(
      (combo) =>
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

    if (combo) {
      setPrecio(combo.Precio);
      console.log(`Precio encontrado: $${combo.Precio}`);
    } else {
      setPrecio(null);
      console.log('No se encontró un precio coincidente');
    }
  }, [contadorTipos]);

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
        if (dayName) {
          const datos = await obtenerDatosSemana();
          setDatosSemana(datos.filter((dato) => dato.dia === dayName));
        }

        const data = await obtenerDatosMenu();
        const tiposPermitidos = [5, 6, 7, 8, 9, 13, 14];
        const filteredData = data.filter((item) => tiposPermitidos.includes(item.tipo));
        setDatosSemana((prevDatosSemana) => [...prevDatosSemana, ...filteredData]);
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
    const tipo = dato.tipo;

    const countTipo1 = selectedData.filter((item) => item.tipo === 1).length;
    const countTipo10 = selectedData.filter((item) => item.tipo === 10).length;
    const countTipo2 = selectedData.filter((item) => item.tipo === 2).length;

    if (
      (tipo === 1 && countTipo1 === 0 && countTipo10 === 0) ||
      (tipo === 10 && countTipo10 === 0 && countTipo1 === 0) ||
      (tipo === 2 && countTipo2 < 2) ||
      (tipo !== 1 && tipo !== 10 && tipo !== 2)
    ) {
      setSelectedData([...selectedData, dato]);
    } else {
      console.log('No cumple con la combinación permitida');
    }
  };

  const handleAgregarOrden = () => {
    const stringSelecteDataId = selectedData.map((item) => item.id).join('-');
    const nuevaLista = {
      ...lista,
      stringSelecteDataId,
      textoOrden: Texto,
      precio: precio, // Guardar el precio total
      precioUnitario: precio, // Guardar el precio unitario
      cantidad: 1, // Inicialmente la cantidad es 1
      numeroOrden,
      barra,
    };

    setListaMayor([...ListaMayor, nuevaLista]);
    setSelectedData([]);
    console.log('Orden agregada:', nuevaLista);
  };



  return (
    <div className="flex flex-row w-full min-h-screen">
      <div className="w-2/6 p-4">
        <div>
          <p style={{ fontSize: '24px', marginTop: '50px', color: 'white' }}>
            NUMERO: {numeroOrden} BARRA: {barra}
          </p>
          <br />
          <p style={{ fontSize: '24px', color: 'white' }}>
            {Texto} : ${precio}{' '}
          </p>
        </div>

        <ButtonList datosSemana={datosSemana} handleSelectData={handleSelectData} />
        <button onClick={handleAgregarOrden} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Agregar Orden
        </button>
      </div>
      <div className="w-4/6 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold">Caja</h2>
        <DateTimeDisplay dayName={dayName} currentDate={currentDate} />
        <p>Nombre del día: {dayName}</p>
        <SelectedDataTable
          ListaMayor={ListaMayor}
          incrementarCantidad={incrementarCantidad}
          decrementarCantidad={decrementarCantidad}
          eliminarFila={eliminarFila}
          toggleComentario={toggleComentario}
        />

        <p>HOLA: {precio}</p>
      </div>
    </div>
  );
};

export default Caja;
