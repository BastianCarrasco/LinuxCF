import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { agregarAlPedido } from '../partesOrden';
import { obtenerDatosMenu } from '../../../funciones backend/consultas';
import { FaRegFile, FaIceCream, FaBreadSlice, FaMugHot, FaStar } from 'react-icons/fa'; // Importa los íconos desde React Icons

Modal.setAppElement('#root');

function ModalSpecial() {
    const [datosSemana, setDatosSemana] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [DatosDiaYTipo, setDatosDiaYTipo] = useState([]); // Estado para almacenar los datos filtrados por día y tipo
    const [DatosMenu, setDatosMenu] = useState([]);


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

    const obtenerDiaActual = () => {
        const hoy = new Date();
        const dia = hoy.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase(); // Obtener el nombre completo del día en español
        return dia;
    };
    const diaActual = obtenerDiaActual();


    const datosOtro = DatosMenu.filter(item => item.tipo === 9).map(item => ({ ...item, id: item.id }));




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
        <div >
            <button  style={{ backgroundColor: "yellow", paddingTop: '3px' }} className="boton"   onClick={abrirModal}>   <FaStar /> <br></br>SPECIAL</button>
            <Modal  isOpen={modalAbierto} onRequestClose={cerrarModal} style={customStyles}>
                <div >
                    <h2>Special</h2>
                    <div style={{ textAlign: "left" }}>
                        <div className="botones-container-caja" style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {datosOtro.map(item => (
                                <button key={item.id} onClick={() => handleClick(item)} className="boton" style={{ paddingTop: '3px' }}>
                                    {item.nombre}<br />{item.stockG}
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

export default ModalSpecial;



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