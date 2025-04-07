import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    server: {
        allowedHosts: ["15c4-76-71-3-71.ngrok-free.app", "4a9b-76-71-3-71.ngrok-free.app"]
    }
});
