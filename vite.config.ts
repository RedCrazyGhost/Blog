import path from "path"
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
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
    rollupOptions: {
      output: {
        // 代码分割优化
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-ui': ['bootstrap', 'ant-design-vue'],
          'vendor-markdown': ['marked', 'mermaid'],
          'vendor-github': ['octokit'],
          'vendor-icons': [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/vue-fontawesome'
          ],
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // 开发服务器配置
  server: {
    port: 5173,
    open: false,
    host: true,
  }
})