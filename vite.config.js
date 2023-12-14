import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/admin/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin\/api/, '/api'),
      },
      '/check/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/check\/api/, '/api'),
      },
      '/music/api': {
        target: 'http://175.24.198.84:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/music\/api/, ''),
      },
    },
  }
});
