import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBreadSlice, faIceCream, faWineBottle } from '@fortawesome/free-solid-svg-icons';


const SelectedDataTable = ({ ListaMayor, incrementarCantidad, decrementarCantidad, eliminarFila, toggleComentario }) => {

    function mas10(a) {
        let i = 0;
        for (i; i < 10; i++) {
            incrementarCantidad(a)
        };

    }

    function menos10(a) {
        let i = 0;
        for (i; i < 10; i++) {
            decrementarCantidad(a)
        };

    }

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead style={{ backgroundColor: "blue", color: "white" }}>
                <tr style={{ backgroundColor: "blue" }}>
                    <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        Item
                    </th>
                    <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                        Cantidad
                    </th>
                    <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                        Precio
                    </th>
                    <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        Comentario
                    </th>
                    <th style={{ fontSize: "20px", color: "white" }} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {ListaMayor.map((item, index) => (
                    <tr key={index}>
                        <td style={{ fontSize: "20px" }} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-lg">{item.textoOrden}</td>
                        <td style={{ fontSize: "22px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg">
                            <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => menos10(index)}>-10</button>
                            <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => decrementarCantidad(index)}>-1</button>

                            <span style={{ fontSize: "30px", color: "black" }} className="mx-2">{item.cantidad}</span>
                            <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => incrementarCantidad(index)}>+1  </button>
                            <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => mas10(index)}>    +10</button>
                        </td>
                        <td style={{ fontSize: "30px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg">${item.precio}</td>
                        <td style={{ fontSize: "20px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg">{item.comentario}</td>
                        <td style={{ fontSize: "20px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg space-x-2">
                            <button style={{ fontSize: "26px" }} className="px-4 py-3 bg-red-500 text-white rounded-full" onClick={() => eliminarFila(index)}>Eliminar</button>
                            <button style={{ fontSize: "26px" }} className="px-4 py-3 bg-blue-500 text-white rounded-full" onClick={() => toggleComentario(index, '- Se entrego Empanada')}>Pan  <FontAwesomeIcon icon={faBreadSlice} /></button>
                            <button style={{ fontSize: "26px" }} className="px-4 py-3 bg-blue-500 text-white rounded-full" onClick={() => toggleComentario(index, '- Se entrego Postre')}>Postre  <FontAwesomeIcon icon={faIceCream} /></button>
                            <button style={{ fontSize: "26px" }} className="px-4 py-3 bg-blue-500 text-white rounded-full" onClick={() => toggleComentario(index, '- Se entrego Bebida')}>Bebida <FontAwesomeIcon icon={faWineBottle} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SelectedDataTable;
