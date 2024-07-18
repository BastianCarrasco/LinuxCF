import React from 'react';

const DateTimeDisplay = ({ dayName, currentDate }) => (
  <div style={{marginTop:"50px"}} >
    <h2 className="text-2xl font-bold">{dayName}</h2>
    <p className="text-xl">{currentDate.toLocaleTimeString()}</p>
    <p className="text-xl">{currentDate.getDate()} de {currentDate.toLocaleDateString('es-ES', { month: 'long' })} de {currentDate.getFullYear()}</p>
  </div>
);

export default DateTimeDisplay;
