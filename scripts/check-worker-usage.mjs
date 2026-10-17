import * as fs from 'fs';
import * as path from 'path';

for (const dir of ['dist-baseline/assets', 'dist-worker/assets']) {
  console.log(`\n=== ${dir} ===`);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  for (const f of files) {
    const c = fs.readFileSync(path.join(dir, f), 'utf8');
    const hasUseWorkerGLTF = c.includes('useWorkerGLTF');
    const hasNewWorker = c.includes('new Worker');
    const hasWorkerConstructor = c.includes('Worker');
    if (hasUseWorkerGLTF || hasNewWorker || hasWorkerConstructor) {
      console.log(`  ${f} (${c.length} bytes):`);
      if (hasUseWorkerGLTF) console.log('    -> useWorkerGLTF found');
      if (hasNewWorker) console.log('    -> new Worker found');
      if (hasWorkerConstructor) console.log('    -> Worker constructor found');
    }
  }
}