import React, { useEffect, useState } from "react";
import { obtenerDatosMenu } from "../Consultas/GET/getmenu";
import NuevoItem from "./ingresarItem";
import DatosIngresados from "./DatosIngresados";
import MenuTable from "./funcion_tabla";
import { eliminarMenu } from "../Consultas/DELETE/elminarMenu";
import Combos from "./combos";
import CrearCombos from "./Crearcombos";
import Reparar from "./reparErrores";

export default function Stock() {
  const [datosMenu, setDatosMenu] = useState([]);
  const [activeTab, setActiveTab] = useState("menu"); // Estado para controlar qué mostrar

  // Función para obtener datos del menú
  async function datosMenuStock() {
    try {
      const data = await obtenerDatosMenu(); // Espera a que la promesa se resuelva
      setDatosMenu(data); // Luego, establece los datos
    } catch (error) {
      console.error("Error al obtener datos del menú:", error); // Maneja cualquier error
    }
  }

  useEffect(() => {
    // Obtener datos del menú al montar el componente
    datosMenuStock(); // Llama a la función aquí
  }, []);

  // Función para eliminar un ítem del menú
  const handleEliminarItem = async (nombre) => {
    try {
      await eliminarMenu(nombre); // Llamar a la función para eliminar el ítem usando el nombre
      setDatosMenu((prevDatosMenu) =>
        prevDatosMenu.filter((item) => item.nombre !== nombre)
      ); // Actualizar el estado después de eliminar
    } catch (error) {
      console.error("Error al eliminar el ítem:", error);
    }
  };

  useEffect(() => {
    // Obtener datos del menú al montar el componente
    console.log(datosMenu); // Llama a la función aquí, usando paréntesis para ejecutar la función
  }, [datosMenu]);

  // Función para mostrar la tabla del menú
  const handleShowMenu = () => {
    setActiveTab("menu");
  };

  // Función para mostrar el componente de ingresar ítem
  const handleShowIngresarItem = () => {
    setActiveTab("ingresarItem");
  };

  // Función para mostrar el componente de datos ingresados
  const handleShowDatosIngresados = () => {
    setActiveTab("editarStock");
  };

  // Función para mostrar el componente de combos
  const handleShowCombos = () => {
    setActiveTab("combos");
  };

  // Función para mostrar el componente de crear combos
  const handleShowcrearCombos = () => {
    setActiveTab("crearcombos");
  };

  const handleShowReparar = () => {
    setActiveTab("reparar");
  };

  // Función para renderizar el contenido basado en el estado activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "menu":
        return (
          <MenuTable
            datosMenu={datosMenu}
            handleEliminarItem={handleEliminarItem}
          />
        );
      case "ingresarItem":
        return <NuevoItem datosMenuStock={datosMenuStock} />;
      case "editarStock":
        return <DatosIngresados />;
      case "combos":
        return <Combos />;
      case "crearcombos":
        return <CrearCombos />;
      case "reparar":
        return <Reparar />;
      default:
        return <div>Selecciona una opción</div>;
    }
  };

  return (
    <div className="flex w-screen h-screen bg-black text-white">
      {/* Columna izquierda (10%) */}
      <div className="w-[10%] p-4 bg-gray-800 flex flex-col items-center justify-start">
        <button
          style={{ marginTop: "100px", width: "100%", padding: "12px 0" }}
          onClick={handleShowMenu}
          className="bg-yellow-500 text-black px-4 py-2 rounded mb-4"
        >
          Menu
        </button>
        <button
          style={{ width: "100%", padding: "12px 0" }}
          onClick={handleShowIngresarItem}
          className="bg-yellow-500 text-black px-4 py-2 rounded mb-4"
        >
          Ingresar Item
        </button>
        <button
          style={{ width: "100%", padding: "12px 0" }}
          onClick={handleShowDatosIngresados}
          className="bg-yellow-500 text-black px-4 py-2 rounded mb-4"
        >
          Editar Stock
        </button>
        <button
          style={{ width: "100%", padding: "12px 0" }}
          onClick={handleShowCombos}
          className="bg-yellow-500 text-black px-4 py-2 rounded mb-4"
        >
          Combos
        </button>

        <button
          style={{ width: "100%", padding: "12px 0" }}
          onClick={handleShowcrearCombos}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          Crear Combos
        </button>
        <br></br>
        <button
          style={{ width: "100%", padding: "13px 0" }}
          onClick={handleShowReparar}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          Reparaciones
        </button>
      </div>
      {/* Columna derecha (90%) */}
      <div className="w-[90%] p-4 overflow-y-auto">
        {/* Mostrar el contenido basado en el estado activeTab */}
        {renderContent()}
      </div>
    </div>
  );
}
