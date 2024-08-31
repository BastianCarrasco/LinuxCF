// tiempo.js
export const tiempo = (setDayName, setCurrentDate) => {
    const now = new Date();
    setCurrentDate(now); // Establece la fecha y hora actual
  
    const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    
    // Obtén el nombre del día actual
    let dayName = dayNames[now.getDay()];
  
    // Ajusta el nombre del día si es domingo
    if (dayName === 'DOMINGO') {
      dayName = 'LUNES';
    }
  
    setDayName(dayName); // Establece el nombre del día
};

// tiempo.js

// tiempo.js

export const obtenerNumeroDelDia = () => {
  const now = new Date();
  
  // Obtén el índice del día de la semana (0 para domingo, 1 para lunes, etc.)
  let diaNumero = now.getDay();
  
  // Ajusta el número del día si es domingo
  if (diaNumero === 0) {
    diaNumero = 1; // Cambia el domingo (0) a lunes (1)
  }

  // Devuelve el número del día
  return diaNumero;
};

