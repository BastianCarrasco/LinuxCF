import React, { useState, useEffect } from 'react';
import { obtenerDatosCombos } from '../Consultas/GET/getCombos';
import { insertarCombo } from '../Consultas/INSERT/insertarCombo';

export default function CrearCombos() {
  const [formValues, setFormValues] = useState({
    tipo_combo: '',
    proteina: '0',
    acompana: '0',
    acompanaG: '0',
    guiso: '0',
    postre: '0',
    ensaladaC: '0',
    ensaladaG: '0',
    papasC: '0',
    papasG: '0',
    bebida: '0',
    Precio: '0',
  });
  const [error, setError] = useState(''); // State for error message

  // Fetch combo data when the component mounts
  useEffect(() => {
    const fetchCombos = async () => {
      try {
        await obtenerDatosCombos();
        // You can use this data if needed for other functionalities
      } catch (error) {
        console.error('Error fetching combo data:', error);
      }
    };

    fetchCombos();
  }, []);

  // Handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'tipo_combo') {
      // Allow any string value for tipo_combo
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
    } else {
      // Ensure the value is an integer if the field is numeric
      const isNumeric = name !== 'tipo_combo';
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: isNumeric ? value.replace(/[^0-9]/g, '') : value
      }));
    }
  };

  // Handle saving the new combo data
  const handleSave = async () => {
    // Convert form values to integers where appropriate
    const integerValues = {
      proteina: parseInt(formValues.proteina, 10) || 0,
      acompana: parseInt(formValues.acompana, 10) || 0,
      acompanaG: parseInt(formValues.acompanaG, 10) || 0,
      guiso: parseInt(formValues.guiso, 10) || 0,
      postre: parseInt(formValues.postre, 10) || 0,
      ensaladaC: parseInt(formValues.ensaladaC, 10) || 0,
      ensaladaG: parseInt(formValues.ensaladaG, 10) || 0,
      papasC: parseInt(formValues.papasC, 10) || 0,
      papasG: parseInt(formValues.papasG, 10) || 0,
      bebida: parseInt(formValues.bebida, 10) || 0,
      Precio: parseInt(formValues.Precio, 10) || 0,
    };

    // Check if any required field is missing or invalid
    if (Object.values(integerValues).some(value => isNaN(value))) {
      setError('Por favor, complete todos los campos con valores enteros válidos.');
      return;
    }

    if (!formValues.tipo_combo.trim()) {
      setError('El campo tipo_combo no puede estar vacío.');
      return;
    }

    setError(''); // Clear any previous error message
    console.log(formValues)
    try {
      // Create the new combo data
      await insertarCombo(
        formValues.tipo_combo, // Include tipo_combo in the data sent to the backend
        integerValues.proteina,
        integerValues.acompana,
        integerValues.acompanaG,
        integerValues.guiso,
        integerValues.postre,
        integerValues.ensaladaC,
        integerValues.ensaladaG,
        integerValues.papasC,
        integerValues.papasG,
        integerValues.bebida,
        integerValues.Precio
       
      );

      // Optionally, refetch or reset form values after saving
      console.log('Nuevo combo creado:', { ...integerValues, tipo_combo: formValues.tipo_combo });
      setFormValues({
        tipo_combo: '',
        proteina: '0',
        acompana: '0',
        acompanaG: '0',
        guiso: '0',
        postre: '0',
        ensaladaC: '0',
        ensaladaG: '0',
        papasC: '0',
        papasG: '0',
        bebida: '0',
        Precio: '0',
      });
    } catch (error) {
      console.error('Error al guardar el combo:', error);
      setError('Error al guardar el combo. Intente nuevamente.');
    }
  };

  return (
    <div className="w-full p-4 bg-black text-white min-h-screen">
      {/* Form to create a new combo */}
      <div className="mt-4 flex flex-col items-center justify-center bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-center">CREAR NUEVO COMBO</h3>
        <div className="flex flex-col space-y-4 w-full max-w-md">
          {Object.keys(formValues).map((key) => (
            <div key={key} className="flex flex-col mb-4">
              <label className="text-lg font-semibold mb-1 uppercase">
                {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
              </label>
              <input
                type={key === 'Precio' ? 'number' : 'text'} // Use 'number' type for Precio
                name={key}
                className="border border-gray-600 rounded p-2 text-lg bg-gray-700 text-white"
                value={formValues[key]}
                onChange={handleChange}
                min={key === 'Precio' ? '0' : undefined} // Ensure non-negative numbers for Precio
                step={key === 'Precio' ? '1' : undefined} // Ensure only integers are accepted for Precio
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-lg font-medium">
            {error}
          </div>
        )}

        <button
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition"
          onClick={handleSave}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
