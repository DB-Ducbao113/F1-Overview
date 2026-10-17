import * as fs from 'fs';
import * as path from 'path';

for (const dir of ['dist-baseline/assets', 'dist-worker/assets']) {
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f.includes('Showroom'));
    console.log(`\n=== ${dir} (${files.length} Showroom files) ===`);
    for (const f of files) {
      const c = fs.readFileSync(path.join(dir, f), 'utf8');
      const hasFlag = c.includes('EXPERIMENTAL_WORKER_GLTF') || c.includes("==='true'") || c.includes("==='false'");
      console.log(`  ${f} (${c.length} bytes):`);
      if (c.includes('EXPERIMENTAL_WORKER_GLTF')) {
        console.log('    -> Contains EXPERIMENTAL_WORKER_GLTF literal');
      }
      if (c.includes("==='true'")) console.log('    -> Contains === true');
      if (c.includes("==='false'")) console.log('    -> Contains === false');
      if (c.includes('new Worker')) console.log('    -> Contains new Worker');
      if (c.includes('useWorkerGLTF')) console.log('    -> Contains useWorkerGLTF');
    }
  } catch (e) {
    console.log(`\n=== ${dir}: Not found ===`);
  }
}