import React, { useState, useEffect, useRef } from 'react';
import { obtenerDatosSemana } from '../Consultas/GET/getDatosSemana';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';

const ButtonList = ({ handleSelectData, dayName }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [datosSemana, setDatosSemana] = useState([]);
    const buttonListRef = useRef(null); // Referencia al componente ButtonList

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                if (dayName) {
                    const datos = await obtenerDatosSemana();
                    setDatosSemana(datos.filter((dato) => dato.dia === dayName));
                }

                const data = await obtenerDatosMenu();
                const tiposPermitidos = [5, 6, 7, 8, 9, 13, 14];
                const filteredData = data.filter((item) => tiposPermitidos.includes(item.tipo));
                setDatosSemana((prevDatosSemana) => [...prevDatosSemana, ...filteredData]);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchDatos();
    }, [dayName, obtenerDatosSemana, obtenerDatosMenu]);

    useEffect(() => {
        const handleClick = (event) => {
            if (buttonListRef.current && !buttonListRef.current.contains(event.target)) {
                // Aquí puedes actualizar el estado o realizar alguna acción
                // Por ejemplo, puedes volver a obtener los datos
                fetchDatos();
            }
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const fetchDatos = async () => {
        try {
            const datos = await obtenerDatosSemana();
            if (dayName) {
                setDatosSemana(datos.filter((dato) => dato.dia === dayName));
            }
            const data = await obtenerDatosMenu();
            const tiposPermitidos = [5, 6, 7, 8, 9, 13, 14];
            const filteredData = data.filter((item) => tiposPermitidos.includes(item.tipo));
            setDatosSemana((prevDatosSemana) => [...prevDatosSemana, ...filteredData]);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    const handleOpenModal = (tipo) => {
        setSelectedTipo(tipo);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTipo(null);
    };

    const handleButtonClick = (dato) => {
        handleSelectData(dato);
    };

    const getUniqueButtons = (data) => {
        const seenIds = new Set();
        return data.filter(item => {
            if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                return true;
            }
            return false;
        });
    };

    const uniqueGeneralButtons = getUniqueButtons(datosSemana.slice(0, 9));
    const uniqueType3and12Buttons = getUniqueButtons(datosSemana.filter(dato => dato.tipo === 3 || dato.tipo === 12));
    const uniqueType6and13and14Buttons = getUniqueButtons(datosSemana.filter(dato => dato.tipo === 6 || dato.tipo === 13 || dato.tipo === 14));

    const tipoToTitle = {
        4: 'Empanadas ',
        5: 'Bebidas',
        7: 'Postres',
        8: 'Otro',
        9: 'Special'
    };

    return (
        <div style={{ fontSize: "18px" }} className="grid grid-cols-5 gap-2" ref={buttonListRef}>
            {uniqueGeneralButtons.map((dato) => (
                <button
                    key={dato.id}
                    onClick={() => handleButtonClick(dato)}
                    className="p-2 border rounded hover:bg-gray-200"
                    style={{ backgroundColor: "yellow", color: "black" }}
                >
                    {dato.nombre}<br></br>
                    {dato.stockG}
                    {dato.stockD}<br></br>
                </button>
            ))}

            {uniqueType3and12Buttons.map((dato) => (
                <button
                    key={dato.id}
                    onClick={() => handleButtonClick(dato)}
                    className="p-2 border rounded hover:bg-gray-200"
                    style={{ backgroundColor: "orange", color: "black" }}
                >
                    {dato.nombre}<br></br>
                    {dato.stockG}
                    {dato.stockD}<br></br>
                </button>
            ))}

            {uniqueType6and13and14Buttons.map((dato) => (
                <button
                    key={dato.id}
                    onClick={() => handleButtonClick(dato)}
                    className="p-2 border rounded hover:bg-gray-200"
                    style={{ backgroundColor: "lightgreen", color: "black" }}
                >
                    {dato.nombre}<br></br>
                    {dato.stockG}
                    {dato.stockD}<br></br>
                </button>
            ))}

            {[7, 5, 4, 8, 9].map((tipo) => (
                <button
                    key={tipo}
                    onClick={() => handleOpenModal(tipo)}
                    className="p-2 border rounded hover:bg-gray-200"
                    style={{
                        backgroundColor: tipo === 4 ? "purple" :
                            tipo === 5 ? "brown" :
                                tipo === 7 ? "teal" :
                                    tipo === 8 ? "gray" :
                                        tipo === 9 ? "indigo" : "lightgray",
                        color: "white",
                        fontSize:"25px"
                    }}
                >
                    {tipoToTitle[tipo]}
                    
                </button>
            ))}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div style={{backgroundColor:"black"}} className="bg-white border-2 border-white p-4 rounded">
                        <h2 className="text-xl font-bold">Items del tipo {tipoToTitle[selectedTipo]}</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {getUniqueButtons(datosSemana.filter(dato => dato.tipo === selectedTipo)).map((dato) => (
                                <button
                                    key={dato.id}
                                    onClick={() => handleButtonClick(dato)}
                                    className="p-2 border rounded hover:bg-gray-200"
                                    style={{
                                        backgroundColor:
                                            selectedTipo === 4 ? "purple" :
                                                selectedTipo === 5 ? "brown" :
                                                    selectedTipo === 7 ? "teal" :
                                                        selectedTipo === 8 ? "gray" :
                                                            selectedTipo === 9 ? "indigo" : "lightgray",
                                        color: "white",
                                        width: "100%",
                                    }}
                                >
                                    {dato.nombre}<br></br>
                                    {dato.stockG}
                                    {dato.stockD}<br></br>
                                </button>
                            ))}
                        </div>

                        <button onClick={handleCloseModal} className="mt-4 p-2 bg-cyan-500 text-white rounded">
                            Ok
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonList;




