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

  