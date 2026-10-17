import * as fs from 'fs';
import * as path from 'path';

const dir = process.argv[2] || 'dist-baseline/assets';
const files = fs.readdirSync(dir).filter(f => f.includes('ShowrumbleScene'));
console.log(`Found ${files.length} ShowrumbleScene file(s) in ${dir}`);
for (const f of files) {
  const fullPath = path.join(dir, f);
  const c = fs.readFileSync(fullPath, 'utf8');
  console.log(`\n=== ${f} (${c.length} bytes) ===`);
  if (c.includes('import.meta.env.VITE_EXPERIMENTAL_WORKER_GLTF')) {
    console.log('  FLAG: NOT_SUBSTITUTED (import.meta.env still present)');
  } else if (c.includes("==='true'")) {
    console.log('  FLAG: TRUE');
  } else if (c.includes("==='false'")) {
    console.log('  FLAG: FALSE');
  } else if (c.includes('=== true')) {
    console.log('  FLAG: TRUE (with spaces)');
  } else if (c.includes('=== false')) {
    console.log('  FLAG: FALSE (with spaces)');
  } else {
    const idx = c.indexOf('EXPERIMENTAL_WORKER_GLTF');
    if (idx >= 0) {
      console.log(`  Found EXPERIMENTAL_WORKER_GLTF at index ${idx}`);
      console.log(`  Context: ...${c.substring(Math.max(0, idx - 80), idx + 120)}...`);
    } else {
      console.log('  FLAG: NOT FOUND - flag variable not present');
    }
  }
}