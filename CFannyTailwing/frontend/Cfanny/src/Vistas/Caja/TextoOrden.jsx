export function textoOrden(items) {
    let pedido = '';

    // Verificar si items contiene algún elemento con tipo 1 o tipo 10
    const tieneTipo1 = items.some(element => element.tipo === 1);
    const tieneTipo10 = items.some(element => element.tipo === 10);

    if (tieneTipo1 ) {
        // Ordenar los elementos por tipo de menor a mayor
        const ordenado = items.sort((a, b) => a.tipo - b.tipo);

        ordenado.forEach((element, index) => {
            if (index === 0) {
                pedido += element.nombre;
            } else if (index=== 1) {
                pedido += ` c/n ${element.nombre}`;
            } else {
                pedido += ` + ${element.nombre}`;
            }
        });
    }

    else if (tieneTipo10 ) {
        // Ordenar los elementos por tipo de menor a mayor
        const ordenado = items.sort((a, b) => b.tipo - a.tipo);

        ordenado.forEach((element, index) => {
            if (index === 0) {
                pedido += element.nombre;
            } else if (index=== 1) {
                pedido += ` c/n ${element.nombre}`;
            } else {
                pedido += ` + ${element.nombre}`;
            }
        });
    }

    else{

        const ordenado = items.sort((a, b) => a.tipo - b.tipo);
        pedido = ordenado.map(element => element.nombre).join(' + ');

    }

    return pedido;
}
