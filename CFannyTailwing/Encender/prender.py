import subprocess
import threading

# Función para ejecutar npm start en el backend
def start_backend():
    subprocess.run(["npm", "start"], cwd="C:\\Users\\56974\\Desktop\\SW\\LinuxCF\\CFannyTailwing\\backend", shell=True)

# Función para ejecutar npm run dev en el frontend
def start_frontend():
    subprocess.run(["npm", "run", "dev"], cwd="C:\\Users\\56974\\Desktop\\SW\\LinuxCF\\CFannyTailwing\\frontend\\Cfanny", shell=True)

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
