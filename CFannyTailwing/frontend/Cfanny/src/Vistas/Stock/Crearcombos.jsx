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
  const [error, setError] = useState('');
  const [combosExistentes, setCombosExistentes] = useState([]);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const combos = await obtenerDatosCombos();
        setCombosExistentes(combos);
      } catch (error) {
        console.error('Error fetching combo data:', error);
      }
    };

    fetchCombos();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const isNumeric = name !== 'tipo_combo';
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: isNumeric ? value.replace(/[^0-9]/g, '') : value
    }));
  };

  const verificarDuplicado = () => {
    return combosExistentes.some(combo =>
      combo.tipo_combo === formValues.tipo_combo &&
      combo.proteina === formValues.proteina &&
      combo.acompana === formValues.acompana &&
      combo.acompanaG === formValues.acompanaG &&
      combo.guiso === formValues.guiso &&
      combo.postre === formValues.postre &&
      combo.ensaladaC === formValues.ensaladaC &&
      combo.ensaladaG === formValues.ensaladaG &&
      combo.papasC === formValues.papasC &&
      combo.papasG === formValues.papasG &&
      combo.bebida === formValues.bebida &&
      combo.Precio === formValues.Precio
    );
  };

  const handleSave = async () => {
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

    if (Object.values(integerValues).some(value => isNaN(value))) {
      setError('Por favor, complete todos los campos con valores enteros válidos.');
      return;
    }

    if (!formValues.tipo_combo.trim()) {
      setError('El campo tipo_combo no puede estar vacío.');
      return;
    }

    const nonZeroAttributes = Object.values(integerValues).filter(value => value !== 0);

    if (nonZeroAttributes.length < 2) {
      setError('Debe haber al menos dos atributos con valores distintos de 0.');
      return;
    }

    if (verificarDuplicado()) {
      setError('Esta combinación ya existe.');
      return;
    }

    if (integerValues.Precio === 0) {
      setError('El precio no puede ser 0.');
      return;
    }

    setError('');

    try {
      await insertarCombo(
        formValues.tipo_combo,
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
      <div className="mt-4 flex flex-col items-center justify-center bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-center">CREAR NUEVO COMBO</h3>
        <div className="flex flex-wrap justify-between space-y-4 w-full max-w-lg">
          <div className="w-full md:w-1/2 pr-2">
            {Object.keys(formValues).slice(0, 6).map((key) => (
              <div key={key} className="flex flex-col mb-4">
                <label className="text-lg font-semibold mb-1 uppercase">
                  {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                </label>
                <input
                  type={key === 'Precio' ? 'number' : 'text'}
                  name={key}
                  className="border border-gray-600 rounded p-2 text-lg bg-gray-700 text-white"
                  value={formValues[key]}
                  onChange={handleChange}
                  min={key === 'Precio' ? '1' : undefined}
                  step={key === 'Precio' ? '1' : undefined}
                />
              </div>
            ))}
          </div>
          <div className="w-full md:w-1/2 pl-2">
            {Object.keys(formValues).slice(6).map((key) => (
              <div key={key} className="flex flex-col mb-4">
                <label className="text-lg font-semibold mb-1 uppercase">
                  {key.replace(/([A-Z])/g, ' $1').toUpperCase()}:
                </label>
                <input
                  type={key === 'Precio' ? 'number' : 'text'}
                  name={key}
                  className="border border-gray-600 rounded p-2 text-lg bg-gray-700 text-white"
                  value={formValues[key]}
                  onChange={handleChange}
                  min={key === 'Precio' ? '1' : undefined}
                  step={key === 'Precio' ? '1' : undefined}
                />
              </div>
            ))}
          </div>
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
