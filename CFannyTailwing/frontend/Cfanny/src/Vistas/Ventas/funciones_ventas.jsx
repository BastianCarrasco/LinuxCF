export const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-CO', options);
};

export const countOrdersByMonth = (ventas) => {
    const ordersByMonth = ventas.reduce((acc, venta) => {
        const month = new Date(venta.fechaVenta).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});
    return ordersByMonth;
};

export const calculateTotalEarnings = (ventas) => {
    return Math.round(
        ventas
            .filter(venta => venta.estado !== 5) // Filtra las ventas que no están canceladas
            .reduce((total, venta) => total + parseFloat(venta.precio), 0)
    );
};


// Cuenta cuántos clientes son 'Caja', 'Encargos', y 'Cancelados'
export const countClientTypes = (ventas) => {
    const clientCounts = {
        Caja: 0,
        Encargos: 0,
        Cancelados: 0
    };

    ventas.forEach(venta => {
        if (venta.estado === 0) {
            clientCounts.Caja += 1;
        } else if (venta.estado === 1) {
            clientCounts.Encargos += 1;
        } else if (venta.estado === 5) {
            clientCounts.Cancelados += 1;
        }
    });

    return clientCounts;
};

export const getTop10TextoOrden = (ventas) => {
    const textoOrdenCount = ventas.reduce((acc, venta) => {
        acc[venta.textoOrden] = (acc[venta.textoOrden] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(textoOrdenCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
};

export const countOrdersByDay = (ventas) => {
    const ordersByDay = ventas.reduce((acc, venta) => {
      const day = formatDate(venta.fechaVenta);
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    return ordersByDay;
  };


  export const downloadCSV = (filteredVentas) => {
    const header = ['Número de Orden', 'Cliente', 'Texto Orden', 'Cantidad', 'Comentario', 'Precio', 'Fecha'];

    // Usar filteredVentas para obtener los datos filtrados
    const rows = filteredVentas.map(venta => [
      venta.numeroOrden,
      venta.estado === 0 ? 'Caja' : venta.estado === 1 ? 'Encargo' : venta.estado === 5 ? 'Cancelado' : venta.estado === 3 ? 'Encargo en espera' : 'Desconocido',
      venta.textoOrden,
      venta.cantidad,
      venta.comentario,
      Math.round(venta.precio),
      formatDate(venta.fechaVenta),
    ]);

    // Crear contenido CSV
    const csvContent = [
      header.join(','),      // Encabezado
      ...rows.map(row => row.join(','))   // Filas de datos
    ].join('\n');

    // Obtener la fecha actual en formato latinoamericano (DD-MM-YYYY)
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-CL').replace(/\//g, '-'); // DD-MM-YYYY format

    // Crear un blob y descargarlo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Asignar nombre del archivo como "ventas_DD-MM-YYYY.csv"
    link.setAttribute('href', url);
    link.setAttribute('download', `ventas_${formattedDate}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
