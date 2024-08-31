import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice, faIceCream, faWineBottle } from '@fortawesome/free-solid-svg-icons';
import { obtenerDatosSemana } from '../Consultas/GET/getDatosSemana';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';

const SelectedDataTableTT = ({ ListaMayor, setListaMayor, eliminarFila, toggleComentario, dayName }) => {
    const [datosSemana, setDatosSemana] = useState([]);
    const [datosMenu, setDatosMenu] = useState([]);

    function buscarStockG(x) {
    const encontrado = datosSemana.find(dato => dato.id === parseInt(x, 10));
    if (encontrado) {
        console.log("encontrado stockG", encontrado.stockG);
        return encontrado.stockG; // Devuelve el valor de stockG si se encuentra el elemento
    } else {
        console.log("Elemento no encontrado");
        return 0; // Devuelve 0 si no se encuentra el elemento
    }
}

function buscarStockD(x) {
    const encontrado = datosSemana.find(dato => dato.id === parseInt(x, 10));
    if (encontrado) {
        console.log("encontrado stockD", encontrado.stockD);
        return encontrado.stockD; // Devuelve el valor de stockD si se encuentra el elemento
    } else {
        console.log("Elemento no encontrado");
        return 0; // Devuelve 0 si no se encuentra el elemento
    }
}

const incrementarCantidad = (index) => {
    const nuevaListaMayor = [...ListaMayor];
    const llaveString = ListaMayor[index].stringSelecteDataId;
    let llaves;

    // Verificar si 'llaveString' contiene '-'
    if (llaveString.includes('-')) {
        llaves = llaveString.split('-').map(Number); // Convertimos llaveString a un arreglo de números
    } else {
        llaves = [Number(llaveString)]; // Convertimos llaveString a un arreglo con un solo número
    }

    console.log("llaves", llaves);

    // Variable para verificar si se puede incrementar
    let sePuedeIncrementar = true;

    // Iterar sobre cada llave y verificar el stock disponible
    llaves.forEach((llave) => {
        const stockG = buscarStockG(llave);
        const stockD = buscarStockD(llave);

        // Determinar cuál stock usar (el que no sea nulo y mayor a 0)
        const stockDisponible = stockG > 0 ? stockG : (stockD > 0 ? stockD : 0);

        // Si el stock disponible es menor que la cantidad actual + 1, no se puede incrementar
        if (nuevaListaMayor[index].cantidad + 1 > stockDisponible) {
            sePuedeIncrementar = false;
        }
    });

    console.log("STOCK orden", nuevaListaMayor[index].cantidad, "STOCK G/D Total", sePuedeIncrementar ? "suficiente" : "insuficiente");

    // Verificar si se puede incrementar sin exceder el stock disponible de cada llave
    if (sePuedeIncrementar) {
        nuevaListaMayor[index].cantidad += 1;
        nuevaListaMayor[index].precio = nuevaListaMayor[index].precioUnitario * nuevaListaMayor[index].cantidad;
        setListaMayor(nuevaListaMayor);
    } else {
        window.alert("NO QUEDAN SUFICIENTES PRODUCTOS DE ESTE TIPO");
        console.log("ERROR: No se puede incrementar, stock insuficiente.");
    }
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
        const fetchDatos = async () => {
            try {
                // Fetch datosSemana based on dayName
                if (dayName) {
                    const datos = await obtenerDatosSemana();
                    const filteredSemana = datos.filter((dato) => dato.dia === dayName);
                    setDatosSemana(filteredSemana);

                    // Log datosSemana to the console
                    console.log('Datos Semana:', filteredSemana);
                }

                // Fetch datosMenu and filter by tiposPermitidos
                const data = await obtenerDatosMenu();
                const tiposPermitidos = [5, 6, 7, 8, 9, 13, 14];
                const filteredData = data.filter((item) => tiposPermitidos.includes(item.tipo));
                setDatosMenu(filteredData);

                // Log datosMenu to the console
                console.log('Datos Menu:', filteredData);

                // Combine datosSemana and filteredData
                setDatosSemana((prevDatosSemana) => [...prevDatosSemana, ...filteredData]);
                console.log('Datos TOTALES:', datosSemana);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchDatos();
    }, [dayName]);

     useEffect(() => {
         console.log('Updated ListaMayor:', ListaMayor);
         console.log('DATA SEMANA:', datosSemana);
         console.log('DATA MENU:', datosMenu);

    }, [ListaMayor]);

   const mas10 = (index) => {
    const nuevaListaMayor = [...ListaMayor];
    const llaveString = ListaMayor[index].stringSelecteDataId;
    let llaves;

    // Verificar si 'llaveString' contiene '-'
    if (llaveString.includes('-')) {
        llaves = llaveString.split('-').map(Number); // Convertimos llaveString a un arreglo de números
    } else {
        llaves = [Number(llaveString)]; // Convertimos llaveString a un arreglo con un solo número
    }

    console.log("llaves", llaves);

    // Variable para verificar si se puede incrementar
    let sePuedeIncrementar = true;

    // Iterar sobre cada llave y verificar el stock disponible
    llaves.forEach((llave) => {
        const stockG = buscarStockG(llave);
        const stockD = buscarStockD(llave);

        // Determinar cuál stock usar (el que no sea nulo y mayor a 0)
        const stockDisponible = stockG > 0 ? stockG : (stockD > 0 ? stockD : 0);

        // Si el stock disponible es menor que la cantidad actual + 10, no se puede incrementar
        if (nuevaListaMayor[index].cantidad + 10 > stockDisponible) {
            sePuedeIncrementar = false;
        }
    });

    // Verificar si se puede incrementar sin exceder el stock disponible de cada llave
    if (sePuedeIncrementar) {
        nuevaListaMayor[index].cantidad += 10;
        nuevaListaMayor[index].precio = nuevaListaMayor[index].precioUnitario * nuevaListaMayor[index].cantidad;
        setListaMayor(nuevaListaMayor);
    } else {
        window.alert("NO QUEDAN SUFICIENTES PRODUCTOS DE ESTE TIPO");
        console.log("ERROR: No se puede incrementar, stock insuficiente.");
    }
};


    const menos10 = (a) => {
        for (let i = 0; i < 10; i++) {
            decrementarCantidad(a);
        }
    };

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: "blue", color: "white" }}>
                <tr style={{ backgroundColor: "blue" }}>
                    <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        Item
                    </th>
                    <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                        Cantidad
                    </th>
                    <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                        Precio
                    </th>
                    <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        Comentario
                    </th>
                    {/* <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Acciones
                    </th> */}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {ListaMayor.map((item, index) => (
                    <tr key={index}>
                        <td style={{ fontSize: "20px" }} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-lg">{item.textoOrden}</td>
                        <td style={{ fontSize: "22px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg">
                            <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => menos10(index)}>-10</button>
                            <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => decrementarCantidad(index)}>-1</button>

                            <span style={{ fontSize: "30px", color: "black" }} className="mx-2">{item.cantidad}</span>
                            <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => incrementarCantidad(index)}>+1  </button>
                            <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => mas10(index)}>    +10</button>
                        </td>
                        <td style={{ fontSize: "30px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg">${item.precio}</td>
                        <td style={{ fontSize: "20px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg">{item.comentario}</td>
                        {/* <td style={{ fontSize: "20px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg space-x-2">
                            <button style={{ fontSize: "26px" }} className="px-4 py-3 bg-red-500 text-white rounded-full" onClick={() => eliminarFila(index)}>Eliminar</button>
                            <button style={{ fontSize: "26px" }} className="px-4 py-3 bg-blue-500 text-white rounded-full" onClick={() => toggleComentario(index, '- Se entrego Empanada')}>Pan  <FontAwesomeIcon icon={faBreadSlice} /></button>
                            <button style={{ fontSize: "26px" }} className="px-4 py-3 bg-blue-500 text-white rounded-full" onClick={() => toggleComentario(index, '- Se entrego Postre')}>Postre  <FontAwesomeIcon icon={faIceCream} /></button>
                            <button style={{ fontSize: "26px" }} className="px-4 py-3 bg-blue-500 text-white rounded-full" onClick={() => toggleComentario(index, '- Se entrego Bebida')}>Bebida <FontAwesomeIcon icon={faWineBottle} /></button>
                        </td> */}
                        <td style={{ fontSize: "20px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg space-x-2">
                            <button style={{ fontSize: "26px" }} className="px-4 py-3 bg-red-500 text-white rounded-full" onClick={() => eliminarFila(index)}>Eliminar</button>
                            
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SelectedDataTableTT;
