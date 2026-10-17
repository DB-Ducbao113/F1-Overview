import * as fs from 'fs';
import * as path from 'path';

const dir = process.argv[2] || 'dist-worker/assets';
const files = fs.readdirSync(dir).filter(f => f.includes('ShowroomScene'));
if (files.length === 0) {
  console.log('No ShowrumbleScene file found in', dir);
  process.exit(1);
}
const c = fs.readFileSync(path.join(dir, files[0]), 'utf8');
console.log(`File: ${files[0]} (${c.length} bytes)`);

// Search for how the flag is used
const lines = c.split('\n');
for (const [i, line] of lines.entries()) {
  if (line.includes('EXPERIMENTAL_WORKER_GLTF') || line.includes('useWorkerGLTF') || line.includes('new Worker')) {
    console.log(`  Line ${i + 1}: ${line.substring(0, 300)}`);
  }
}

// Also check for the boolean literal near any useWorkerGLTF call
for (const [i, line] of lines.entries()) {
  if (line.includes('useWorkerGLTF')) {
    console.log(`\n  Context around useWorkerGLTF (line ${i + 1}):`);
    const start = Math.max(0, i - 3);
    const end = Math.min(lines.length, i + 3);
    for (let j = start; j < end; j++) {
      console.log(`    ${j + 1}: ${lines[j]}`);
    }
  }
}