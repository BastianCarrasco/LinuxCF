export function textoOrden(items) {
    let pedido = '';
    let bandera = false;

    // Verificar si items contiene algún elemento con tipo 1 o tipo 10
    const tieneTipo1 = items.some(element => element.tipo === 1);
    const tieneTipo10 = items.some(element => element.tipo === 10);
    
    if (tieneTipo1) {
        // Ordenar los elementos por tipo de menor a mayor
        let ordenado = items.sort((a, b) => a.tipo - b.tipo);
        
        bandera = tieneDuplicados(ordenado);
        ordenado = eliminarDuplicados(ordenado);

        ordenado.forEach((element, index) => {
            if (index === 0) {
                pedido += element.nombre;
            } else if (index === 1) {
                pedido += bandera ? ` c/n GRANDE ${element.nombre}` : ` c/n ${element.nombre}`;
            } else {
                pedido += ` + ${element.nombre}`;
            }
        }
        
        
        );
    } else if (tieneTipo10) {
        // Ordenar los elementos por tipo de menor a mayor
        let ordenado = items.sort((a, b) => a.tipo - b.tipo);
        
        // Encontrar el índice del elemento con tipo = 10
        const indexTipo10 = ordenado.findIndex(element => element.tipo === 10);

        if (indexTipo10 !== -1) {
            // Extraer el elemento con tipo = 10 y moverlo al principio
            const elementoTipo10 = ordenado.splice(indexTipo10, 1)[0];
            ordenado.unshift(elementoTipo10);
        }

        ordenado.forEach((element, index) => {
            if (index === 0) {
                pedido += element.nombre; // Este será el elemento con tipo = 10, si existe
            } else if (index === 1) {
                pedido += ` c/n ${element.nombre}`;
            } else {
                pedido += ` + ${element.nombre}`;
            } 
        });
    } else {
        const ordenado = items.sort((a, b) => a.tipo - b.tipo);
        pedido = ordenado.map(element => element.nombre).join(' + ');
    }
    
    if(pedido.includes('c/n')){pedido += ` + pan`;}

    return pedido;
}

function eliminarDuplicados(arr) {
    const seen = new Set();
    return arr.filter(item => {
        const duplicate = seen.has(item.nombre);
        seen.add(item.nombre);
        return !duplicate;
    });
}

function tieneDuplicados(arr) {
    const uniqueElements = new Set(arr.map(item => item.nombre));
    return uniqueElements.size !== arr.length;
}

