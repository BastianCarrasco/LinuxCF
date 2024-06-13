import React, { useEffect, useState } from 'react';
import { obtenerDatosSemana, obtenerDatosMenu } from '../../funciones backend/consultas';
import { agregarAlPedido, imprimirVariables, ListaPedido } from './partesOrden';
import { FaRegFile, FaIceCream, FaBreadSlice, FaMugHot, FaStar } from 'react-icons/fa'; // Importa los íconos desde React Icons
import ModalEmpanadas from './modales caja/ModalEmpanadas';
import ModalPostres from './modales caja/ModalPostres';
import ListaBebidas from './listacajaBebida';
import ModalSpecial from './modales caja/ModalSpecial';
import ModalOtro from './modales caja/ModalOtro';
import Modal from 'react-modal';

function Botones() {
    const [datosSemana, setDatosSemana] = useState([]);
    const [datosMenu, setDatosMenu] = useState([]);
    const [pedido, setPedido] = useState([]); // Arreglo para guardar los datos seleccionados
    const [modalAbierto, setModalAbierto] = useState(false); // Estado del modal de las Empanadas



    const abrirModalBebidas = () => {
        setModalAbierto(true);
    };

    // Función para cerrar el modal de bebidas
    const cerrarModalBebidas = () => {
        setModalAbierto(false);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await obtenerDatosSemana();
                setDatosSemana(data);
            } catch (error) {
                console.error('Error al obtener datos de la semana:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await obtenerDatosMenu();
                setDatosMenu(data);
            } catch (error) {
                console.error('Error al obtener datos de la semana:', error);
            }
        };

        fetchData();
    }, []);

    // Función para obtener el día actual y su valor numérico
    const obtenerDiaActual = () => {
        const hoy = new Date();
        let dia = hoy.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase(); // Obtener el nombre completo del día en español

        // Si es domingo, ajustar el día para que sea lunes
        if (dia === 'DOMINGO') {
            dia = 'LUNES';
        }

        return dia;
    };


    // Obtener el día actual
    const diaActual = obtenerDiaActual();

    // Filtrar los datos de la semana para mostrar solo los del día actual
    const datosDiaActual = datosSemana.filter(item => item.dia === diaActual).slice(0, 9); // Mostrar solo los primeros 9 elementos
    const datosPapas = datosSemana.filter(item => item.dia === diaActual).slice(9, 11); // Mostrar solo los primeros 9 elementos
    const datosEnsalada = datosMenu.filter(item => [36, 33, 24].includes(item.id));
    const datosBebidas = datosMenu.filter(item => [5].includes(item.tipo));

    // Función para manejar el evento onClick del botón
    const handleClick = (item) => {
        setPedido([...pedido, item]); // Agregar el item al arreglo pedido
        agregarAlPedido(item);
    };

    useEffect(() => {
        imprimirVariables();
    }, [pedido]);

    return (
        <div style={{ textAlign: "center" }}>
            <div className="botones-container-caja" style={{ display: 'flex', flexWrap: 'wrap', textAlign:"center" }}>
                {datosDiaActual.map(item => (
                    <button key={item.id} onClick={() => handleClick(item)} className="boton" style={{ paddingTop: '3px' }}>
                        {item.nombre}<br />{item.stockD}
                    </button>
                ))}

                {datosPapas.map(item => (
                    <button key={item.id} onClick={() => handleClick(item)} className="boton" style={{ backgroundColor: "orange", paddingTop: '3px' }}>
                        {item.nombre}<br />{item.stockD}
                    </button>
                ))}

                {datosEnsalada.map(item => (
                    <button key={item.id} onClick={() => handleClick(item)} className="boton" style={{ backgroundColor: "lightgreen", paddingTop: '3px' }}>
                        {item.nombre}<br />{item.stockG}
                    </button>
                ))}
                <button onClick={abrirModalBebidas} className="boton" style={{ backgroundColor: "lightblue", paddingTop: '3px' }}>
                    Bebidas
                </button>

                {/* Modal de bebidas */}
                <Modal
                    isOpen={modalAbierto}
                    onRequestClose={cerrarModalBebidas}
                    style={{
                        overlay: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        content: {
                            backgroundColor: 'black',
                            padding: '20px',
                            borderRadius: '5px',
                            width: '150%', // Ocupa todo el ancho
                            height: '150%', // Ocupa todo el alto
                            maxWidth: '80%',
                            maxHeight: '80%',
                            overflow: 'auto'
                        }
                    }}
                >
                    <div className="modal-body" style={{textAlign:"center" }}>
                        {/* Botones para bebidas */}
                        <div>
                            <h3>Bebidas</h3>
                            {datosBebidas.filter(item => item.nombre.includes("Bebida")).map(item => (
                                <button key={item.id} onClick={() => handleClick(item)} className="boton" style={{ paddingTop: '3px' }}>
                                    {item.nombre}<br />{item.stockG}
                                </button>
                            ))}
                        </div>
                        {/* Botones para latas */}
                        <div>
                            <h3>Latas</h3>
                            {datosBebidas.filter(item => item.nombre.includes("Lata")).map(item => (
                                <button key={item.id} onClick={() => handleClick(item)} className="boton" style={{ paddingTop: '3px' }}>
                                    {item.nombre}<br />{item.stockG}
                                </button>
                            ))}
                        </div>
                        {/* Botones para otros */}
                        <div>
                            <h3>Otros</h3>
                            {datosBebidas.filter(item => !item.nombre.includes("Bebida") && !item.nombre.includes("Lata")).map(item => (
                                <button key={item.id} onClick={() => handleClick(item)} className="boton" style={{ paddingTop: '3px' }}>
                                    {item.nombre}<br />{item.stockG}
                                </button>
                            ))}
                        </div>

                        <ListaBebidas />

                        <button className='cancelar'   style={{ marginTop: '10px' }} onClick={cerrarModalBebidas}>Cerrar</button>

                    </div>

                </Modal>
                <ModalEmpanadas />
                <ModalPostres />
                <ModalSpecial />
                <ModalOtro />
                {/* Botones de los modales */}



            </div>
        </div>
    );
}

export default Botones;