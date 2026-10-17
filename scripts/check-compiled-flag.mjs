import * as fs from 'fs';
import * as path from 'path';

for (const dir of ['dist-baseline/assets', 'dist-worker/assets']) {
  const f = fs.readdirSync(dir).find(f => f.includes('ShowrumbleScene'));
  if (!f) continue;
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  console.log(`\n=== ${dir} / ${f} (${c.length} bytes) ===`);
  console.log('  typeof Worker found:', c.includes('typeof Worker'));
  console.log('  !false found:', c.includes('!false'));
  console.log('  !true found:', c.includes('!true'));
  console.log('  == true found:', c.includes('== true'));
  console.log('  == false found:', c.includes('== false'));
  const idx = c.indexOf('typeof Worker');
  if (idx >= 0) {
    console.log('  Context around typeof Worker:');
    console.log('    ...' + c.substring(Math.max(0, idx - 80), idx + 150) + '...');
  }
  const idx2 = c.indexOf('!false');
  if (idx2 >= 0) {
    console.log('  Context around !false:');
    console.log('    ...' + c.substring(Math.max(0, idx2 - 80), idx2 + 150) + '...');
  }
  const idx3 = c.indexOf('!true');
  if (idx3 >= 0) {
    console.log('  Context around !true:');
    console.log('    ...' + c.substring(Math.max(0, idx3 - 80), idx3 + 150) + '...');
  }
}