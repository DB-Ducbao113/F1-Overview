import * as fs from 'fs';
import * as path from 'path';

for (const dir of ['dist-baseline/assets', 'dist-worker/assets']) {
  console.log(`\n=== ${dir} ===`);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f.toLowerCase().includes('showroom'));
  for (const f of files) {
    const c = fs.readFileSync(path.join(dir, f), 'utf8');
    console.log(`\n  File: ${f} (${c.length} bytes)`);
    
    // Check for EXPERIMENTAL_WORKER_GLTF substitution
    const hasFlagLiteral = c.includes('EXPERIMENTAL_WORKER_GLTF');
    const hasTrueLiteral = c.includes("==='true'");
    const hasFalseLiteral = c.includes("==='false'");
    
    console.log(`    EXPERIMENTAL_WORKER_GLTF literal: ${hasFlagLiteral}`);
    console.log(`    === 'true' literal: ${hasTrueLiteral}`);
    console.log(`    === 'false' literal: ${hasFalseLiteral}`);
    
    // Find new Worker context
    const idx = c.indexOf('new Worker');
    if (idx >= 0) {
      console.log(`    new Worker context: ...${c.substring(Math.max(0, idx - 150), idx + 100)}...`);
    }
    
    // Check for useWorkerGLTF
    if (c.includes('useWorkerGLTF')) {
      console.log(`    useWorkerGLTF found`);
    }
  }
}