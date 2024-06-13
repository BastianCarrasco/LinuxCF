
import axios from 'axios';
export async function obtenerDatosPedidos() {
    try {
      const response = await fetch('http://192.168.0.12:5150/obtener-pedidos');
      if (!response.ok) {
        throw new Error('Error al obtener datos /obtener-pedidos');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener datos /obtener-pedidos', error);
      return [];
    }
  }

  export const actualizarStockG = async () => {
    try {
      const response = await axios.put('http://192.168.0.12:5150/actualizar-stockG');
      return response.data;
    } catch (error) {
      console.error('Error al enviar la solicitud PUT:', error);
      throw error;
    }
  };
  
  export const actualizarStockSemana = async (numero, id_dia, nuevoStock) => {
    try {
      const response = await axios.put(
        `http://192.168.0.12:5150/actualizar-stock/${numero}/${id_dia}`,
        { stockD: nuevoStock }
      );
      return response.data;
    } catch (error) {
      console.error('Error al enviar la solicitud PUT:', error);
      throw error;
    }
  };
  
  
  export const actualizarSemana = async (numero, id_dia, id_menu) => {
    try {
      const response = await axios.put(
        `http://192.168.0.12:5150/actualizar-semana/${numero}/${id_dia}`,
        { id_menu }
      );
      return response.data;
    } catch (error) {
      console.error('Error al enviar la solicitud PUT:', error);
      throw error;
    }
  };
  
  export async function obtenerDatosMenu() {
    try {
      const response = await fetch('http://192.168.0.12:5150/datosMenu');
      if (!response.ok) {
        throw new Error('Error al obtener datos del menú');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener datos del menú:', error);
      return [];
    }
  }
  
  export async function obtenerDatosSemana() {
    try {
      const response = await fetch('http://192.168.0.12:5150/datosSemana');
      if (!response.ok) {
        throw new Error('Error al obtener datos de la semana');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener datos de la semana:', error);
      return [];
    }
  }
  
  export async function obtenerPrecios() {
    try {
      const response = await fetch('http://192.168.0.12:5150/precio_colaciones');
      if (!response.ok) {
        throw new Error('Error al obtener datos de precio_colaciones');
      }
      return await response.json();
    } catch (error) {
      console.error('Error al obtener datos de precio_colaciones:', error);
      return [];
    }
  }
  
  export const insertarVenta = async (ventaData) => {
    try {
      const response = await axios.post(
        'http://192.168.0.12:5150/insertar-venta',
        ventaData
      );
      return response.data;
    } catch (error) {
      console.error('Error al enviar la solicitud POST:', error);
      throw error;
    }
  };
  
  
  export const insertarPedido = async (datos) => {
    const datos_ordenados = {
      OrdenTxt: datos.TextoOrden,
      Cantidad: datos.Cantidad,
      Llaves: datos.Llaves,
      Comentario: datos.Comentario, // Corregido aquí
      Precio: datos.Precio,
      Estado: datos.Estado,
      Barra: datos.Barra,
      Cliente: datos.Cliente,
      NumOrden: datos.NumOrden
    };
  
    try {
      const response = await axios.post('http://192.168.0.12:5150/insertar-pedido', datos_ordenados);
      return response.data;
    } catch (error) {
      console.error('Error al enviar la solicitud POST:', error);
      throw error;
    }
  };
  
  export const insertarEncargo = async (datos, n) => {
    const datos_ordenados = {
      OrdenTxt: datos.TextoOrden,
      Cantidad: datos.Cantidad,
      Llaves: datos.Llaves,
      Comentario: datos.Comentario, // Corregido aquí
      Precio: datos.Precio,
      Estado: 1,
      Barra: datos.Barra,
      Cliente: n,
      NumOrden: datos.NumOrden
    };
  
    try {
      const response = await axios.post('http://192.168.0.12:5150/insertar-pedido', datos_ordenados);
      return response.data;
    } catch (error) {
      console.error('Error al enviar la solicitud POST:', error);
      throw error;
    }
  };
  
  export const actualizarEstado = async (barra) => {
    try {
      const response = await axios.put(
        `http://192.168.0.12:5150/actualizar-estado/${barra}`,
        { estado: 2 } // Aquí se establece el estado como 2
      );
      return response.data;
    } catch (error) {
      console.error('Error al enviar la solicitud PUT:', error);
      throw error;
    }
  };
  
  
  
  