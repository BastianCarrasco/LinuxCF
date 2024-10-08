import React, { useEffect, useState } from 'react';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import { actualizarIdSemana } from '../Consultas/UPDATE/editarIdsemana';
import { actualizarStockSemana } from '../Consultas/UPDATE/editarStockSemana';
import { actualizarStockGlobal } from '../Consultas/UPDATE/sumarStockGlobal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { actualizarEmergencia } from '../Consultas/UPDATE/semanaEmergencia';
const TablaDia = ({ dia, datosSemana }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState('');
    const [botonesSeleccionados, setBotonesSeleccionados] = useState([]);
    const [valorInputs, setValorInputs] = useState({});
    const [datosMenu, setDatosMenu] = useState([]);
    const [datosSemanaFiltrados, setDatosSemanaFiltrados] = useState([]);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [itemSeleccionado, setItemSeleccionado] = useState(null);
    const [numeroIngresado, setNumeroIngresado] = useState('');
    const [index, setindex] = useState(0);

    const ejecutarActualizacion = async () => {
        try {
            const resultado = await actualizarStockGlobal();
            console.log('Resultado de la actualización:', resultado);
        } catch (error) {
            console.error('Error al ejecutar la actualización:', error);
        }

        window.location.reload(); // Recargar la página una vez completada la actualización
    };

    const abrirModal2 = (item, index) => {
        setindex(index)
        setItemSeleccionado(item);
        setModalOpen2(true);
        console.log(item)
        console.log(index)

    };

    useEffect(()=>{console.log(itemSeleccionado),[itemSeleccionado]})

    const cerrarModal2 = () => {
        setModalOpen2(false);
        setItemSeleccionado(null);
        setNumeroIngresado('');
    };

    const manejarActualizacion = async () => {
        if (itemSeleccionado && numeroIngresado) {
            try {
                // Llamar a la función actualizarEmergencia con id_semana y el nuevo stockD

                const resultado = await actualizarEmergencia(
                    itemSeleccionado.id_semana,
                    parseInt(numeroIngresado, 10)
                  );

                console.log('Stock actualizado:', resultado);

                // Recargar la página después de la actualización exitosa
                window.location.reload();
            } catch (error) {
                console.error('Error al actualizar el stock:', error);
            }
        } else {
            // Mostrar un mensaje si no se ha ingresado un número válido
            alert("Por favor ingrese un número válido y seleccione un item.");
        }
    };




    function actualizarDias() {
        handleActualizarIdSemana()
            .then(() => {
                handleActualizarStockSemana();
            })
            .catch(error => {
                console.error('Error al actualizar los días:', error);
                // Maneja el error según sea necesario
            });
    }


    async function handleActualizarIdSemana() {
        try {
            // Definir un mapa de días a números para la ubicación
            const diasNumeros = {
                LUNES: 1,
                MARTES: 2,
                MIÉRCOLES: 3,
                JUEVES: 4,
                VIERNES: 5,
                SÁBADO: 6
            };

            // Obtener el número correspondiente al día seleccionado
            const numeroDia = diasNumeros[diaSeleccionado];

            // Iterar sobre los botones seleccionados
            for (let i = 0; i < botonesSeleccionados.length; i++) {
                const elemento = botonesSeleccionados[i];
                const p_id_dia = numeroDia; // Obtener el número de día según la selección
                const p_nuevo_id_menu = elemento; // Usar el elemento actual de botonesSeleccionados
                const p_numero = i + 1; // Obtener la ubicación del dato + 1

                // Llamar a la función para actualizar el ID de semana
                const resultado = await actualizarIdSemana(p_id_dia, p_nuevo_id_menu, p_numero);
                console.log(`Resultado de la actualización para ${diaSeleccionado}, elemento ${elemento}:`, resultado);

                // Aquí puedes manejar la respuesta, actualizar el estado de tu aplicación, etc.
            }
        } catch (error) {
            console.error('Error al actualizar ID de semana:', error);
            // Manejar el error según sea necesario
        }
    }

    async function handleActualizarStockSemana() {
        try {
            const diasNumeros = {
                LUNES: 1,
                MARTES: 2,
                MIÉRCOLES: 3,
                JUEVES: 4,
                VIERNES: 5,
                SÁBADO: 6
            };

            const p_id_dia = diasNumeros[diaSeleccionado];

            for (const itemId of Object.keys(valorInputs)) {
                const p_id_menu = parseInt(itemId, 10);
                const p_stockD = parseInt(valorInputs[itemId], 10);

                const resultado = await actualizarStockSemana(p_id_dia, p_id_menu, p_stockD);
                console.log(`Resultado de la actualización de stock para ${diaSeleccionado}, elemento ${itemId}:`, resultado);
            }

            ejecutarActualizacion();


        } catch (error) {
            console.error('Error al actualizar el stock de la semana:', error);
            // Manejar el error según sea necesario
        }
    }

    // useEffect(() => {
    //     console.log(botonesSeleccionados);
    //     console.log('Valor de inputs:', valorInputs);
    //     console.log(diaSeleccionado);
    // })

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const menuData = await obtenerDatosMenu();
                const filteredMenuData = menuData.filter(item => item.id !== 1 && item.id !== 27);
                setDatosMenu(filteredMenuData);
            } catch (error) {
                console.error('Error al obtener datos del menú:', error);
            }
        };

        fetchMenuData();
    }, []);

    useEffect(() => {
        const filteredSemanaData = datosSemana.filter(item => item.id_dia === Number(diaSeleccionado)).slice(7);
        setDatosSemanaFiltrados(filteredSemanaData);
    }, [diaSeleccionado, datosSemana]);

    const obtenerDatosDia = (dia) => {
        return datosSemana.filter(item => item.dia === dia).slice(7); // Ignorar los primeros 7 items
    };
    const obtenerDatosDiaTodo = (dia) => {
        return datosSemana.filter(item => item.dia === dia); // Ignorar los primeros 7 items
    };

    const openModal = (dia) => {
        setDiaSeleccionado(dia);
        setModalOpen(true);

    };

    const closeModal = () => {
        setModalOpen(false);
        setBotonesSeleccionados([]);
        setValorInputs({});

    };

    const handleClick = (item) => {
        if (botonesSeleccionados.includes(item.id)) {
            setBotonesSeleccionados(botonesSeleccionados.filter(id => id !== item.id));
        } else if (botonesSeleccionados.length < 7) {
            setBotonesSeleccionados([...botonesSeleccionados, item.id]);
        }

    };

    const handleInputChange = (itemId, value) => {
        setValorInputs(prevState => ({
            ...prevState,
            [itemId]: value
        }));

    };

    const datosMenuPorTipo = datosMenu.reduce((acc, item) => {
        if (!acc[item.tipo]) {
            acc[item.tipo] = [];
        }
        acc[item.tipo].push(item);
        return acc;
    }, {});

    const tiposFiltrados = [1, 2, 10];

    return (
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/6 px-2 mb-8">
            <h2 className="text-xl font-semibold mb-2">{dia}</h2>
            <button
                className="bg-yellow-500 text-white px-10 py-2 rounded-lg mb-4"
                onClick={() => openModal(dia)}
                style={{ fontSize: "16px" }}
            >
                Ver opciones
            </button>
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-90">
                    <div className="bg-black p-6 rounded-lg shadow-lg max-w-8xl w-full grid grid-cols-3 gap-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-white">Selecciona opciones</h2>
                            {Object.entries(datosMenuPorTipo).map(([tipo, items]) => (
                                tiposFiltrados.includes(Number(tipo)) && (
                                    <div key={tipo} className="mb-4">
                                        <h3 className="text-lg font-semibold mb-2 text-white">Tipo {tipo}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {items.map(item => (
                                                <button
                                                    key={item.id}
                                                    className={`px-4 py-2 rounded-lg ${botonesSeleccionados.includes(item.id) ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}
                                                    onClick={() => handleClick(item)}
                                                    style={{ fontSize: '20px' }}
                                                >
                                                    {item.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        <div style={{ fontSize: '20px' }}>
                            <h2 className="text-xl font-semibold mb-4 text-white">Elementos seleccionados</h2>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-700 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Nombre</th>
                                        <th className="px-6 py-3 text-left">Valor</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-500 divide-y divide-gray-600">
                                    {botonesSeleccionados.map(itemId => (
                                        <tr key={itemId}>
                                            <td className="px-6 py-4">{datosMenu.find(item => item.id === itemId)?.nombre}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={valorInputs[itemId] || ''}
                                                    onChange={(e) => handleInputChange(itemId, e.target.value)}
                                                    className="w-24 px-2 py-1 bg-gray-300 rounded"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ fontSize: '20px' }}>
                            <h2 className="text-xl font-semibold mb-4 text-white">Datos del Día {diaSeleccionado}</h2>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-700 text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left">Nombre</th>
                                        <th className="px-6 py-3 text-left">Stock</th>
                                        <th className="px-6 py-3 text-left">Input</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-gray-500 divide-y divide-gray-600">
                                    {obtenerDatosDia(diaSeleccionado).map(item => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4">{item.nombre}</td>
                                            <td className="px-6 py-4">{item.stockD}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={valorInputs[item.id] || ''}
                                                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                    className="w-24 px-2 py-1 bg-gray-300 rounded"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ fontSize: '20px' }} className="col-span-3 flex justify-between items-center mt-4">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-200"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                onClick={actualizarDias}
                            >
                                Actualizar
                            </button>
                        </div>

                    </div>
                </div>
            )}


            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-700 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left">Nombre</th>
                        <th className="px-6 py-3 text-left">Stock</th>
                        {/* <th className="px-6 py-3 text-left">Editar</th> */}

                    </tr>
                </thead>
                <tbody style={{ fontSize: "19px" }} className="bg-gray-500 divide-y divide-gray-600">
                {obtenerDatosDiaTodo(dia).map((item, index) => (
    <tr key={item.id}>
        <td className="px-6 py-4">{item.nombre}</td>
        <td className="px-6 py-4">{item.stockD}</td>
        <td className="px-6 py-4">
            <button
                onClick={() => abrirModal2(item, index)} // Pasas item e index
                className="bg-green-500 text-white px-4 py-2 rounded ml-2"
            >
                <FontAwesomeIcon icon={faReceipt} />
            </button>
        </td>
    </tr>
))}
            </tbody>
            </table>

            {modalOpen2 && (
    <div style={{ color: "black", fontSize: "26px", border: "solid", borderBlockColor: "black" }} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-5">
            <h1 className="text-xl font-bold">Detalles del Elemento</h1>

            <p><strong>Nombre:</strong> {itemSeleccionado.nombre}</p>

            <label htmlFor="numero">Ingrese un número:</label>
            <input
                type="number"
                id="numero"
                value={numeroIngresado}
                onChange={(e) => setNumeroIngresado(e.target.value)}
                className="border p-2 mt-2 w-full"
            />

            <div className="flex justify-between mt-4"> {/* Cambiado a justify-between para separar los botones */}
                <button onClick={cerrarModal2} className="bg-red-500 text-white p-2 rounded">Cerrar</button> {/* Fondo rojo con texto blanco */}
                <button onClick={manejarActualizacion} className="bg-blue-500 text-white p-2 rounded">Actualizar Stock</button> {/* Fondo azul con texto blanco */}
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default TablaDia;
