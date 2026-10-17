import * as fs from 'fs';
import * as path from 'path';

const dir = process.argv[2] || 'dist-worker/assets';
const file = fs.readdirSync(dir).find(f => f.includes('ShowrumbleScene'));
if (!file) {
  console.log('No ShowrumbleScene file found in', dir);
  process.exit(1);
}
const c = fs.readFileSync(path.join(dir, file), 'utf8');

// Search for the pattern around useWorkerGLTF call
for (const [i, line] of c.split('\n').entries()) {
  if (line.includes('EXPERIMENTAL_WORKER_GLTF') || line.includes('useWorkerGLTF') || line.includes('new Worker')) {
    console.log(`  Line ${i + 1}: ${line.substring(0, 500)}`);
  }
}

// Also search for boolean literals near the flag
for (const [i, line] of c.split('\n').entries()) {
  if (line.includes('useWorkerGLTF') || line.includes('new Worker')) {
    console.log(`\n  Full context around line ${i + 1}:`);
    const start = Math.max(0, i - 5);
    const end = Math.min(c.split('\n').length, i + 5);
    for (let j = start; j < end; j++) {
      console.log(`    ${j + 1}: ${lines[j]}`);
    }
  }
}