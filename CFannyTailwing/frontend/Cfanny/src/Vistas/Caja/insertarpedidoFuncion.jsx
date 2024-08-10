// pedidoUtils.js

import { insertarPedido } from "../Consultas/INSERT/InsertPedido";

/**
 * Inserta pedidos en la base de datos y luego realiza acciones adicionales como borrar datos y cerrar el modal.
 * @param {Array} listaMayor - Array de objetos con los detalles de los pedidos
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} borrar - Función para borrar los datos después de la inserción
 * @param {Function} clearFilter - Función para limpiar el filtro
 * @param {Function} aumentarCliente - Función para aumentar el contador de clientes
 * @param {string} filter - Filtro de cliente
 */
export const handleCloseAndClear = async (listaMayor, onClose, borrar, clearFilter, aumentarCliente, filter) => {
  try {
    // Insertar cada pedido en la base de datos
    await insertarPedidos(listaMayor, filter);

    // Borrar los datos después de la inserción
    borrar();

    // Cerrar el modal
    onClose();
  } catch (error) {
    console.error('Error al insertar pedidos:', error);
  }
};

/**
 * Inserta todos los pedidos en la base de datos.
 * @param {Array} listaMayor - Array de objetos con los detalles de los pedidos
 * @param {string} filter - Filtro de cliente
 */
const insertarPedidos = async (listaMayor, filter) => {
  const insertPromises = listaMayor.map(pedido => {
    // Verifica si `filter` no está vacío y actualiza el campo `cliente`
    if (filter !== "") {
      pedido.cliente = filter;
    }

    // Verifica si `cliente` es diferente de `null` para ajustar el campo `estado`
    const estado = pedido.cliente !== null ? 3 : pedido.estado;

    return insertarPedido(
      pedido.barra,
      pedido.cantidad,
      pedido.cliente,
      pedido.comentario || '',
      estado,
      pedido.numeroOrden,
      pedido.precio,
      pedido.precioUnitario,
      pedido.stringSelecteDataId,
      pedido.textoOrden
    );
  });

  // Esperar a que todas las inserciones se completen
  await Promise.all(insertPromises);
};
