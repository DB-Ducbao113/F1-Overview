import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const assetPaths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map((match) => match[1]);
const uniqueAssets = [...new Set(assetPaths)];
const sizes = await Promise.all(
  uniqueAssets.map(async (assetPath) => {
    const source = await readFile(new URL('../dist' + assetPath, import.meta.url));
    return { assetPath, bytes: gzipSync(source).byteLength };
  }),
);
const totalBytes = sizes.reduce((total, asset) => total + asset.bytes, 0);
const maxBytes = 180 * 1024;

console.table(sizes.map(({ assetPath, bytes }) => ({ asset: assetPath, gzipKiB: (bytes / 1024).toFixed(1) })));
console.log('Initial JavaScript: ' + (totalBytes / 1024).toFixed(1) + ' KiB gzip (budget: 180 KiB)');

if (totalBytes > maxBytes) {
  throw new Error('Initial JavaScript bundle exceeds the 180 KiB gzip budget.');
}
