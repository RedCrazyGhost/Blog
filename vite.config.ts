import path from "path"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(() => {
return{
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    build: {
      chunkSizeWarningLimit: 10240,
      sourcemap: false,
      copyPublicDir: true,
      outDir: "dist",
      assetsDir: "assets",
      terserOptions:{
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }

    }
}
})