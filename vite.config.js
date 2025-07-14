import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Incluye explícitamente los módulos de Firebase para que Vite los pre-bundlee.
    // Esto ayuda a resolver problemas de importación.
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      // También puedes incluir la ruta de tu AuthContext si sigue dando problemas,
      // aunque lo ideal es que las anteriores sean suficientes.
      // './src/context/AuthContext',
    ],
  },
  resolve: {
    // Configura cómo Vite resuelve las importaciones de módulos.
    // 'mainFields' le dice a Vite qué campos buscar en el package.json de las librerías
    // para encontrar el punto de entrada correcto para entornos de navegador.
    mainFields: ['browser', 'module', 'main'],
  },
  // Opcional: Si necesitas que tu servidor de desarrollo sea accesible desde otras IPs en tu red local
  // server: {
  //   host: true,
  // },
})
