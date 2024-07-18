import React, { useState } from 'react';

const ButtonList = ({ datosSemana, handleSelectData }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedTipo, setSelectedTipo] = useState(null);

    const handleOpenModal = (tipo) => {
        setSelectedTipo(tipo);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTipo(null);
    };

    return (
        <div style={{ fontSize: "18px" }} className="grid grid-cols-5 gap-2">
            {datosSemana.slice(0, 9).map((dato, index) => (
                <button
                    key={index}
                    onClick={() => handleSelectData(dato)}
                    className="p-2 border rounded hover:bg-gray-200"
                    style={{ backgroundColor: "yellow", color: "black" }}
                >
                    {dato.nombre}<br></br>
                    {dato.stockG}
                    {dato.stockD}
                </button>
            ))}
            <br></br>

            {datosSemana.filter(dato => dato.tipo === 3 || dato.tipo === 12).map((dato, index) => (
                <button
                    key={index}
                    onClick={() => handleSelectData(dato)}
                    className="p-2 border rounded hover:bg-gray-200"
                    style={{ backgroundColor: "orange", color: "black" }}
                >
                    {dato.nombre}<br></br>
                    {dato.stockG}
                    {dato.stockD}
                </button>
            ))}
            {datosSemana.filter(dato => dato.tipo === 6 || dato.tipo === 13 || dato.tipo === 14).map((dato, index) => (
                <button
                    key={index}
                    onClick={() => handleSelectData(dato)}
                    className="p-2 border rounded hover:bg-gray-200"
                    style={{ backgroundColor: "lightgreen", color: "black" }}
                >
                    {dato.nombre}<br></br>
                    {dato.stockG}
                    {dato.stockD}
                </button>
            ))}

            {[4, 5, 7, 8, 9].map((tipo, index) => (
                <button
                    key={index}
                    onClick={() => handleOpenModal(tipo)}
                    className="p-2 border rounded hover:bg-gray-200"
                    style={{
                        backgroundColor: tipo === 4 ? "purple" :
                            tipo === 5 ? "brown" :
                                tipo === 7 ? "teal" :
                                    tipo === 8 ? "gray" :
                                        tipo === 9 ? "indigo" : "lightgray",
                        color: "black"
                    }}
                >
                    {tipo === 4 && 'Empanadas'}
                    {tipo === 5 && 'Bebidas'}
                    {tipo === 7 && 'Postre'}
                    {tipo === 8 && 'Otro'}
                    {tipo === 9 && 'Special'}
                </button>
            ))}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div style={{backgroundColor:"black"}} className="bg-white border-2 border-white p-4 rounded">
                        <h2 className="text-xl font-bold">Items del tipo {selectedTipo}</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {datosSemana
                                .filter(dato => dato.tipo === selectedTipo)
                                .map((dato, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectData(dato)}
                                        className="p-2 border rounded hover:bg-gray-200"
                                        style={{
                                            backgroundColor:
                                                selectedTipo === 4 ? "purple" :
                                                    selectedTipo === 5 ? "brown" :
                                                        selectedTipo === 7 ? "teal" :
                                                            selectedTipo === 8 ? "gray" :
                                                                selectedTipo === 9 ? "indigo" : "lightgray",
                                            color: "white",
                                            width: "100%", // Asegura que los botones ocupen todo el ancho disponible
                                        }}
                                    >
                                        {dato.nombre}<br></br>
                                        {dato.stockG}
                                        {dato.stockD}
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
