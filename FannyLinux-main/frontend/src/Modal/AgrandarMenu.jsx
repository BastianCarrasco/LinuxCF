import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';

Modal.setAppElement('#root');
function AgrandarMenu() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState(1);
  const [precio, setPrecio] = useState(0);
  const [stockG, setStockG] = useState(0);
  const [enviado, setEnviado] = useState(false); // Nuevo estado para indicar si se ha enviado el menú
  const [eliminado, setEliminado] = useState(false); // Nuevo estado para indicar si se ha eliminado el menú


  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    // Reiniciar los estados cuando se cierra el modal
    setNombre('');
    setTipo(0);
    setPrecio(0);
    setStockG(0);
    setEnviado(false);
    setEliminado(false);
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el nombre y el precio están presentes
   

    try {
      await axios.post('http://localhost:5000/insertar-menu', {
        nombre,
        tipo,
        precio,
        stockG
      });
      setEnviado(true); // Marcar como enviado
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };


  const handleDelete = async () => {
 

    try {
      await axios.delete('http://localhost:5000/quitar-menu', {
        data: {
          nombre
        }
      });
      setEliminado(true); // Marcar como eliminado
    } catch (error) {
      console.error('Error al eliminar el menú:', error);
    }
  };

  const handleNombreChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z]/ig, ''); // Solo letras
    setNombre(value);
  };

  const handlePrecioChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
    setPrecio(value);
  };

  const handleStockChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
    setStockG(value);
  };


  return (
    <div>
      <button onClick={openModal}>Agregar o Borrar</button>
      <Modal
        className="ModalAgregarMenu"
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ejemplo de Modal"
        shouldCloseOnOverlayClick={false}
      >
        <div className="modal-header">
          <h2>Editar Menú</h2>
        </div>
        <div className="modal-body">
          {(!enviado && !eliminado) && ( // Mostrar el formulario solo si no se ha enviado ni eliminado el menú
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Nombre:</label>
                <input type="text" value={nombre} onChange={handleNombreChange} required placeholder="Nombre de al menos 8 letras" />


                <label>Tipo:</label>
                <select value={tipo} onChange={(e) => setTipo(parseInt(e.target.value))} required>
                  <option value={1}>Proteína</option>
                  <option value={2}>Acompañamiento</option>
                  <option value={3}>Papas</option>
                  <option value={4}>Empanadas</option>
                  <option value={5}>Bebidas</option>
                  <option value={6}>Ensalada</option>
                  <option value={7}>Postre</option>
                  <option value={8}>Otro</option>
                  <option value={9}>Special</option>
                  <option value={10}>Guiso</option>
                </select>

                <label>Precio:</label>
                <input type="text" value={precio} onChange={handlePrecioChange} required />

                <label>Stock Global:</label>
                <input type="text" value={stockG} onChange={handleStockChange} required />
              </div>

            </form>
          )}
          {(enviado || eliminado) && ( // Mostrar mensaje de éxito si se ha enviado o eliminado el menú
            <div>
              <p>{enviado ? 'Menú enviado correctamente' : 'Menú eliminado correctamente'}</p>

            </div>

          )}
          <button type="submit" onClick={handleSubmit}>Enviar</button>
          <button onClick={handleDelete}>Eliminar</button>
        
        </div>
        <div className="modal-footer">
          <button className='cancelar' onClick={closeModal}>Cerrar Modal</button>

        </div>
      </Modal>
    </div>

  );
}

export default AgrandarMenu;





