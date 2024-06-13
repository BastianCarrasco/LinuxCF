import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, FlatList, Modal, ScrollView } from 'react-native';
import { obtenerDatosSemana, obtenerDatosMenu, obtenerPrecios, insertarEncargo} from '../consultasTablet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Caja = () => {
  const [datosSemana, setDatosSemana] = useState([]);
  const [datosMenu, setDatosMenu] = useState([]);
  const [Empanadas, setEmpanadas] = useState([]);
  const [botonesPresionados, setBotonesPresionados] = useState([]);

  const [TextoOrden, setTextoOrden] = useState('Orden');
  const [Cantidad, setCantidad] = useState('1');
  const [Llaves, setLlaves] = useState('');
  const [Comentario, setComentario] = useState('');
  const [Precio, setPrecio] = useState(0);
  const [Estado, setEstado] = useState(2);
  const [Barra, setBarra] = useState(0);
  const [Cliente, setCliente] = useState('');
  const [NumOrden, setNumOrden] = useState(999);

  const [arregloPedidos, setArregloPedidos] = useState([]);
  const [valores, setvalores] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTabla, setModalTablaVisible] = useState(false);

  const abrirModalTabla = () => {
    setModalTablaVisible(true);
  };

  // Función para cerrar el modal
  const cerrarModalTabla = () => {
    setModalTablaVisible(false);
  };

  const handleCantidadChange = (text) => {
    // Verifica si el texto ingresado es un número
    if (/^\d+$/.test(text) || text === '') {
      // Si es un número o un string vacío, actualiza el estado
      setCantidad(text);
    }
  };

  const obtenerDatosSemanaYEmpanadas = async () => {
    try {
      // Obtener los datos de la semana
      const data = await obtenerDatosSemana();

      // Obtener el día actual
      const diaActual = obtenerDiaActual();

      // Filtrar los datos para obtener las empanadas del día actual
      const empanadasDelDia = data.filter(item => item.dia === diaActual && item.tipo === 4);

      // Establecer los datos de las empanadas en el Estado Empanadas
      setEmpanadas(empanadasDelDia);
    } catch (error) {
      console.error('Error al obtener los datos de la semana y las empanadas:', error);
    }
  };

  // Llamar a la función para obtener los datos de la semana y las empanadas al cargar el componente
  useEffect(() => {
    obtenerDatosSemanaYEmpanadas();
  }, []);

  // Función para abrir el modal
  const abrirModal = () => {
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setModalVisible(false);
  };

  const guardarPedidosEnMemoriaLocal = async () => {
    try {
      // Guarda los pedidos en AsyncStorage como una cadena JSON
      await AsyncStorage.setItem('pedidos', JSON.stringify(arregloPedidos));
    } catch (error) {
      console.error('Error al guardar los pedidos:', error);
    }
  };

  // Función para cargar los pedidos desde AsyncStorage al iniciar la aplicación
  const cargarPedidosDesdeMemoriaLocal = async () => {
    try {
      // Obtiene los pedidos almacenados en AsyncStorage
      const pedidosGuardados = await AsyncStorage.getItem('pedidos');
      if (pedidosGuardados !== null) {
        // Si hay pedidos almacenados, los convierte de nuevo a un arreglo JSON y los establece en el Estado
        setArregloPedidos(JSON.parse(pedidosGuardados));
      }
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
    }
  };

  // Utiliza useEffect para cargar los pedidos almacenados al iniciar la aplicación
  useEffect(() => {
    cargarPedidosDesdeMemoriaLocal();
  }, []);

  // Utiliza useEffect para guardar los pedidos cada vez que el arreglo de pedidos cambie
  useEffect(() => {
    guardarPedidosEnMemoriaLocal();
  }, [arregloPedidos]);

  const guardarPedido = () => {
    // Crea un nuevo pedido con los datos actuales
    const nuevoPedido = {
      TextoOrden,
      Cantidad,
      Llaves,
      Comentario,
      Precio,
      Estado,
      Barra,
      Cliente,
      NumOrden
    };

    // Agrega el nuevo pedido al arreglo de pedidos
    setArregloPedidos([...arregloPedidos, nuevoPedido]);

    // Reinicia los valores a sus Estados iniciales
    setTextoOrden('Orden');
    setCantidad(1);
    setLlaves('');
    setComentario('');
    setPrecio(0);
    setEstado(2);
    setBarra(0);

    setNumOrden(999);
    setBotonesPresionados([]);

  };

  const generarValorUnico = () => {
    let valor = '';
    const digitos = '1234567890';

    // Generar un valor de 9 dígitos
    for (let i = 0; i < 9; i++) {
      valor += digitos[Math.floor(Math.random() * digitos.length)];
    }

    // Verificar si el valor generado ya existe
    while (valoresUtilizados.includes(valor)) {
      valor = '';
      // Generar un nuevo valor
      for (let i = 0; i < 9; i++) {
        valor += digitos[Math.floor(Math.random() * digitos.length)];
      }
    }

    // Agregar el valor generado a la lista de valores utilizados
    valoresUtilizados.push(valor);

    // Convertir la cadena a un número entero
    return parseInt(valor);
  };


  const setearLlaves = () => {
    const LlavesConcatenadas = botonesPresionados.length > 0 ? botonesPresionados.map(item => item.id).join('-') : '';
    setLlaves(LlavesConcatenadas);
  };



  useEffect(() => {
    // Obtiene el día actual y ajusta para mostrar los datos del lunes si es domingo
    const diaActual = obtenerDiaActual();

    // Llama a la función para obtener los datos de la semana al cargar el componente
    obtenerDatosSemana()
      .then(data => {
        // Filtra los datos donde el atributo dia sea igual al día actual
        const datosFiltrados = data.filter(item => item.dia === diaActual);
        // Toma los primeros 7 datos
        const primerosDatos = datosFiltrados.slice(0, 11);
        setDatosSemana(primerosDatos);
      })
      .catch(error => {
        console.error('Error al obtener los datos de la semana:', error);
      });

    // Obtener y filtrar los datos del menú
    obtenerDatosMenu()
      .then(menu => {
        // Filtra los elementos que contienen la palabra "ensalada" en el nombre
        const ensaladas = menu.filter(item => item.nombre.toLowerCase().includes('ensalada'));
        setDatosMenu(ensaladas);

        // Filtra los elementos que contienen la palabra "papasfritas" en el nombre

      })
      .catch(error => {
        console.error('Error al obtener los datos del menú:', error);
      });


    obtenerPrecios()
      .then(data => {
        // Filtra los elementos que contienen la palabra "ensalada" en el nombre

        setvalores(data);

        // Filtra los elementos que contienen la palabra "papasfritas" en el nombre

      })
      .catch(error => {
        console.error('Error al obtener los datos del menú:', error);
      });
  }, []);

  // Función para obtener el día actual
  const obtenerDiaActual = () => {
    const hoy = new Date();
    let dia = hoy.getDay(); // 0 (Domingo) a 6 (Sábado)
    // Ajusta para mostrar los datos del lunes si hoy es domingo
    if (dia === 0) {
      dia = 1; // Lunes
    }
    // Mapea el número del día a su nombre
    const nombresDias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
    return nombresDias[dia];
  };

  const constructorOrden = () => {
    let frase = '';
    let hayElementoDuplicado = false;

    const tipos2 = botonesPresionados.filter(item => item.tipo === 2);
    if (tipos2.length > 1) {
      if (tipos2[0].nombre === tipos2[1].nombre) {
        hayElementoDuplicado = true;
      }
    }

    if (botonesPresionados.length > 0) {
      // Verificar si el primer elemento es tipo 1 o 10
      const primerElemento = botonesPresionados[0];
      if (primerElemento.tipo === 1 || primerElemento.tipo === 10) {
        frase = primerElemento.nombre;
        for (let i = 1; i < botonesPresionados.length; i++) {
          if (i === 1) {
            if (!hayElementoDuplicado) {
              frase += ' c/n ';
            } else {
              frase += ' c/n Grande ';
              i++;
            }
          } else {
            frase += ' + ';
          }
          frase += botonesPresionados[i].nombre;
        }
      } else {
        frase = botonesPresionados.map(item => item.nombre).join(' + ');
      }
    }

    setTextoOrden(frase); // Actualiza el Estado del texto de la orden
  };


  // Función para manejar el evento de presionar un botón
  const manejarPresionBoton = (item) => {
    setBotonesPresionados([...botonesPresionados, item]); // Agregar el botón presionado
    constructorOrden(); // Actualizar el texto de la orden
    setearLlaves(); // Setear las Llaves
  };


  // Función para reiniciar los botones presionados
  const reiniciarBotonesPresionados = () => {
    setBotonesPresionados([]); // Reiniciar los botones presionados
    setArregloPedidos([]);
    setTextoOrden('Orden'); // Restablecer el texto de la orden
    setearLlaves();
    setCliente('');
  };

  // Función para eliminar el último botón presionado
  const eliminarUltimoBotonPresionado = () => {
    const nuevoArreglo = [...botonesPresionados];
    nuevoArreglo.pop(); // Eliminar el último elemento del arreglo
    const nuevopedido = [...arregloPedidos];
    nuevopedido.pop(); // Eliminar el último elemento del arreglo
    setBotonesPresionados(nuevoArreglo); // Actualizar los botones presionados
    setArregloPedidos(nuevopedido);
    constructorOrden(); // Actualizar el texto de la orden
    setearLlaves();
  };
  useEffect(() => {

    constructorOrden();
    setearLlaves();
    calcularPrecio();

  }, [botonesPresionados]);

  function buscarPorId(id) {
    return botonesPresionados.some(item => item.id === id);
  };

  function buscarPorTipo(tipo) {
    return botonesPresionados.some(item => item.tipo === tipo);
  };

  function contarCantidadPorTipo(tipo) {
    return botonesPresionados.filter(item => item.tipo === tipo).length;
  };

  function cambiarPrecio(resultado) {
    setPrecio(resultado);
  }

  function calcularPrecio() {

    const CantidadAcompanna = contarCantidadPorTipo(2);

    const EnsaladaG = buscarPorId(36);
    const Proteina = buscarPorTipo(1);
    const Guiso = buscarPorTipo(10);
    const Acompanna = buscarPorTipo(2);
    const EnsaladaC = buscarPorId(24);
    const PapaC = buscarPorId(31);
    const Jalea = buscarPorId(42);
    const Flan = buscarPorId(66);
    const Pebre = buscarPorId(74);
    const LargoPedido = botonesPresionados.length;
    let resultado = 0;

    if (EnsaladaC && Acompanna && Proteina && LargoPedido === 3) {
      resultado = Cantidad * valores[0].valor;
      cambiarPrecio(resultado);
    }
    // Proteína + ensalada grande + pan
    if (EnsaladaG && Proteina && LargoPedido === 2) {
      resultado = Cantidad * valores[0].valor;
      cambiarPrecio(resultado);
    }
    //Proteína + acompañamiento + postre (jalea o flan) + pan
    // Proteína + acompañamiento + pebre + pan
    if (Proteina && Acompanna && (Flan || Pebre || Jalea) && LargoPedido === 3) {
      resultado = Cantidad * valores[0].valor;
      cambiarPrecio(resultado);
    }

    // Proteína + 2 acompañamientos + postre (jalea o flan) + pan
    //     Proteína + 2 acompañamientos + pebre + pan

    if (Proteina && CantidadAcompanna === 2 && (Flan || Pebre || Jalea) && LargoPedido === 4) {
      resultado = Cantidad * valores[0].valor;
      cambiarPrecio(resultado);
    }
    // Proteína + 2 acompañamientos + ensalada chica + pan
    if (Proteina && CantidadAcompanna === 2 && EnsaladaC && LargoPedido === 4) {
      resultado = Cantidad * valores[0].valor;
      cambiarPrecio(resultado);
    }

    // Guisado + postre (jalea o flan) + pan
    //     Guisado + pebre + pan

    if (Guiso && (Flan || Pebre || Jalea) && LargoPedido === 2) {
      resultado = Cantidad * valores[0].valor;
      cambiarPrecio(resultado);
    }

    // Proteína + papa frita chica + ensalada chica + pan

    if (Proteina && EnsaladaC && PapaC && LargoPedido === 3) {
      resultado = Cantidad * valores[1].valor;
      cambiarPrecio(resultado);
    }
    // Proteína + acompañamiento + papa frita + ensalada chica + pan
    if (Proteina && EnsaladaC && PapaC && Acompanna && LargoPedido === 4) {
      resultado = Cantidad * valores[1].valor;
      cambiarPrecio(resultado);
    }

    // Proteína + papa frita chica + postre (jalea o flan) + pan
    // Proteína + papa frita chica +pebre + pan
    if (Proteina && PapaC && (Flan || Pebre || Jalea) && LargoPedido === 3) {
      resultado = Cantidad * valores[1].valor;
      cambiarPrecio(resultado);
    }
    // Proteína + acompañamiento + papa frita chica +postre (jalea o flan) + pan

    if (Proteina && PapaC && (Flan || Pebre || Jalea) && Acompanna && LargoPedido === 4) {
      resultado = Cantidad * valores[1].valor;
      cambiarPrecio(resultado);
    }
    // Guiso solo / proteína + acompañamiento = $3,500
    if ((Guiso && LargoPedido === 1) || (Proteina && Acompanna && LargoPedido === 2)) {
      resultado = Cantidad * valores[2].valor;
      cambiarPrecio(resultado);
    }

    // INDIVIDUALES

    if (LargoPedido === 1) {
      const dato = botonesPresionados[0];
      const PrecioUnitario = dato.precio;
      resultado = Cantidad * PrecioUnitario;
      console.log(PrecioUnitario);
      cambiarPrecio(resultado);

    }

  };
  const eliminarItem = (index) => {
    const nuevosPedidos = arregloPedidos.filter((item, i) => i !== index);
    setArregloPedidos(nuevosPedidos);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      {/* Contenedor para los detalles del pedido */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemText}>Orden: {item.TextoOrden}</Text>
        <Text style={styles.itemText}>Cantidad: {item.Cantidad}</Text>
        <Text style={styles.itemText}>Comentario: {item.Comentario}</Text>
        <Text style={styles.itemText}>Precio: {item.Precio}</Text>
        <Text style={styles.itemText}>Número de Orden: {item.NumOrden}</Text>
      </View>
      {/* Contenedor para el botón de eliminar */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => eliminarItem(index)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );


  function meterEncargo(){
    arregloPedidos.forEach(element => {
      insertarEncargo(element,Cliente);
    });
  

  }






  return (


    <View>

      <View style={styles.inputContainer}>
        <Text>ORDEN:</Text>
        <TextInput
          style={styles.input}
          value={TextoOrden}
          editable={false} // Hace que el input sea de solo lectura
        />
      </View>

      {/* Input para el Comentario */}
      <View style={styles.inputContainer}>
        <Text>Comentario:</Text>
        <TextInput
          style={styles.input}
          value={Comentario}
          onChangeText={setComentario}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Cantidad:</Text>
        <TextInput
          style={styles.input}
          value={Cantidad.toString()} // Convertir el número a cadena de texto
          onChangeText={handleCantidadChange}
          keyboardType="numeric" // Para que solo acepte números
        />
      </View>


      {/* Input para el Cliente */}
      <View style={styles.inputContainer}>
        <Text>Cliente:</Text>
        <TextInput
          style={styles.input}
          value={Cliente}
          onChangeText={setCliente}
        />
      </View>

      <View>
        <View style={styles.row}>
          {datosSemana.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => manejarPresionBoton(item)}
            >
              <View style={[styles.item, { backgroundColor: index === 9 || index === 10 ? 'orange' : 'yellow' }]}>
                <Text>{item.nombre}</Text>
                <Text>Stock: {item.stockD}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={styles.row}>
            {datosMenu.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => manejarPresionBoton(item)}
              >
                <View style={[styles.item, { backgroundColor: 'lightgreen' }]}>
                  <Text>{item.nombre}</Text>
                  <Text>Stock: {item.stockG}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </View>

      <View>
        <TouchableOpacity
          onPress={abrirModal}
          style={[styles.item, { backgroundColor: 'yellow' }]} // Aplica el mismo estilo que los otros elementos
        >
          <Text>EMPANADAS </Text>
          <Text>  </Text>
        </TouchableOpacity>

        {/* Define el modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cerrarModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}></Text>

              <View style={styles.row}>
                {Empanadas.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => manejarPresionBoton(item)}
                    style={[styles.item, { backgroundColor: index === 9 || index === 10 ? 'orange' : 'yellow' }]}
                  >
                    <Text>{item.nombre}</Text>
                    <Text>Stock: {item.stockD}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button title="Cerrar" onPress={cerrarModal} />
            </View>
          </View>
        </Modal>


      </View>




      {/* Botón para reiniciar los botones presionados */}
      <View style={styles.inputContainer}>
        <Button title="Reiniciar botones" onPress={reiniciarBotonesPresionados} />
      </View>

      {/* Botón para eliminar el último botón presionado */}
      <View style={styles.inputContainer}>
        <Button title="Eliminar último botón" onPress={eliminarUltimoBotonPresionado} />
      </View>
      <View style={styles.inputContainer}><Button title="Guardar Pedido" onPress={guardarPedido} /></View>

      {/* Input para la orden */}
      <View style={styles.inputContainer}><Button title="Ver Pedidos" onPress={abrirModalTabla} /></View>

      <View style={styles.inputContainer}><Button title="Encargar" onPress={meterEncargo}  /></View>


      {/* Modal para mostrar la tabla de pedidos */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalTabla}
        onRequestClose={cerrarModalTabla}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tabla de Pedidos</Text>

            {/* FlatList para mostrar la lista de pedidos */}
            <FlatList
              data={arregloPedidos}
              renderItem={({ item, index }) => (
                <View style={styles.itemContainer}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemText}>Orden: {item.TextoOrden}</Text>
                    <Text style={styles.itemText}>Cantidad: {item.Cantidad}</Text>
                    <Text style={styles.itemText}>Comentario: {item.Comentario}</Text>
                    <Text style={styles.itemText}>Precio: {item.Precio}</Text>
                    <Text style={styles.itemText}>Número de Orden: {item.NumOrden}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => eliminarItem(index)}
                  >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

            {/* Botón para cerrar el modal */}
            <Button title="Cerrar" onPress={cerrarModalTabla} />
          </View>
        </View>
      </Modal>




    </View>

  );

};




const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: 140, // Ancho fijo para cada botón
    marginRight: 10, // Espacio entre los elementos
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  }, orderTableContainer: {
    marginTop: 20,
  }, orderTable: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  }, itemContainer: {
    flexDirection: 'row', // Alinear los elementos en una fila
    justifyContent: 'space-between', // Distribuir el espacio entre los elementos
    alignItems: 'center', // Centrar verticalmente los elementos
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1, // Que ocupe todo el espacio disponible
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemText: {
    marginBottom: 5,
  },


  itemContainer: {
    flexDirection: 'row', // Alinear los elementos en una fila
    justifyContent: 'space-between', // Distribuir el espacio entre los elementos
    alignItems: 'center', // Centrar verticalmente los elementos
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1, // Que ocupe todo el espacio disponible
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemText: {
    marginBottom: 5,
  }, modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro tras el modal
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

});

export default Caja;
