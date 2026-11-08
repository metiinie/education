import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import frappeui from 'frappe-ui/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [frappeui({ port: 5173 }), vue()],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
    port: 5173,
    proxy: {
      '^/(api|assets|files)': {
        target: 'http://127.0.0.1:8000',
        ws: true,
        changeOrigin: true,
        router: function (req) {
          const host = req.headers.host || ''
          const siteName = host.split(':')[0]
          if (siteName === 'localhost' || siteName === '127.0.0.1') {
            req.headers['x-frappe-site-name'] = 'education.localhost'
          }
          return 'http://127.0.0.1:8000'
        },
      },
    },
  },
  build: {
    outDir: `../${path.basename(path.resolve('..'))}/public/frontend`,
    emptyOutDir: true,
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'frappe-ui': ['frappe-ui'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['feather-icons', 'showdown', 'engine.io-client'],
  },
})
