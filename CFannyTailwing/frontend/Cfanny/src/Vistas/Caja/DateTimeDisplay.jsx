import React from 'react';

const DateTimeDisplay = ({ dayName, currentDate }) => (
  <div  style={{marginTop:"50px"} } >
    <h2 style={{fontSize:"30px", marginBottom:"10px"}} className="text-2xl font-bold">{dayName}</h2>
    <p style={{fontSize:"30px", marginBottom:"10px"}} className="text-xl">{currentDate.toLocaleTimeString()}</p>
    <p style={{fontSize:"30px", marginBottom:"30px"}} className="text-xl">{currentDate.getDate()} de {currentDate.toLocaleDateString('es-ES', { month: 'long' })} de {currentDate.getFullYear()}</p>
  </div>
);

export default DateTimeDisplay;
