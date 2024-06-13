import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.78.98', // Especifica la dirección IP que deseas usar
    port: 5173, // Especifica el puerto que deseas usar
  },
});
