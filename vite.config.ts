import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api/jolpica': {
        target: 'https://api.jolpi.ca',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jolpica/, ''),
        headers: { 'User-Agent': 'F1-Hub/1.0' },
      },
    },
  },
});
