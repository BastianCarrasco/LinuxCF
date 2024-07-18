import React from 'react';

const SelectedDataTable = ({ ListaMayor, incrementarCantidad, decrementarCantidad, eliminarFila, toggleComentario }) => {
  return (
    <table  className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th style={{fontSize:"20px"}} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
            Item
          </th>
          <th style={{fontSize:"20px"}} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
            Cantidad
          </th>
          <th style={{fontSize:"20px"}} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
            Precio
          </th>
          <th style={{fontSize:"20px"}} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
            Comentario
          </th>
          <th style={{fontSize:"20px"}} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {ListaMayor.map((item, index) => (
          <tr key={index}>
            <td style={{fontSize:"20px"}} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-lg">{item.textoOrden}</td>
            <td style={{fontSize:"20px"}} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg">
              <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => decrementarCantidad(index)}>-</button>
              <span className="mx-2">{item.cantidad}</span>
              <button className="px-2 py-1 bg-gray-200 rounded-full" onClick={() => incrementarCantidad(index)}>+</button>
            </td>
            <td style={{fontSize:"20px"}} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg">${item.precio}</td>
            <td style={{fontSize:"20px"}} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg">{item.comentario}</td>
            <td style={{fontSize:"20px"}} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-lg space-x-2">
              <button className="px-3 py-1 bg-red-500 text-white rounded-full" onClick={() => eliminarFila(index)}>Eliminar</button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded-full" onClick={() => toggleComentario(index, 'se entrego pan')}>Pan</button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded-full" onClick={() => toggleComentario(index, 'se entrego postre')}>Postre</button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded-full" onClick={() => toggleComentario(index, 'se entrego bebida')}>Bebida</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SelectedDataTable;
