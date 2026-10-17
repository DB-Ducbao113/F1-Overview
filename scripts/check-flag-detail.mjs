import * as fs from 'fs';
import * as path from 'path';

const dir = process.argv[2] || 'dist-baseline/assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
for (const f of files) {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  if (c.includes('EXPERIMENTAL_WORKER_GLTF') || c.includes("==='true'") || c.includes("==='false'") || c.includes('== true') || c.includes('== false')) {
    console.log(`\n=== ${f} (${c.length} bytes) ===`);
    const lines = c.split('\n');
    for (const [i, line] of lines.entries()) {
      if (line.includes('EXPERIMENTAL_WORKER_GLTF') || line.includes("==='true'") || line.includes("==='false'") || line.includes("== true") || line.includes("== false")) {
        console.log(`  Line ${i + 1}: ${line.substring(0, 200)}`);
      }
    }
  }
}