import * as fs from 'fs';
import * as path from 'path';

for (const dir of ['dist-baseline/assets', 'dist-worker/assets']) {
  const f = fs.readdirSync(dir).find(f => f.includes('ShowrumbleScene'));
  if (!f) continue;
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  console.log(`\n=== ${dir} / ${f} (${c.length} bytes) ===`);
  
  // Find 'new Worker' context
  const idx = c.indexOf('new Worker');
  if (idx >= 0) {
    console.log('  Context around new Worker:');
    console.log('    ...' + c.substring(Math.max(0, idx - 300), idx + 200) + '...');
  }
  
  // Check if EXPERIMENTAL_WORKER_GLTF is compiled to true or false
  // Look for patterns like '!false' or '!true' which indicate the flag value
  const exclamationFalse = c.indexOf('!false');
  const exclamationTrue = c.indexOf('!true');
  console.log(`  !false at index: ${exclamationFalse}`);
  console.log(`  !true at index: ${exclamationTrue}`);
  
  if (exclamationFalse >= 0) {
    console.log('  Context around !false:');
    console.log('    ...' + c.substring(Math.max(0, exclamationFalse - 100), exclamationFalse + 150) + '...');
  }
  if (exclamationTrue >= 0) {
    console.log('  Context around !true:');
    console.log('    ...' + c.substring(Math.max(0, exclamationTrue - 100), exclamationTrue + 150) + '...');
  }
}