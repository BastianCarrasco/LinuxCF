/**
 * Formatea una fecha en formato latinoamericano (DD/MM/YYYY).
 * @param {Date | string} date - Fecha a formatear. Puede ser un objeto Date o una cadena de texto con una fecha.
 * @returns {string} - Fecha formateada en formato DD/MM/YYYY.
 */
export const formatDateToLatino = (date) => {
    // Si la fecha es una cadena, conviértela a un objeto Date
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
    // Verificar si parsedDate es una fecha válida
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Fecha no válida');
    }
  
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const year = parsedDate.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  