import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
   esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent'
    }
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  server:{
    allowedHosts:["8875-169-150-196-139.ngrok-free.app"],
    hmr:{
      overlay:false
    },
    host: true
  },
  build:{
    rollupOptions:{
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
      }
  }
}
})
