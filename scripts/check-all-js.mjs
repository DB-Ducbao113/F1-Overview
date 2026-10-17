import * as fs from 'fs';
import * as path from 'path';

for (const dir of ['dist-baseline/assets', 'dist-worker/assets']) {
  console.log(`\n=== ${dir} ===`);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const f of files) {
    const c = fs.readFileSync(path.join(dir, f), 'utf8');
    const hasFlag = c.includes('EXPERIMENTAL_WORKER_GLTF');
    const hasTrue = c.includes("==='true'");
    const hasFalse = c.includes("==='false'");
    const hasWorker = c.includes('new Worker');
    const hasUseWorkerGLTF = c.includes('useWorkerGLTF');
    if (hasFlag || hasTrue || hasFalse || hasWorker || hasUseWorkerGLTF) {
      console.log(`  ${f} (${c.length} bytes):`);
      if (hasFlag) console.log('    -> EXPERIMENTAL_WORKER_GLTF found');
      if (hasTrue) console.log('    -> === true found');
      if (hasFalse) console.log('    -> === false found');
      if (hasWorker) console.log('    -> new Worker found');
      if (hasUseWorkerGLTF) console.log('    -> useWorkerGLTF found');
    }
  }
}