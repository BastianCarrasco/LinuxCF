import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import { DataVentas } from './funciones backend/consultas';
import Modal from 'react-modal';
import './App.css';
import Sii from './Vistas/Sii';
import Caja from './Vistas/Caja';
import Cola from './Vistas/Cola';
import Encargos from './Vistas/Encargos';
import Stock from './Vistas/Stock';
import Menu from './Vistas/Menu';
import Caja2 from './Vistas/Caja copy';
import Pruebas from './Vistas/precio_col';

import ManualCaja from './Vistas/Manual/ManualCaja';

import ModalVentas from './Modal/ventas';

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const datosMenu = await DataVentas();
        setData(datosMenu);
        console.log('Datos del menú obtenidos:', datosMenu);
      } catch (error) {
        console.error('Error al obtener y mostrar datos del menú:', error);
      }
    }
    fetchData();
  }, []);

  // Función para descargar un archivo CSV con los datos
  const descargarCSV = () => {
    const csvData = [
        ['ID', 'Pedido', 'Estado', 'Cantidad', 'Precio', 'Número de Orden', 'Fecha de Venta'], // Encabezados del CSV
        ...data.map(item => [
            item.id_venta,
            item.Pedido,
            item.Estado,
            item.Cantidad,
            item.Precio,
            item.NumeroOrden,
            formatDate(item.FechaVenta), // Formatear la fecha
            formatTime(item.FechaVenta) // Formatear la hora
        ]) // Datos del menú
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvData.map(row => row.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'datos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear().toString().slice(-2); // Obtener los últimos dos dígitos del año
  return `${day}/${month}/${year}`;
};

// Función para formatear la hora (hh:mm:ss)
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};



  return (
    <div style={{ color: "white", backgroundColor: "black" }}>
      <br></br>
      <br></br>
      <h1>BIENVENIDOS A COLACIONES FANNY</h1>

      <ManualCaja></ManualCaja>
      <ModalVentas />
     

    </div>
  );
}



function App() {
  return (
    <Router>
      <div style={{ color: "white", backgroundColor: "black" }}>
        {/* Navbar at the top */}
        <nav >
          
          <ul style={{marginTop:'4px',paddingBottom:'30px', marginBottom:'25px'}}>
            <li>
              <Link to="/" className='botonNav botonNavStock'>Home</Link>
            </li>
            <li>
              <Link to="/caja" className='botonNav botonNavStock'>Caja</Link>
            </li>
            <li>
              <Link to="/caja2" className='botonNav ocultarBotonNavStock'>Caja2</Link>
            </li>
            <li>
              <Link to="/cola" className='botonNav'>Cola</Link>
            </li>
            <li>
              <Link to="/encargos" className='botonNav'>Encargos</Link>
            </li>
            <li>
              <Link to="/menu" className='botonNav botonNavStock'>Menu Semana</Link>
            </li>
            <li>
              <Link to="/stock" className='botonNav botonNavStock'>Stock</Link>
            </li>
            <li>
              <Link to="/sii" className='botonNav botonNavStock'>Sii</Link>
            </li>
            <li>
              <Link to="/pruebas" className='botonNav botonNavStock'>SPPP</Link>
            </li>
          </ul>
          
        </nav>

        {/* Main content */}
        <div style={{ minHeight: '85vh', borderBottom:'solid',borderTop:'solid' }}> {/* Adjust minHeight as needed */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/caja" element={<Caja />} />
            <Route path="/caja2" element={<Caja2 />} />
            <Route path="/cola" element={<Cola />} />
            <Route path="/encargos" element={<Encargos />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/pruebas" element={<Pruebas />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Navbar at the bottom */}
        <nav>
        
        </nav>
      </div>
    </Router>
  );
}

export default App;




