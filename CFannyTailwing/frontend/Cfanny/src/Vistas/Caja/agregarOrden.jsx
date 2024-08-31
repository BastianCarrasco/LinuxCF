export const handleAgregarOrden = ({
  selectedData,
  lista,
  Texto,
  precio,
  numeroOrden,
  comentarionuevo,
  barra,
  ListaMayor,
  setListaMayor,
  clearComentario
}) => {
  // Verificar si el precio es 0
  if (precio === 0 && selectedData.length > 1) {
    window.alert(`La combinación no es parte de las colaciones.`);
    return; // Terminar la función si el precio es 0
  }

  if (selectedData.length > 1) {
    const stringSelecteDataId = selectedData.map((item) => item.id).join('-');
    const nuevaLista = {
      ...lista,
      stringSelecteDataId,
      textoOrden: Texto,
      precio: precio, // Guardar el precio total
      precioUnitario: precio, // Guardar el precio unitario
      cantidad: 1, // Inicialmente la cantidad es 1
      numeroOrden: numeroOrden.toString(),
      comentario: comentarionuevo,
      barra,
    };
    setListaMayor([...ListaMayor, nuevaLista]);
    clearComentario();
  } else if (selectedData.length === 1) {
    const stringSelecteDataId = selectedData.map((item) => item.id).join('-'); // Cambiar para asegurar que la ID se convierte en una cadena de texto única
    const nuevaLista = {
      ...lista,
      stringSelecteDataId,
      textoOrden: Texto,
      precio: selectedData[0].precio, // Guardar el precio total
      precioUnitario: selectedData[0].precio, // Guardar el precio unitario
      cantidad: 1, // Inicialmente la cantidad es 1
      numeroOrden: numeroOrden.toString(),
      comentario: comentarionuevo,
      barra,
    };
    setListaMayor([...ListaMayor, nuevaLista]);
    clearComentario();
  }
};

