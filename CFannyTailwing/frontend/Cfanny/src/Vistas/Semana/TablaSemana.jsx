import React, { useEffect, useState } from 'react';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';
import { obtenerDatosSemana } from '../Consultas/GET/getDatosSemana';
import { actualizarIdSemana } from '../Consultas/UPDATE/editarIdsemana';

const TablaDia = ({ dia, datosSemana }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState('');
    const [botonesSeleccionados, setBotonesSeleccionados] = useState([]);
    const [valorInputs, setValorInputs] = useState({});
    const [datosMenu, setDatosMenu] = useState([]);
    const [datosSemanaFiltrados, setDatosSemanaFiltrados] = useState([]);


    function actualizarDias() {
        handleActualizarIdSemana()
          .then(() => {
            window.location.reload(); // Recarga la página una vez completada la actualización
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
                MIERCOLES: 3,
                JUEVES: 4,
                VIERNES: 5,
                SABADO: 6
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





    useEffect(() => {
        console.log(botonesSeleccionados);
        console.log('Valor de inputs:', valorInputs);
        console.log(diaSeleccionado);
    })

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
                    <div className="bg-black p-6 rounded-lg shadow-lg max-w-6xl w-full grid grid-cols-3 gap-4">
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
                                                >
                                                    {item.nombre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        <div>
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

                        <div>
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

                        <div className="col-span-3 flex justify-between items-center mt-4">
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
                    </tr>
                </thead>
                <tbody style={{ fontSize: "19px" }} className="bg-gray-500 divide-y divide-gray-600">
                    {obtenerDatosDiaTodo(dia).map(item => (
                        <tr key={item.id}>
                            <td className="px-6 py-4">{item.nombre}</td>
                            <td className="px-6 py-4">{item.stockD}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablaDia;
