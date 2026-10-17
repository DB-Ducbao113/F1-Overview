import * as fs from 'fs';
import * as path from 'path';

for (const dir of ['dist-baseline/assets', 'dist-worker/assets']) {
  console.log(`\n=== ${dir} ===`);
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
    for (const f of files) {
      const c = fs.readFileSync(path.join(dir, f), 'utf8');
      if (c.includes('new Worker') || c.includes('useWorkerGLTF') || c.includes('EXPERIMENTAL_WORKER_GLTF')) {
        console.log(`  ${f} (${c.length} bytes):`);
        if (c.includes('EXPERIMENTAL_WORKER_GLTF')) {
          const idx = c.indexOf('EXPERIMENTAL_WORKER_GLTF');
          console.log(`    EXPERIMENTAL_WORKER_GLTF at ${idx}: ...${c.substring(Math.max(0, idx-80), idx+120)}...`);
        }
        if (c.includes("==='true'")) console.log('    === true');
        if (c.includes("==='false'")) console.log('    === false');
        if (c.includes('new Worker')) console.log('    new Worker');
        if (c.includes('useWorkerGLTF')) console.log('    useWorkerGLTF');
      }
    }
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }
}