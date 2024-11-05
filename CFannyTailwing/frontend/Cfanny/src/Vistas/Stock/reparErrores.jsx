import React, { useState, useEffect } from "react";
import { obtenerDatosMenu } from "../Consultas/GET/getmenu";
import { insertarMenuID } from "../Consultas/INSERT/InsertMenuID";

export default function Reparar() {
  const [existe, setExiste] = useState(false);

  useEffect(() => {
    // Llamar a la función para verificar si el elemento existe en el menú
    const verificarExistencia = async () => {
      try {
        const datosMenu = await obtenerDatosMenu();

        // Buscar si el elemento con ID 24 y nombre "EnsaladaC" existe en los datos
        const itemExiste = datosMenu.some(
          (item) =>
            item.id === 24 &&
            item.nombre === "EnsaladaC" &&
            item.tipo === 14 &&
            item.precio === 1100 &&
            item.stockG === 43
        );

        setExiste(itemExiste);
      } catch (error) {
        console.error("Error al obtener los datos del menú:", error);
      }
    };

    verificarExistencia();
  }, []);

  // Función para insertar el elemento si no existe
  const insertarSiNoExiste = async () => {
    const nuevoItem = {
      id: 24,
      nombre: "EnsaladaC",
      tipo: 14,
      precio: 1100,
      stockG: 43,
    };

    try {
      await insertarMenuID(
        nuevoItem.id,
        nuevoItem.nombre,
        nuevoItem.tipo,
        nuevoItem.precio,
        nuevoItem.stockG
      );
      console.log("El elemento ha sido insertado en el menú.");
      setExiste(true); // Actualizar el estado para reflejar que el elemento ahora existe
      window.location.reload(); // Recargar la página
    } catch (error) {
      console.error("Error al insertar el elemento en el menú:", error);
    }
  };

  // Renderizar solo si el elemento no existe
  return (
    <div>
      {!existe && (
        <div>
          <p>
            El elemento con ID 24 y nombre "EnsaladaC" no existe en el menú.
          </p>
          <button onClick={insertarSiNoExiste}>Insertar elemento</button>
        </div>
      )}
    </div>
  );
}
