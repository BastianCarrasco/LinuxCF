import React, { useState, useEffect } from 'react';
import { obtenerDatosCombos } from '../Consultas/GET/getCombos';
import { actualizarPreciocombo } from '../Consultas/UPDATE/editarPreciocombo';

export default function Combos() {
  const [combos, setCombos] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedGroupIds, setSelectedGroupIds] = useState([]); // State for storing idcombo values
  const [newComboValue, setNewComboValue] = useState('');
  const [error, setError] = useState(''); // State for error message

  // Function to fetch combo data and update the state
  const fetchCombos = async () => {
    try {
      const data = await obtenerDatosCombos();
      setCombos(data); // Update state with fetched data
    } catch (error) {
      console.error('Error fetching combo data:', error);
    }
  };

  // Fetch combo data when the component mounts
  useEffect(() => {
    fetchCombos();
  }, []);

  // Group combos by price
  const groupedCombos = combos.reduce((acc, combo) => {
    if (!acc[combo.Precio]) {
      acc[combo.Precio] = []; // Initialize the array if it doesn't exist
    }
    acc[combo.Precio].push(combo); // Group by price, store whole combo object
    return acc;
  }, {});

  // Handle change of the selected combo value
  const handleComboValueChange = (event) => {
    setNewComboValue(event.target.value);
  };

  // Handle group selection
  const handleGroupSelection = (event) => {
    const selectedGroupValue = event.target.value;
    setSelectedGroup(selectedGroupValue);

    // Find the idcombo values for the selected group
    const groupIndex = parseInt(selectedGroupValue.replace('Grupo ', '')) - 1;
    const selectedGroupCombos = Object.values(groupedCombos)[groupIndex] || [];

    // Extract idcombo values from the selected group
    const ids = selectedGroupCombos.map(combo => combo.idcombo);
    setSelectedGroupIds(ids); // Update state with idcombo values

    console.log(`Selected group idcombo values: ${ids}`);
  };

  // Save the new value for all combos in the selected group
  const handleSaveValue = async () => {
    if (!selectedGroup) {
      setError('Por favor, seleccione un grupo antes de guardar.');
      return;
    }

    setError(''); // Clear any previous error message

    try {
      // Update the price for each idcombo in the selected group
      await Promise.all(
        selectedGroupIds.map(idcombo => actualizarPreciocombo(idcombo, newComboValue))
      );

      // Refetch the combo data after updating
      await fetchCombos();

      console.log(`Grupo: ${selectedGroup}, Nuevo valor: ${newComboValue}`);
      console.log(`Idcombos in the selected group: ${selectedGroupIds}`);
    } catch (error) {
      console.error('Error al guardar el valor del combo:', error);
    }
  };

  return (
    <div style={{ fontSize: "30px" }} className="w-full p-4">
      <div style={{ fontSize: "30px" }} className="overflow-x-auto">
        <table style={{ fontSize: "30px" }} className="min-w-full divide-y divide-gray-200">
          <thead style={{ fontSize: "30px" }} className="bg-gray-50">
            <tr style={{ textAlign: "center" }}>
              <th style={{ textAlign: "center", color: "black", fontSize: "20px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Combo</th>
              <th style={{ textAlign: "center", color: "black", fontSize: "20px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th style={{ textAlign: "center", color: "black", fontSize: "20px" }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "60px" }} className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedCombos).map(([precio, combos], index) => (
              <tr key={precio}>
                <td style={{ textAlign: "center", color: "black", fontSize: "15px" }} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  COMBO {index + 1} {/* Group identifier */}
                </td>
                <td style={{ textAlign: "center", color: "black", fontSize: "20px",  }} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {combos.map((combo, index) => (
                    <React.Fragment key={index}>
                      {combo.tipo_combo}
                      <br />
                    </React.Fragment>
                  ))}
                </td>
                <td style={{ textAlign: "center", color: "black", fontSize: "20px" }} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${precio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section to change the combo value */}
      <div style={{ backgroundColor: "white" }} className="mt-4 flex flex-col items-center justify-center">
        <h3 className="text-2xl font-medium text-gray-700 mb-4">Cambiar valor del Combo</h3>
        <div className="flex items-center mt-2">
          <label className="mr-2 text-lg font-medium text-gray-700">Seleccionar Combo:</label>
          <select
            className="border border-gray-300 rounded p-2 text-lg"
            value={selectedGroup}
            onChange={handleGroupSelection}
            style={{ backgroundColor: "black" }}
          >
            <option value="">Seleccionar</option>
            {Object.entries(groupedCombos).map(([precio], index) => (
              <option key={index} value={`Grupo ${index + 1}`}>
                Grupo {index + 1}
              </option>
            ))}
          </select>

          <label className="mr-2 text-lg font-medium text-gray-700 ml-4">Nuevo Valor:</label>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 text-lg"
            value={newComboValue}
            onChange={handleComboValueChange}
            style={{ color: "black" }}
          />
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-lg font-medium">
            {error}
          </div>
        )}

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-lg"
          onClick={handleSaveValue}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}






