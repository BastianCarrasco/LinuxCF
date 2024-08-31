#!/bin/bash

# Abre el primer terminal para ejecutar el script Python
gnome-terminal -- bash -c "python3 /home/eduardo/Escritorio/PROTOCOLO/prender.py; exec bash"

# Abre el segundo terminal para ejecutar el script Bash
gnome-terminal -- bash -c "/home/eduardo/Escritorio/PROTOCOLO/monitor_pdf.sh; exec bash"

