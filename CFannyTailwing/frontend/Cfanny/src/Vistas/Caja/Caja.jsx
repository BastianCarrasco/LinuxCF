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
import Boleta from './boleta';
import { FaArrowRotateLeft } from "react-icons/fa6";
import { numeroCliente } from '../Consultas/GET/numeroCliente';
import { useFetcher } from 'react-router-dom';


const Caja = () => {
  const [isBoletaOpen, setIsBoletaOpen] = useState(false);
  const [filter, setFilter] = useState(localStorage.getItem('filter') || ""); // Inicializa el estado del filtro desde localStorage
  const [showInput, setShowInput] = useState(false);
  const handleOpenBoleta = () => setIsBoletaOpen(true);
  const handleCloseBoleta = () => setIsBoletaOpen(false);
  const [precioTotal, setprecioTota] = useState(0);
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


  const [comentarionuevo, setcomentarionuevo] = useState(localStorage.getItem('comentarionuevo') || ""); // Inicializa el estado del filtro desde localStorage

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
    comentario: comentarionuevo,
    precio: 0,
    cantidad: 0,
    numeroOrden: 0,
    barra: 0,
    estado: 0,
    cliente: null,
  });

  const fetchNumeroCliente = async () => {
    try {
      const response = await numeroCliente();
      const maxNumeroOrden = response.maxNumeroOrden; // Suponiendo que la respuesta tiene la propiedad 'maxNumeroOrden'
      setNumeroOrden(parseInt(maxNumeroOrden, 10)+1); // Convierte a entero
      console.log(maxNumeroOrden + "dcacawcac");
    } catch (error) {
      console.error('Error al obtener el número de cliente:', error);
    }
  };

  useEffect(() => {
    fetchNumeroCliente();
  }, []);






  function verBarra() {
    if (showInput === false) {
      setShowInput(true);
    }
    else setShowInput(false);
  };

  const clearComentario = () => {
    setcomentarionuevo(""); // Limpia el estado del filtro
    localStorage.removeItem('comentarionuevo'); // Elimina el valor de localStorage
  };


  const handlecomentarionuevoChange = (e) => {
    const value = e.target.value;
    setcomentarionuevo(value); // Actualiza el estado del filtro
    localStorage.setItem('comentarionuevo', value); // Guarda el filtro en localStorage
  };






  const clearFilter = () => {
    setFilter(""); // Limpia el estado del filtro
    localStorage.removeItem('filter'); // Elimina el valor de localStorage
  };


  const handleInputChange = (e) => {
    const value = e.target.value;
    setFilter(value); // Actualiza el estado del filtro
    localStorage.setItem('filter', value); // Guarda el filtro en localStorage
  };

  const [ListaMayor, setListaMayor] = useState(JSON.parse(localStorage.getItem('ListaMayor')) || []);

  const removeLastItem = () => {
    setSelectedData((prevData) => prevData.slice(0, -1));
  };



  useEffect(() => {
    localStorage.setItem('ListaMayor', JSON.stringify(ListaMayor));
    console.log(ListaMayor);
    let suma = 0;
    ListaMayor.forEach(element => {
      suma = suma + element.precio;
    });
    setprecioTota(suma);
    console.log("PRECIO TOTAL " + precioTotal);
  }, [ListaMayor]);

  const borrarListaMayor = () => {
    setListaMayor([]);
    localStorage.setItem('ListaMayor', JSON.stringify([]));
    console.log('ListaMayor vacía:', ListaMayor);
    clearComentario();
    clearFilter();
    setTexto("ORDEN");
    setPrecio(0);
  };


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
    const filteredData = selectedData.filter((item) => {
      const tiposValidos = [4, 5, 7, 8, 9];
      const nombresNoPermitidos = ['Jalea', 'Pebre', 'Flan'];

      // Filtrar los datos por tipo válido y nombres no permitidos
      return tiposValidos.includes(item.tipo) && !nombresNoPermitidos.includes(item.nombre);
    });

    if (filteredData.length > 0) {


      const nuevaLista = filteredData.map((item) => ({
        stringSelecteDataId: (item.id).toString(),
        textoOrden: item.nombre,
        comentario: comentarionuevo,
        precio: item.precio,
        precioUnitario: item.precio,
        cantidad: 1,
        numeroOrden: numeroOrden.toString(),
        barra: barra,
        estado: 0,
        cliente: null,
      }));

      setListaMayor([...ListaMayor, ...nuevaLista]);
      setSelectedData([]);
      console.log('Orden agregada:', ListaMayor);
    }
  }, [selectedData]);





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


  }, [selectedData, Tipos]);

  useEffect(()=>{
    console.log('Contador de tipos:', contadorTipos);
  },[selectedData]);

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
      // Obtén el nombre del día actual
      let dayName = dayNames[now.getDay()];

      // Ajusta el nombre del día si es domingo
      if (dayName === 'DOMINGO') {
        dayName = 'LUNES';
      }

      setDayName(dayName);
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

    if (selectedData.length > 0) {
      const stringSelecteDataId = selectedData.map((item) => item.id).join('-');
      const nuevaLista = {
        ...lista,
        stringSelecteDataId,
        textoOrden: Texto,
        precio: precio, // Guardar el precio total
        precioUnitario: precio, // Guardar el precio unitario
        cantidad: 1, // Inicialmente la cantidad es 1
        numeroOrden: numeroOrden.toString(),
        comentario: comentarionuevo,
        barra,
      };
      setListaMayor([...ListaMayor, nuevaLista]);
      setSelectedData([]);
      console.log('Orden agregada:', nuevaLista);
      clearComentario();


    }
  };



  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="w-full p-4">

        {/* TOP */}
        <div style={{ border: "solid" }} className="flex justify-between">
          <div style={{ marginTop: "40px" }} className="w-1/2">
            <div className="flex items-center justify-between">
              <button style={{ fontSize: "24px" }} onClick={borrarListaMayor} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                Cancelar
              </button>
              <p style={{ fontSize: '24px', color: 'white' }}>
                NUMERO: {numeroOrden}
              </p>



            </div>

            <div className="flex border p-4">

              <div className="flex-1 flex items-center">
                <p style={{ fontSize: '24px', color: 'white' }}>
                  {Texto} : ${precio}
                </p>


              </div>

              <button style={{ fontSize: "24px" }} onClick={removeLastItem} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                <FaArrowRotateLeft />
              </button>
            </div>
            <div>
              <p style={{ fontSize: '24px', color: 'white' }}>
                COMENTARIO:
              </p>  <input
                type="text"
                value={comentarionuevo}
                onChange={handlecomentarionuevoChange}
                placeholder="Ingresar comentaio"
                className="mb-4 p-2 border border-gray-300 rounded"
                style={{ fontSize: "18px", color: "black" }}
              />
            </div>


            <ButtonList datosSemana={datosSemana} handleSelectData={handleSelectData} />
          </div>


          <div className="w-1/2 flex flex-col ">
            <DateTimeDisplay dayName={dayName} currentDate={currentDate} />
            <button style={{ fontSize: "24px" }} onClick={handleAgregarOrden} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Agregar Orden
            </button><br></br>
            <button
              type="button"
              className="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleOpenBoleta}
              style={{ fontSize: "24px" }}
            >
              Crear Orden
            </button><br></br>

            <button
              type="button"
              className="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={verBarra}
              style={{ fontSize: "24px" }}
            >
              Crear Pedido
            </button>

            {showInput && (
              <input
                type="text"
                value={filter}
                onChange={handleInputChange}
                placeholder="Ingresar ID de nueve dígitos..."
                className="mb-4 p-2 border border-gray-300 rounded"
                style={{ fontSize: "18px", color: "black" }}
              />
            )}

            <Boleta
              ListaMayor={ListaMayor}
              isOpen={isBoletaOpen}
              onClose={handleCloseBoleta}
              precioTotal={precioTotal}
              borrar={borrarListaMayor}
              barra={barra}
              filter={filter}
              clearFilter={clearFilter}
              aumentarCliente={fetchNumeroCliente}
            />
            <p style={{ fontSize: '30px', marginTop: '50px', color: 'white' }}>
              TOTAL:  $ {precioTotal}
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-4">
          <SelectedDataTable
            ListaMayor={ListaMayor}
            incrementarCantidad={incrementarCantidad}
            decrementarCantidad={decrementarCantidad}
            eliminarFila={eliminarFila}
            toggleComentario={toggleComentario}
          />
        </div>

      </div>
    </div>


  );
};

export default Caja;
