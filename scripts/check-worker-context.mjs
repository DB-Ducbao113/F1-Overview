import * as fs from 'fs';
import * as path from 'path';

const dir = 'dist-worker/assets';
const file = fs.readdirSync(dir).find(f => f.includes('ShowrumbleScene'));
if (!file) {
  console.log('No ShowrumbleScene file found');
  process.exit(1);
}
const c = fs.readFileSync(path.join(dir, file), 'utf8');

// Find all occurrences of 'new Worker'
let idx = 0;
while ((idx = c.indexOf('new Worker', idx)) >= 0) {
  console.log(`\nFound 'new Worker' at index ${idx}:`);
  console.log('  ...' + c.substring(Math.max(0, idx - 200), idx + 200) + '...');
  idx++;
}

// Also search for 'EXPERIMENTAL_WORKER_GLTF' context
const flagIdx = c.indexOf('EXPERIMENTAL_WORKER_GLTF');
if (flagIdx >= 0) {
  console.log(`\nFound 'EXPERIMENTAL_WORKER_GLTF' at index ${flagIdx}:`);
  console.log('  ...' + c.substring(Math.max(0, flagIdx - 200), flagIdx + 200) + '...');
} else {
  console.log('\nEXPERIMENTAL_WORKER_GLTF not found (substituted)');
}