import React from 'react';

function Sii() {
  const ejecutarComando = async () => {
    const comando = 'tu_comando_aqui';

    try {
      const response = await fetch('/ejecutar-comando', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comando }),
      });

      if (!response.ok) {
        throw new Error('Error al ejecutar el comando');
      }

      const data = await response.json();
      console.log(data.salida);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Página del SII</h1>
      <button onClick={ejecutarComando}>Ejecutar Comando</button>
      <a href="https://eboleta.sii.cl/" target="_blank" rel="noopener noreferrer">Crear Boletas en el SII</a>
    </div>
  );
}

export default Sii;
