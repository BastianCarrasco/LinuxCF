import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { obtenerDatosPedidos } from '../consultasTablet';



const Cola = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Llama a la función para obtener los datos de pedidos cada segundo
      obtenerDatosPedidos()
        .then(data => {
          // Filtra los datos para mostrar solo aquellos con Estado === 1
          const pedidosActivos = data.filter(item => item.Estado === 0);
          setPedidos(pedidosActivos);
        })
        .catch(error => {
          console.error('Error al obtener los datos de pedidos:', error);
        });
    }, 1000); // 1000 milisegundos = 1 segundo

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, []);

  // Función para renderizar cada elemento de la lista
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Orden: {item.OrdenTxt}</Text>
      <Text>Cantidad: {item.Cantidad}</Text>
      <Text>Comentario: {item.Comentario}</Text>
      <Text>Precio: {item.Precio}</Text>
      <Text>Número de Orden: {item.NumOrden}</Text>
      {/* Agrega más campos según sea necesario */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tabla de pedidos:</Text>
      <FlatList
        data={pedidos}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default Cola;
