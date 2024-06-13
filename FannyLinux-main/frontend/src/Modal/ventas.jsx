import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';


import { DataVentas } from '../funciones backend/consultas';
import { FaRegFile, FaIceCream, FaBreadSlice, FaMugHot, FaStar } from 'react-icons/fa'; // Importa los íconos desde React Icons

Modal.setAppElement('#root');

function ModalVentas() {
    const [data, setData] = useState([]);
    const [modalAbierto, setModalAbierto] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const datosMenu = await DataVentas();
                setData(datosMenu);
                console.log('Datos del menú obtenidos:', datosMenu);
            } catch (error) {
                console.error('Error al obtener y mostrar datos del menú:', error);
            }
        }
        fetchData();
    }, []);

    // Función para descargar un archivo CSV con los datos
    const descargarCSV = () => {
        const csvData = [
            ['ID', 'Pedido', 'Estado', 'Cantidad', 'Precio', 'Número de Orden', 'Fecha de Venta'], // Encabezados del CSV
            ...data.map(item => [
                item.id_venta,
                item.Pedido,
                item.Estado,
                item.Cantidad,
                item.Precio,
                item.NumeroOrden,
                formatDate(item.FechaVenta), // Formatear la fecha
                formatTime(item.FechaVenta) // Formatear la hora
            ]) // Datos del menú
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + csvData.map(row => row.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'datos.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año
        return `${day}/${month}/${year}`;
    };

    // Función para formatear la hora (hh:mm:ss)
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const abrirModal = () => {
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };


    return (
        <div >
            <button style={{ backgroundColor: "yellow", paddingTop: '3px' }} className="boton" onClick={abrirModal}><FaStar /> <br></br>VENTAS</button>
            <Modal isOpen={modalAbierto} onRequestClose={cerrarModal} style={customStyles}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={{ textAlign: "left" }} onClick={descargarCSV}>Descargar CSV</button>
        <button style={{ textAlign: "right" }} onClick={cerrarModal}>Cerrar Ventas</button>
    </div>
    <table style={{ width: '100%', border: "solid", marginTop: '5px' }}>
                    <thead style={{ border: "solid" }}>
                        <tr style={{ border: "solid" }}>
                            <th>ID</th>
                            <th>Pedido</th>
                            <th>Estado</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Número de Orden</th>
                            <th>Fecha de Venta</th>
                            <th>Hora de Venta</th>
                        </tr>
                    </thead>
                    <tbody style={{ border: "solid" }}>
                        {data.map(item => (
                            <tr key={item.id_venta} style={{ border: "solid" }}>
                                <td>{item.id_venta}</td>
                                <td>{item.Pedido}</td>
                                <td>{item.Estado}</td>
                                <td>{item.Cantidad}</td>
                                <td>{item.Precio}</td>
                                <td>{item.NumeroOrden}</td>
                                <td>{formatDate(item.FechaVenta)}</td>
                                <td>{formatTime(item.FechaVenta)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </Modal>
        </div>
    );
}

export default ModalVentas;



const customStyles = {
    content: {
        backgroundColor: "black", color: "yellow", border: "solid", bordercolor: "white",
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)', textAlign: "center"
    },
};