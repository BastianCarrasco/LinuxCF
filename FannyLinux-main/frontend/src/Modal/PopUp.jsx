import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Popup = ({ message }) => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000} // Cierra automáticamente después de 3 segundos
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default Popup;
