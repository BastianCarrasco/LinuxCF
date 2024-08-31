#!/bin/bash

while true; do
    # Directorio donde se buscarán los archivos PDF
    directorio="/home/eduardo/Escritorio/Boletas"

    # Verificar si hay archivos PDF en el directorio
    if ls "$directorio"/*.pdf >/dev/null 2>&1; then
        # Mostrar mensaje en la terminal
        echo "SE CREÓ UN PDF NUEVO!!!"

        # Enviar el PDF a imprimir
        lp -d Thermal80 "$directorio"/*.pdf

        # Borrar el PDF después de imprimirlo
        rm -f "$directorio"/*.pdf
    fi
    # Esperar un tiempo antes de volver a verificar
    sleep 3  # Espera 3 segundos antes de volver a verificar
done



