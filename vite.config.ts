/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import type { Plugin } from 'vite';

function liveApiPlugin(): Plugin {
  return {
    name: 'vite-live-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
        if (url.pathname.startsWith('/api/live/')) {
          const endpoint = url.pathname.replace(/^\/api\/live\//, '');
          try {
            let handlerModule: any = null;
            if (endpoint === 'session') handlerModule = await import('./api/live/session.ts');
            else if (endpoint === 'track') handlerModule = await import('./api/live/track.ts');
            else if (endpoint === 'timing') handlerModule = await import('./api/live/timing.ts');
            else if (endpoint === 'control') handlerModule = await import('./api/live/control.ts');

            if (handlerModule && handlerModule.default) {
              const query: Record<string, string> = {};
              url.searchParams.forEach((v, k) => {
                query[k] = v;
              });
              const vercelReq = Object.assign(req, { query });
              const vercelRes = Object.assign(res, {
                status(code: number) {
                  res.statusCode = code;
                  return vercelRes;
                },
                json(data: any) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return vercelRes;
                },
                send(data: any) {
                  res.end(data);
                  return vercelRes;
                },
              });
              await handlerModule.default(vercelReq, vercelRes);
              return;
            }
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: String(err) }));
            return;
          }
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), liveApiPlugin()],
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
