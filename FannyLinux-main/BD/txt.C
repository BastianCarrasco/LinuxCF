
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <errno.h>

int main() {
    // Comando para iniciar XAMPP
    printf("Iniciando XAMPP...\n");
    system("sudo /opt/lampp/lampp start");

    // Espera hasta que Apache y MySQL estén en funcionamiento
    int xampp_running = 0;
    while (!xampp_running) {
        if (system("pgrep -f 'apache2' > /dev/null && pgrep -f 'mysqld' > /dev/null") == 0) {
            printf("XAMPP está activo.\n");
            xampp_running = 1;
        }
        sleep(1);
    }

    // Verificar si el puerto 5150 está en uso
    int port = 5150;
    struct sockaddr_in addr;
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) {
        perror("Error al crear socket");
        return 1;
    }
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_ANY);
    addr.sin_port = htons(port);

    int result = bind(sockfd, (struct sockaddr *)&addr, sizeof(addr));
    if (result < 0) {
        if (errno == EADDRINUSE) {
            printf("El puerto %d ya está en uso, el backend no se iniciará.\n", port);
            // No inicie el backend, salga del programa o maneje la situación según sea necesario
            close(sockfd);
            return 1;
        } else {
            perror("Error al intentar vincular el socket");
            close(sockfd);
            return 1;
        }
    }
    close(sockfd);

    // Activar el backend
    printf("Activando el backend...\n");
    chdir("/home/bastian/Documentos/GitHub/FannyLinux/backend");
    system("npm start &");
    sleep(5); // Esperar un poco para que el backend se inicie (ajustar según sea necesario)

    // Activar el frontend
    printf("Activando el frontend...\n");
    chdir("/home/bastian/Documentos/GitHub/FannyLinux/frontend");
    system("npm run dev &");
    sleep(5); // Esperar un poco para que el frontend se inicie (ajustar según sea necesario)

    // Abrir el navegador en la dirección especificada
    printf("Abriendo el navegador...\n");
    system("xdg-open http://localhost:5173/");

    return 0;
}






