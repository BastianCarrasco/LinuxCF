import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { obtenerDatosMenu, actualizarSemana } from '../../funciones backend/consultas'; // Ajusta la ruta según la ubicación de tu archivo de funciones

Modal.setAppElement('#root');

function SelecionMenuSemana() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [buttonPressedFrom, setButtonPressedFrom] = useState('');
    const [datosMenu, setDatosMenu] = useState([]);
    const [botonesApretados, setBotonesApretados] = useState({});
    const [diaSeleccionado, setDiaSeleccionado] = useState('LUNES');


   

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await obtenerDatosMenu();
                console.log('Datos del menú:', data);
                // Filtrar los datos para mostrar solo los del tipo 1, 2 y 10
                const filteredData = data.filter(item => [1, 2, 10].includes(item.tipo));
                setDatosMenu(filteredData);
            } catch (error) {
                console.error('Error al obtener datos del menú:', error);
            }
        };

        fetchData();
    }, []); // El array vacío como segundo argumento de useEffect asegura que se ejecute solo una vez al montar el componente

    const openModal = (buttonFrom) => {
        setButtonPressedFrom(buttonFrom);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);


    };

    const handleButtonClick = (nombre, id, dia) => {
        const maxItemsPerDay = 7;
    
        // Mapear los nombres de los días a sus números correspondientes
        const diasNumeros = {
            LUNES: 1,
            MARTES: 2,
            MIÉRCOLES: 3,
            JUEVES: 4,
            VIERNES: 5,
            SÁBADO: 6
        };
    
        // Verificar si ya se han seleccionado 7 elementos para el día actual
        if (botonesApretados[dia] && botonesApretados[dia].length >= maxItemsPerDay) {
            console.log(`Ya hay ${maxItemsPerDay} elementos seleccionados para el día ${dia}.`);
            return;
        }
    
        // Verificar si ya hay un día siguiente disponible
        const nextDayIndex = (diasSemana.indexOf(dia) + 1) % 7;
        const nextDay = diasSemana[nextDayIndex];
    
        // Si el día siguiente está lleno, no permitir agregar más elementos al día actual
        if (botonesApretados[nextDay] && botonesApretados[nextDay].length >= maxItemsPerDay) {
            console.log(`El día siguiente (${nextDay}) también ha alcanzado el límite de ${maxItemsPerDay} elementos.`);
            return;
        }
    
        // Si no se ha alcanzado el límite de 7 elementos para el día actual, agregar el botón normalmente
        if (botonesApretados[dia] && botonesApretados[dia].find(btn => btn.id === id)) {
            // Si el botón ya está seleccionado, lo eliminamos del arreglo
            setBotonesApretados(prevState => ({
                ...prevState,
                [dia]: prevState[dia].filter(btn => btn.id !== id)
            }));
        } else {
            // Si el botón no está seleccionado, lo agregamos al arreglo con la posición correspondiente
            const newPosition = botonesApretados[dia] ? botonesApretados[dia].length + 1 : 1;
            setBotonesApretados(prevState => ({
                ...prevState,
                [dia]: [...(prevState[dia] || []), { nombre, id, position: newPosition, id_dia: diasNumeros[dia] }]
            }));
    
            // Llamar a actualizarSemana después de actualizar botonesApretados
            actualizarSemana(newPosition, diasNumeros[dia], id)
                .then(data => {
                    console.log('Respuesta del servidor:', data);
                    // Hacer algo con la respuesta, si es necesario
                })
                .catch(error => {
                    console.error('Error al actualizar la semana:', error);
                    // Manejar el error, si es necesario
                });
        }
    };
    





    // Array de nombres de días de la semana
    const diasSemana = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

    return (
        <div>
            <button style={{backgroundColor:"yellow"}} onClick={() => openModal('Dato que quieres pasar')}>Editar Semana</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Ejemplo de Modal"
                style={{
                    overlay: {
                      backgroundColor: 'rgba(0, 0, 0, 0.5)' // Fondo semitransparente negro para el modal
                    },
                    content: {
                      backgroundColor: 'black', // Fondo negro para el contenido del modal
                      color: 'white', // Texto blanco para el contenido del modal
                      width: '70%', // Ancho del modal (puedes ajustar según tus necesidades)
                      margin: 'auto', // Centrar el modal horizontalmente en la pantalla
                      border:"solid"
                    }
                  }}
            >
                <h2>{diaSeleccionado}</h2>

                {/* Fila de botones con los días de la semana */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    {diasSemana.map(dia => (
                        <button
                            key={dia}
                            style={{ marginRight: '10px' }}
                            onClick={() => setDiaSeleccionado(dia)}
                        >
                            {dia}
                        </button>
                    ))}
                </div>
                {/* Renderizar los botones filtrados según el tipo y el día seleccionado */}
                <ul style={{ textAlign: "center" }}> <h3>Proteina</h3>{datosMenu.map(item => {
                    if ([1].includes(item.tipo) && item.id!=1) {
                        return (
                            <button
                                key={item.nombre}
                                className={botonesApretados[diaSeleccionado] && botonesApretados[diaSeleccionado].find(btn => btn.id === item.id) ? 'boton-apretado' : 'boton-original'}
                                onClick={() => handleButtonClick(item.nombre, item.id, diaSeleccionado)}
                            >
                                {item.nombre}
                            </button>

                        );
                    } else {
                        return null;
                    }
                })}</ul>


                <ul style={{ textAlign: "center" }}> <h3>Acompañamiento</h3>  {datosMenu.map(item => {
                    if ([2].includes(item.tipo) && item.id!=27) {
                        return (
                            <button
                                key={item.nombre}
                                className={botonesApretados[diaSeleccionado] && botonesApretados[diaSeleccionado].find(btn => btn.id === item.id) ? 'boton-apretado' : 'boton-original'}
                                onClick={() => handleButtonClick(item.nombre, item.id, diaSeleccionado)}
                            >
                                {item.nombre}
                            </button>

                        );
                    } else {
                        return null;
                    }
                })}</ul>


                <ul style={{ textAlign: "center" }}><h3>Guiso</h3> {datosMenu.map(item => {
                    if ([10].includes(item.tipo)) {
                        return (
                            <button
                                key={item.nombre}
                                className={botonesApretados[diaSeleccionado] && botonesApretados[diaSeleccionado].find(btn => btn.id === item.id) ? 'boton-apretado' : 'boton-original'}
                                onClick={() => handleButtonClick(item.nombre, item.id, diaSeleccionado)}
                            >
                                {item.nombre}
                            </button>

                        );
                    } else {
                        return null;
                    }
                })}</ul>

                <br />

                <button onClick={closeModal}>Cerrar Menu</button>
            </Modal>

            {/* Imprimir la data JSON de los botones apretados */}
            {/* <pre>{JSON.stringify(botonesApretados, null, 2)}</pre> */}
        </div>
    );
}

export default SelecionMenuSemana;








