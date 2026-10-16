import { readdir, readFile } from 'node:fs/promises';

const assets = new URL('../dist/assets/', import.meta.url);
const entry = (await readdir(assets)).find((name) => /^ShowroomView-.*\.js$/.test(name));
if (!entry) throw new Error('Missing showroom bundle. Run the production build first.');

const visited = new Set();
async function visit(name) {
  if (visited.has(name)) return;
  visited.add(name);
  const source = await readFile(new URL(name, assets), 'utf8');
  // Follow static imports only: the scene must remain behind a dynamic import.
  for (const match of source.matchAll(/\bfrom\s*["']\.\/([^"']+\.js)["']/g)) {
    await visit(match[1]);
  }
}
await visit(entry);
if ([...visited].some((name) => /^(vendor-three|ShowroomScene)-/.test(name))) {
  throw new Error('The showroom shell must render without loading the WebGL bundle.');
}
console.log('Showroom shell: no static WebGL dependency.');
