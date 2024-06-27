import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  plugins: [
    vue(),
    VueDevTools(),
    viteCompression({ // 添加 gzip 压缩插件
      verbose: true, // 是否在控制台输出压缩结果
      threshold: 50000, // 50kb
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/components')) {
            return 'components';
          }
          if (id.includes('src/views')) {
            return 'views';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000 
  }
})
