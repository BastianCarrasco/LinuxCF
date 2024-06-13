import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import { obtenerDatosSemana } from '../../../funciones backend/consultas';
import { FaMugHot } from 'react-icons/fa'; // Importa solo el ícono que se usa en este componente

Modal.setAppElement('#root');

function ModalBebidas() {
    const [datosSemana, setDatosSemana] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

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

    const abrirModal = () => {
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };

    const customStyles = {
        content: {
            backgroundColor: 'black',
            color: 'yellow',
            border: 'solid',
            borderColor: 'white',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
        },
        cancelButton: {
            marginTop: '10px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer'
        }
    };

    return (
        <div>
            <button className="boton" onClick={abrirModal}>
                <FaMugHot /> <br />BEBIDAS
            </button>
            <Modal className="modal" isOpen={modalAbierto} onRequestClose={cerrarModal} style={customStyles}>
                <div>
                    {datosSemana ? (
                        <div>
                            {datosSemana.filter(item => item.tipo === 5).map(item => (
                                <p key={item.id}>Datos de la semana: {JSON.stringify(item)}</p>
                            ))}
                            <button style={customStyles.cancelButton} onClick={cerrarModal}>
                                Cerrar
                            </button>
                        </div>
                    ) : (
                        <p>Cargando...</p>
                    )}
                </div>
            </Modal>
        </div>
    );
}

export default ModalBebidas;
