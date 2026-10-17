/**
 * Minimal static file server with SPA fallback (for react-router).
 * Serves a given directory on a given port. All non-file requests fall back
 * to index.html so client-side routing works.
 *
 * Usage: node scripts/static-server.mjs <dir> <port>
 */

import * as fs from 'fs';
import * as path from 'path';
import { createServer } from 'http';

const dir = process.argv[2] || 'dist';
const port = Number(process.argv[3] || 5173);
const absDir = path.resolve(dir);
const indexPath = path.join(absDir, 'index.html');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.glb': 'application/octet-stream',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.map': 'application/json',
};

const server = createServer((req, res) => {
  const reqPath = decodeURIComponent(path.normalize(new URL(req.url, `http://localhost:${port}`).pathname));
  const filePath = path.join(absDir, reqPath.slice(1));

  // Security: prevent path traversal
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(absDir + path.sep) && resolved !== absDir) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.stat(resolved, (err, stat) => {
    if (err || !stat.isFile()) {
      // SPA fallback
      fs.readFile(indexPath, (err2, data) => {
        if (err2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(data);
      });
      return;
    }
    const ext = path.extname(resolved).toLowerCase();
    fs.readFile(resolved, (err2, data) => {
      if (err2) { res.writeHead(500); res.end('Error'); return; }
      res.writeHead(200, {
        'Content-Type': mime[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(data);
    });
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static server: http://127.0.0.1:${port}/  (serving ${absDir})`);
});

process.on('SIGINT', () => { server.close(); process.exit(0); });
process.on('SIGTERM', () => { server.close(); process.exit(0); });
