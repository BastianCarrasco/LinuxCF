import React, { useState } from 'react';
import video from "../../../src/assets/CajaVideo.webm"; // Importa el video WebM

function ManualCaja() {
  const [mostrarVideo, setMostrarVideo] = useState(false);
  const [botonTexto, setBotonTexto] = useState('Crear una Orden');

  const toggleVideo = () => {
    setMostrarVideo(!mostrarVideo);
    setBotonTexto(mostrarVideo ? 'Crear una Orden' : 'Cerrar Video');
  };

  return (
    <div>
      <h3>¿Como crear una orden?</h3>
      
      <button onClick={toggleVideo}>{botonTexto}</button>
      {mostrarVideo && (
        <video controls width={820} height={560}>
          <source src={video} type="video/webm" />
          Tu navegador no soporta el elemento de video.
        </video>
      )}
    </div>
  );
}

export default ManualCaja;



