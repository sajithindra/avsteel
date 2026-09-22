import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'model-viewer'
        }
      }
    }),
    vueDevTools(),
  ],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@google/model-viewer') || id.includes('lit-html') || id.includes('lit-element')) {
              return 'vendor-3d-engine'
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase'
            }
            if (id.includes('vue') || id.includes('pinia')) {
              return 'vendor-vue'
            }
            return 'vendor-common'
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200
  }
})
