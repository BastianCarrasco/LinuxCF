import subprocess
import threading
import time
import webbrowser

# Función para ejecutar npm start en el backend
def start_backend():
    subprocess.run(["npm", "start"], cwd="/home/eduardo/Escritorio/Github/LinuxCF/CFannyTailwing/backend")

# Función para ejecutar npm run dev en el frontend y abrir el navegador
def start_frontend():
    # Ejecutar el comando npm run dev en el directorio del frontend
    comando_npm_run_dev = "npm run dev -- --host"
    frontend_dir = "/home/eduardo/Escritorio/Github/LinuxCF/CFannyTailwing/frontend/Cfanny"
    
    # Ejecutar el comando npm run dev usando subprocess en segundo plano
    process = subprocess.Popen(comando_npm_run_dev, cwd=frontend_dir, shell=True)
    
    # Esperar a que el servidor esté disponible (ajustar según sea necesario)
    time.sleep(3)  # Ajusta el tiempo de espera si es necesario
    
    # Verificar si el proceso sigue corriendo
    if process.poll() is None:
        # Abrir el navegador con la URL del frontend
        webbrowser.open("http://192.168.240.98:5173/")
    
    # Esperar a que el proceso termine antes de continuar
    process.wait()

# Crear hilos para ejecutar los comandos simultáneamente
backend_thread = threading.Thread(target=start_backend)
frontend_thread = threading.Thread(target=start_frontend)

# Iniciar los hilos
backend_thread.start()
frontend_thread.start()

# Esperar a que ambos hilos terminen
backend_thread.join()
frontend_thread.join()

print("Ambos procesos han terminado.")



