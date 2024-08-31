import React, { useState, useEffect } from 'react';
import { insertarMenu } from '../Consultas/INSERT/InsertMenu';
import { obtenerDatosTiposMenu } from '../Consultas/GET/gettiposMenu';
import { obtenerDatosMenu } from '../Consultas/GET/getmenu';

export default function NuevoItem({ onInsertSuccess , datosMenuStock }) {
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [tipoNuevo, setTipoNuevo] = useState('');
  const [precioNuevo, setPrecioNuevo] = useState('');
  const [stockGNuevo, setStockGNuevo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [opcionesTipo, setOpcionesTipo] = useState([]);

  useEffect(() => {
    obtenerDatosTiposMenu()
      .then(data => {
        setOpcionesTipo(data);
      })
      .catch(error => {
        console.error('Error al obtener tipos de menú:', error);
      });
  }, []);

  const handleInsertarMenu = async () => {
    try {
      await insertarMenu(nombreNuevo, tipoNuevo, precioNuevo, stockGNuevo);
      setMensaje('¡Menú insertado correctamente!');
     
    } catch (error) {
      console.error('Error al insertar datos:', error);
      setMensaje('Error al insertar el menú. Por favor, inténtalo de nuevo.');
    }

    datosMenuStock();
  };

  const handleTipoSeleccionado = (id) => {

    setTipoNuevo(id);
    setMensaje(`Tipo seleccionado: ${opcionesTipo[id].nombre.toUpperCase()}`);

  };
  const tiposPermitidos = [1, 2, 10, 4,5,7,8,9,];
  return (
    <div style={{ fontSize: "20px" }} className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Insertar Nuevo Menú</h2>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <input
            type="text"
            value={nombreNuevo}
            onChange={e => setNombreNuevo(e.target.value)}
            placeholder="Nombre"
            className="px-3 py-2 border border-gray-300 rounded text-black w-full"
          />
          <input
            type="text"
            value={precioNuevo}
            onChange={e => setPrecioNuevo(e.target.value)}
            placeholder="Precio"
            className="mt-4 px-3 py-2 border border-gray-300 rounded text-black w-full"
          />
          <input
            type="text"
            value={stockGNuevo}
            onChange={e => setStockGNuevo(e.target.value)}
            placeholder="Stock"
            className="mt-4 px-3 py-2 border border-gray-300 rounded text-black w-full"
          />
          <button
            onClick={handleInsertarMenu}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded font-bold hover:bg-yellow-600"
          >
            <p style={{ fontSize: "20px" }} >Inserta Menú</p>
          </button>
          {mensaje && (
            <p className="text-green-500 mt-2 font-bold">{mensaje}</p>
          )}
        </div>
        <div className="w-1/2">
          <div className="grid grid-cols-2 gap-4">
            {opcionesTipo
              .filter(opcion => tiposPermitidos.includes(opcion.id_tipo)) // Filtra los tipos permitidos
              .map(opcion => (
                <button
                  key={opcion.id_tipo}
                  className={`px-4 py-2 border border-gray-300 rounded text-black ${tipoNuevo === opcion.id_tipo ? 'bg-blue-500 text-white' : 'bg-white'}`}
                  onClick={() => handleTipoSeleccionado(opcion.id_tipo)}
                >
                  {opcion.nombre.toUpperCase()}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
