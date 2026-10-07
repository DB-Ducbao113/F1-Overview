/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      include: ['src/utils/**', 'src/services/**'],
    },
  },
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api/jolpica': {
        target: 'https://api.jolpi.ca',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jolpica/, ''),
        headers: { 'User-Agent': 'F1-Hub/1.0' },
      },
      '/api/openf1': {
        target: 'https://api.openf1.org/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openf1/, ''),
        headers: { 'User-Agent': 'F1-Overview/1.0' },
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
});
