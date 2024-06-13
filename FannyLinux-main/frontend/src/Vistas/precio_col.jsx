import React, { useState } from 'react';

function Precio_col() {
  const [idColaciones, setIdColaciones] = useState('');
  const [valor, setValor] = useState('');

  const actualizarPrecios = async () => {
    try {
      const response = await fetch('http://192.168.78.98:5150/actualizar-precios-colacion', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idColaciones, valor }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar precios_colaciones');
      }
  
      const data = await response.json();
      console.log(data.message); // Mensaje de éxito desde el backend
      console.log(data.results); // Resultados del procedimiento almacenado
  
      // Refrescar la página después de la actualización exitosa
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleIdChange = (event) => {
    setIdColaciones(event.target.value);
  };

  const handleValorChange = (event) => {
    setValor(event.target.value);
  };

  return (
    <div>
       <br></br>
      <label htmlFor="idColaciones">ID de Colaciones:</label>
      <input
        type="number"
        id="idColaciones"
        value={idColaciones}
        onChange={handleIdChange}
        placeholder="Ingrese el ID de colaciones"
        style={{marginRight:'60px'}}
      />

      <label htmlFor="valor">Nuevo valor:</label>
      <input
        type="number"
        id="valor"
        value={valor}
        onChange={handleValorChange}
        placeholder="Ingrese el nuevo valor"
      />
      <br></br> <br></br>

      <button onClick={actualizarPrecios}>Actualizar Precios Colación</button>
    </div>
  );
}

export default Precio_col;

