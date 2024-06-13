#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <sys/inotify.h>
#include <unistd.h>
#include <limits.h>

#define EVENT_SIZE (sizeof(struct inotify_event))
#define EVENT_BUF_LEN (1024 * (EVENT_SIZE + 16))

int main() {
    int length, i = 0;
    int fd;
    int wd;
    char buffer[EVENT_BUF_LEN];
    char last_created_file[NAME_MAX];

    // Inicializar el inotify
    fd = inotify_init();
    if (fd < 0) {
        perror("inotify_init");
        exit(EXIT_FAILURE);
    }

    // Agregar la carpeta Boletas al watch list
    wd = inotify_add_watch(fd, "/home/bastian/Escritorio/Boletas", IN_CREATE | IN_DELETE | IN_MODIFY);
    if (wd == -1) {
        perror("inotify_add_watch");
        exit(EXIT_FAILURE);
    }

    printf("Observando la carpeta /home/bastian/Escritorio/Boletas por cambios...\n");

    while (1) {
        i = 0;
        length = read(fd, buffer, EVENT_BUF_LEN);
        if (length < 0) {
            perror("read");
            exit(EXIT_FAILURE);
        }

        while (i < length) {
            struct inotify_event *event = (struct inotify_event *)&buffer[i];
            if (event->len) {
                if (event->mask & IN_CREATE) {
                    strcpy(last_created_file, event->name);
                } else if (event->mask & IN_DELETE) {
                    printf("Se eliminó el archivo: %s\n", event->name);
                } else if (event->mask & IN_MODIFY) {
                    printf("Se modificó el archivo: %s\n", event->name);
                }
            }
            i += EVENT_SIZE + event->len;
        }

        // Mostrar el nombre del último archivo creado en la carpeta
        if (strlen(last_created_file) > 0) {
            printf("Último archivo creado: %s\n", last_created_file);

            // Imprimir el último archivo creado por la impresora
            char command[1024];
            snprintf(command, sizeof(command), "lp -d NOMBRE_DE_LA_IMPRESORA '/home/bastian/Escritorio/Boletas/%s'", last_created_file);
            system(command);

            memset(last_created_file, 0, sizeof(last_created_file));
        }

        // Actualizar la cantidad de archivos en la carpeta
        system("ls /home/bastian/Escritorio/Boletas | wc -l > /home/bastian/Escritorio/cantidad_archivos.txt");
    }

    // Remover el watch y cerrar el inotify
    inotify_rm_watch(fd, wd);
    close(fd);

    return 0;
}





