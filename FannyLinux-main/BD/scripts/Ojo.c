#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <sys/inotify.h>
#include <unistd.h>
#include <limits.h>
#include <dirent.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <time.h>

#define EVENT_SIZE (sizeof(struct inotify_event))
#define EVENT_BUF_LEN (1024 * (EVENT_SIZE + 16))
#define WAIT_TIME_SECONDS 10 // Tiempo de espera en segundos

// Estructura para mantener el registro de los archivos abiertos
typedef struct {
    char filename[NAME_MAX];
} OpenedFile;

// Función para obtener el archivo más nuevo en la carpeta
void get_newest_file(char *folder_path, char *newest_file, time_t *newest_time) {
    DIR *dir;
    struct dirent *entry;
    struct stat file_stat;

    dir = opendir(folder_path);
    if (dir == NULL) {
        perror("opendir");
        exit(EXIT_FAILURE);
    }

    *newest_time = 0; // Inicializar la fecha del archivo más nuevo a 0

    while ((entry = readdir(dir)) != NULL) {
        if (entry->d_type == DT_REG) {  // Si es un archivo regular
            char file_path[PATH_MAX];
            snprintf(file_path, sizeof(file_path), "%s/%s", folder_path, entry->d_name);

            // Ignorar archivos con extensión .part
            if (strstr(entry->d_name, ".part") != NULL) {
                continue;
            }

            if (stat(file_path, &file_stat) == -1) {
                perror("stat");
                exit(EXIT_FAILURE);
            }

            // Verificar si es un archivo PDF
            if (strstr(entry->d_name, ".pdf") != NULL && file_stat.st_mtime > *newest_time) {
                *newest_time = file_stat.st_mtime;
                strcpy(newest_file, entry->d_name);
            }
        }
    }

    closedir(dir);
}

// Función para verificar si un archivo ya ha sido abierto
int is_file_opened(const char *filename, OpenedFile *opened_files, int num_opened_files) {
    for (int i = 0; i < num_opened_files; i++) {
        if (strcmp(filename, opened_files[i].filename) == 0) {
            return 1; // Archivo encontrado en la lista de archivos abiertos
        }
    }
    return 0; // Archivo no encontrado en la lista de archivos abiertos
}

// Función para esperar un cierto período de tiempo
void wait_seconds(int seconds) {
    time_t start_time, current_time;
    time(&start_time);
    do {
        time(&current_time);
    } while (current_time - start_time < seconds);
}

int main() {
    int length, i = 0;
    int fd;
    int wd;
    char buffer[EVENT_BUF_LEN];
    char newest_file[NAME_MAX];
    char file_path[PATH_MAX];
    char command[PATH_MAX + 10]; // Suficientemente grande para contener el comando "xdg-open" y la ruta del archivo

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
    printf("Presiona 'q' y Enter para salir\n");

    OpenedFile opened_files[100]; // Lista para mantener el registro de los archivos abiertos
    int num_opened_files = 0; // Número de archivos abiertos

    while (1) {
        i = 0;
        length = read(fd, buffer, EVENT_BUF_LEN);
        if (length < 0) {
            perror("read");
            exit(EXIT_FAILURE);
        }

        // Encontrar el archivo más nuevo en la carpeta
        time_t newest_time;
        get_newest_file("/home/bastian/Escritorio/Boletas", newest_file, &newest_time);

        // Esperar un período de tiempo después de detectar un nuevo archivo
        if (strlen(newest_file) > 0 && !is_file_opened(newest_file, opened_files, num_opened_files)) {
            // Verificar si el archivo más nuevo es un archivo PDF
            if (strstr(newest_file, ".pdf") != NULL) {
                printf("Se detectó un nuevo archivo PDF: %s. Esperando %d segundos...\n", newest_file, WAIT_TIME_SECONDS);
                wait_seconds(WAIT_TIME_SECONDS);
                printf("Tiempo de espera completado. Abriendo el archivo PDF: %s\n", newest_file);
                snprintf(file_path, sizeof(file_path), "/home/bastian/Escritorio/Boletas/%s", newest_file);
                snprintf(command, sizeof(command), "xdg-open \"%s\"", file_path);
                system(command);

                // Registrar el archivo abierto
                if (num_opened_files < sizeof(opened_files) / sizeof(opened_files[0])) {
                    strcpy(opened_files[num_opened_files].filename, newest_file);
                    num_opened_files++;
                } else {
                    printf("Número máximo de archivos abiertos alcanzado\n");
                }
            } else {
                printf("El archivo detectado no es un archivo PDF: %s. Ignorando...\n", newest_file);
            }
        }

        // Verificar si se presionó la tecla 'q' para salir
        char c;
        if (read(STDIN_FILENO, &c, 1) != -1) {
            if (c == 'q') {
                break;
            }
        }
    }

    // Remover el watch y cerrar el inotify
    inotify_rm_watch(fd, wd);
    close(fd);

    return 0;
}

