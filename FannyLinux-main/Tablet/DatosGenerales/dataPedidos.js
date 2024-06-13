import { obtenerDatosPedidos } from "../consultasTablet";

// Inicializa un arreglo vacío para almacenar los pedidos
let pedidos = [];

// Función para obtener los datos de los pedidos y asignarlos al arreglo
export const cargarDatosPedidos = async () => {
  try {
    // Obtiene los datos de pedidos desde la función obtenerDatosPedidos
    const datos = await obtenerDatosPedidos();
    // Asigna los datos al arreglo de pedidos
    pedidos = datos;
  } catch (error) {
    console.error('Error al cargar los datos de pedidos:', error);
  }
};





export default pedidos;


