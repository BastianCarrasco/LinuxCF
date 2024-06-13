import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { obtenerDatosSemana } from '../../../funciones backend/consultas';
import { FaBreadSlice } from 'react-icons/fa'; // Importa el ícono de React Icons
import { agregarAlPedido } from '../partesOrden';

Modal.setAppElement('#root');

function ModalEmpanadas() {
    const [datosSemana, setDatosSemana] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [datosDiaYTipo, setDatosDiaYTipo] = useState([]); // Estado para almacenar los datos filtrados por día y tipo

    const obtenerDiaActual = () => {
        const hoy = new Date();
        const dia = hoy.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase(); // Obtener el nombre completo del día en español
        return dia;
    };
    const diaActual = obtenerDiaActual();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await obtenerDatosSemana();
                setDatosSemana(data);

                // Filtrar los datos por día y tipo
                const datosFiltrados = data.filter(item => item.dia === diaActual && item.tipo === 4);
                setDatosDiaYTipo(datosFiltrados);
            } catch (error) {
                console.error('Error al obtener datos de la semana:', error);
            }
        };

        fetchData();
    }, [diaActual]);

    const abrirModal = () => {
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };

    const handleClick = (item) => {
        agregarAlPedido(item);
    };

    return (
        <div>
            <button style={{ backgroundColor: "yellow", paddingTop: '3px' }} className="boton" onClick={abrirModal}>
                <FaBreadSlice /> <br />EMPANADAS
            </button>
            <Modal isOpen={modalAbierto} onRequestClose={cerrarModal} style={customStyles}>
                <div>
                    <h2>EMPANADAS</h2>
                    <div style={{ textAlign: "left" }}>
                        <div className="botones-container-caja" style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {datosDiaYTipo.map(item => (
                                <button key={item.id} onClick={() => handleClick(item)} className="boton" style={{ paddingTop: '3px' }}>
                                    {item.nombre}<br />{item.stockD}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className='cancelar'   style={{ marginTop: '10px' }} onClick={cerrarModal}>Cerrar</button>
                </div>
            </Modal>
        </div>
    );
}

export default ModalEmpanadas;

// Estilos personalizados para el modal
const customStyles = {
    content: {
        backgroundColor:"black",color:"yellow", border:"solid", bordercolor:"white",
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)', textAlign:"center"
    },
};




