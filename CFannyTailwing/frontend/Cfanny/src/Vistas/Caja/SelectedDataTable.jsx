import React from 'react';

const SelectedDataTable = ({ selectedData }) => (
  <div className="mt-4">
    {selectedData.length > 0 ? (
      <table className="table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {selectedData.map((dato, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{dato.nombre}</td>
              <td className="border border-gray-300 px-4 py-2">{dato.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No hay datos seleccionados.</p>
    )}
  </div>
);

export default SelectedDataTable;
