const fs = require('fs');

const filePath = 'kk.txt';

// Función para escribir "Hola" en el archivo de texto
function escribirHolaEnArchivo() {
    // Texto estático a escribir
    const texto = 'Hola\n';

    // Escribir el texto en el archivo
    fs.appendFile(filePath, texto, (error) => {
        if (error) {
            console.error('Error al escribir en el archivo:', error);
        } else {
            console.log('Datos escritos en el archivo exitosamente.');
        }
    });
}

module.exports = escribirHolaEnArchivo;

