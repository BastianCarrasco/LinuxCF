// Función para generar un número aleatorio de 9 dígitos único
export function generarNumeroUnico() {
    // Inicializar el conjunto de números generados previamente
    let numerosGenerados = new Set();

    // Función auxiliar para generar un número aleatorio de 9 dígitos
    const generarNumero = () => {
        return Math.floor(100000000 + Math.random() * 900000000);
    };

    // Generar un número aleatorio único
    let nuevoNumero = generarNumero();
    while (numerosGenerados.has(nuevoNumero)) {
        nuevoNumero = generarNumero();
    }

    // Agregar el nuevo número al conjunto de números generados previamente
    numerosGenerados.add(nuevoNumero);

    // Retornar el número generado único
    return nuevoNumero;
}
