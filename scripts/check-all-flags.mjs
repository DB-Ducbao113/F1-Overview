import * as fs from 'fs';
import * as path from 'path';

const dir = process.argv[2] || 'dist-baseline/assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let foundEnv = false;
let foundTrue = false;
let foundFalse = false;
for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  if (c.includes('EXPERIMENTAL_WORKER_GLTF') || c.includes('import.meta.env.VITE_EXPERIMENTAL_WORKER_GLTF')) {
    foundEnv = true;
    console.log(`\n=== ${f} (${c.length} bytes) ===`);
    if (c.includes('import.meta.env.VITE_EXPERIMENTAL_WORKER_GLTF')) {
      console.log('  FLAG: NOT_SUBSTITUTED (import.meta.env still present)');
    } else if (c.includes("==='true'")) {
      console.log('  FLAG: TRUE');
    } else if (c.includes("==='false'")) {
      console.log('  FLAG: FALSE');
    } else {
      console.log('  FLAG: substituted but value unclear');
    }
  }
  // Always check for boolean literals regardless
  if (c.includes("==='true'")) foundTrue = true;
  if (c.includes("==='false'")) foundFalse = true;
}
if (!foundEnv) {
  console.log('No files contain EXPERIMENTAL_WORKER_GLTF literal (fully substituted)');
}
console.log(`\nFiles with === 'true': ${foundTrue}`);
console.log(`Files with === 'false': ${foundFalse}`);