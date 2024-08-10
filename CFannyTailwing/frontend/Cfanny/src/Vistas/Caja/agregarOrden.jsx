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
  }

  if (selectedData.length === 1) {
    const stringSelecteDataId = selectedData.map((item) => selectedData[0].id);
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
