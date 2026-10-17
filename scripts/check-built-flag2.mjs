import * as fs from 'fs';
import * as path from 'path';

for (const dir of ['dist-baseline/assets', 'dist-worker/assets']) {
  const f = fs.readdirSync(dir).find(f => f.includes('ShowrumbleScene'));
  if (!f) {
    console.log(`\n=== ${dir}: No ShowrumbleScene file found ===\n`);
    continue;
  }
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  console.log(`\n=== ${dir} / ${f} (${c.length} bytes) ===`);
  console.log('  new Worker found:', c.includes('new Worker'));
  console.log('  EXPERIMENTAL_WORKER_GLTF found:', c.includes('EXPERIMENTAL_WORKER_GLTF'));
  console.log('  useWorkerGLTF found:', c.includes('useWorkerGLTF'));
  console.log('  !false found:', c.includes('!false'));
  console.log('  !true found:', c.includes('!true'));
  console.log('  VITE_EXPERIMENTAL_WORKER_GLTF found:', c.includes('VITE_EXPERIMENTAL_WORKER_GLTF'));
  
  // Show context around useWorkerGLTF if found
  const idx = c.indexOf('useWorkerGLTF');
  if (idx >= 0) {
    console.log('  Context around useWorkerGLTF:');
    console.log(`    ...${c.substring(Math.max(0, idx - 200), idx + 200)}...`);
  }
}