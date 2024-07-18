export function generarNumeroUnico() {
    const timestamp = Date.now(); // Obtiene el número de milisegundos desde el 1 de enero de 1970
    const randomFactor = Math.floor(Math.random() * 1000); // Genera un número aleatorio entre 0 y 999
    const uniqueNumber = (timestamp % 1000000000) + randomFactor; // Asegura que el número tenga 9 dígitos

    // Asegura que el número tiene exactamente 9 dígitos
    const nineDigitNumber = uniqueNumber.toString().padStart(9, '0').slice(-9);

    return nineDigitNumber;
}
