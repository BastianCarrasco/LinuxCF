import React, { useState, useEffect } from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import ButtonList from './ButtonList';
import SelectedDataTable from './SelectedDataTable';

import { obtenerDatosCombos } from '../Consultas/GET/getCombos';
import { obtenerDatosTiposMenu } from '../Consultas/GET/gettiposMenu';

import { textoOrden } from './TextoOrden';
import { generarNumeroUnico } from './Barra';
import Boleta from './boleta';
import { FaArrowRotateLeft } from "react-icons/fa6";
import { numeroCliente } from '../Consultas/GET/numeroCliente';
import { handleAgregarOrden } from './agregarOrden';
import {tiempo} from './nombreDia'

const Caja = () => {
  const [isBoletaOpen, setIsBoletaOpen] = useState(false);

  const [Cliente, setCliente] = useState(localStorage.getItem('Cliente') || null); // Inicializa el estado del filtro desde localStorage
  const [showInput, setShowInput] = useState(false);
  const handleOpenBoleta = () => setIsBoletaOpen(true);
  const handleCloseBoleta = () => setIsBoletaOpen(false);
  const [precioTotal, setprecioTota] = useState(0);
  const [barra, setBarra] = useState(0);
  const [numeroOrden, setNumeroOrden] = useState(0);
  const [Texto, setTexto] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayName, setDayName] = useState('');

  const [selectedData, setSelectedData] = useState([]);
  const [Combos, setCombos] = useState([]);
  const [Tipos, setTipos] = useState([]);
  const [precio, setPrecio] = useState(0);
  const [estado, setestado] = useState(1);

  const fetchNumeroCliente = async () => {
    try {
      const response = await numeroCliente();
     // console.log('Datos obtenidos:', response);

      // Asumiendo que la respuesta tiene la propiedad `total`
      const total = response.total;
      return Number(total); // Convertir a número explícitamente
    } catch (error) {

      return 0; // Retorna 0 en caso de error
    }
  };

  const fetchData = async () => {
    const numero = await fetchNumeroCliente();
    console.log(numero)
    setNumeroOrden(numero + 1); // Asume que quieres incrementar el número en 1
  };

  useEffect(() => {
    fetchData();
  }, []);





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

  const clearCliente = () => {
    setCliente(""); // Limpia el estado del filtro
    localStorage.removeItem('Cliente'); // Elimina el valor de localStorage
  };


  const handleInputChange = (e) => {
    const value = e.target.value;
    setCliente(value); // Actualiza el estado del filtro
    localStorage.setItem('Cliente', value); // Guarda el filtro en localStorage
  };

  const [ListaMayor, setListaMayor] = useState(JSON.parse(localStorage.getItem('ListaMayor')) || []);

  const removeLastItem = () => {
    setSelectedData((prevData) => prevData.slice(0, -1));

  };



  useEffect(() => {
    localStorage.setItem('ListaMayor', JSON.stringify(ListaMayor));
   // console.log(ListaMayor);
    let suma = 0;
    ListaMayor.forEach(element => {
      suma = suma + element.precio;
    });
    setprecioTota(suma);
   // console.log("PRECIO TOTAL " + precioTotal);
  }, [ListaMayor]);

  const borrarListaMayor = () => {
    setListaMayor([]);
    localStorage.setItem('ListaMayor', JSON.stringify([]));
   // console.log('ListaMayor vacía:', ListaMayor);
    clearComentario();
    clearCliente();
    setTexto();
    setPrecio(0);
    fetchData();
    setSelectedData([]);
  };


  const eliminarFila = (index) => {
    const nuevaListaMayor = [...ListaMayor];
    nuevaListaMayor.splice(index, 1);
    setListaMayor(nuevaListaMayor);
  };

  const toggleComentario = (index, comentario) => {
    const nuevaListaMayor = [...ListaMayor];
    const item = nuevaListaMayor[index];

    // Si el comentario ya existe, elimínalo
    if (item.comentario.includes(comentario)) {
        // Eliminar el comentario y también limpiar saltos de línea redundantes
        item.comentario = item.comentario
            .split('\n') // Dividir los comentarios en líneas
            .filter(linea => linea.trim() !== comentario.trim()) // Filtrar el comentario específico
            .join('\n') // Volver a unir los comentarios con saltos de línea
            .trim(); // Eliminar cualquier espacio en blanco al inicio y al final
    } else {
        // Si ya hay comentarios, agregar un salto de línea antes del nuevo comentario
        if (item.comentario.trim() === '') {
            item.comentario = comentario;
        } else {
            item.comentario = `${item.comentario}\n${comentario}`.trim();
        }
    }

    setListaMayor(nuevaListaMayor);
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
     // console.log('Orden agregada:', ListaMayor);
    }


  }, [selectedData]);








  useEffect(() => {
    const concatenatedNames = textoOrden(selectedData);
    setTexto(concatenatedNames);

  }, [selectedData]);

  useEffect(() => {

    setPrecio(0);

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

   // console.log(combo);

    if (combo) {
      setPrecio(combo.Precio);
    //  console.log(`Precio encontrado: $${combo.Precio}`);
    }
    else {
      setPrecio(0);
    //  console.log('No se encontró un precio coincidente');
    }
  }, [contadorTipos]);


  useEffect(() => {
    // Función que llama a `tiempo` con los setters de estado
    const updateDateTime = () => tiempo(setDayName, setCurrentDate);

    updateDateTime(); // Inicializa el estado al montar el componente
    const timerId = setInterval(updateDateTime, 1000); // Llama a `updateDateTime` cada segundo

    return () => clearInterval(timerId); // Limpia el intervalo al desmontar el componente
}, []);


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
    const countTipo1 = selectedData.filter((item) => item.tipo === 1).length;
    const countTipo10 = selectedData.filter((item) => item.tipo === 10).length;
    const countTipo2 = selectedData.filter((item) => item.tipo === 2).length;

    // Restricciones
    const maxTipo2 = 2;
    const maxTipo1or10 = 1;

    if ((dato.tipo === 1 || dato.tipo === 10) && (countTipo1 + countTipo10 >= maxTipo1or10)) {
      window.alert(`Solo se permite una PROTEINA o un GUISO por pedido/colacion.`);
    } else if (dato.tipo === 2 && countTipo2 >= maxTipo2) {
      window.alert(`Solo se permiten dos acompanamientos por pedido/colacion. .`);
    } else {
      setSelectedData([...selectedData, dato]);
    }
  };


  const agregarOrden = () => {
    handleAgregarOrden({
      selectedData,
      lista,
      Texto,
      precio,
      numeroOrden,
      comentarionuevo,
      barra,
      ListaMayor,
      setListaMayor,
      clearComentario,
      setSelectedData
    });

    setSelectedData([]);
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
                  ORDEN: {Texto}
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


            <ButtonList handleSelectData={handleSelectData} dayName={dayName} />
          </div>


          <div className="w-1/2 flex flex-col ">
            <DateTimeDisplay dayName={dayName} currentDate={currentDate} />
            <button style={{ fontSize: "24px", maxWidth:'50%',marginLeft:'300px' }} onClick={agregarOrden} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              Agregar Orden
            </button><br></br>
            <button
              type="button"
              className="bg-orange-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleOpenBoleta}
              style={{ fontSize: "24px", marginTop:'20px', maxWidth:'50%',marginLeft:'300px' }}
            >
              Crear Orden
            </button><br></br>

            <button
              type="button"
              className="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={verBarra}
              style={{ fontSize: "24px", marginTop:'20px',marginLeft:'300px', maxWidth:'50%' }}
            >
              Crear Pedido
            </button>


            {showInput && (

              <input
                type="text"
                value={Cliente}
                onChange={handleInputChange}
                placeholder="INGRESE NOMBRE DE CLIENTE"
                className="mb-4 p-2 border border-gray-300 rounded"
                style={{ fontSize: "18px", color: "black", marginTop:'10px', maxWidth:'50%', textAlign:'center',marginLeft:'300px' }}
              />
            )}

            <Boleta
              ListaMayor={ListaMayor}
              isOpen={isBoletaOpen}
              onClose={handleCloseBoleta}
              precioTotal={precioTotal}
              borrar={borrarListaMayor}
              barra={barra}
              filter={Cliente}
              clearCliente={clearCliente}
              aumentarCliente={fetchNumeroCliente}
              estado={estado}
              nombre={Cliente}
              funcionboleta={generarNumeroUnico}
              dayname={dayName}
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
            setListaMayor={setListaMayor}
            eliminarFila={eliminarFila}
            toggleComentario={toggleComentario}
            dayName={dayName}
          />
        </div>

      </div>
    </div>


  );
};

export default Caja;
