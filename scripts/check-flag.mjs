import * as fs from 'fs';
import * as path from 'path';

function findShowroomScene(dir) {
  const assets = fs.readdirSync(path.join(dir, 'assets'));
  const f = assets.find((n) => /^ShowroomScene-.*\.js$/.test(n));
  return f ? path.join(dir, 'assets', f) : null;
}

function check(dir, label) {
  const file = findShowroomScene(dir);
  if (!file) { console.log(`${label}: no ShowroomScene bundle found`); return; }
  const c = fs.readFileSync(file, 'utf8');
  // Look for the minified preload guard: B0||P0.preload(...)  or  B0&&...
  // We look for the literal constant pattern near "preload"
  const hasPreload = c.includes('preload("/models/c42.v2.glb")');
  // Find the boolean constant used. The compiled constant for EXPERIMENTAL_WORKER_GLTF
  // will appear as a standalone true/false in a logical expression. We search for
  // "true||" or "false||" near preload.
  const preloadIdx = c.indexOf('preload("/models/c42.v2.glb")');
  const snippet = preloadIdx >= 0 ? c.slice(Math.max(0, preloadIdx - 60), preloadIdx) : '';
  console.log(`${label}:`);
  console.log(`  file: ${path.basename(file)}`);
  console.log(`  hasPreloadCall: ${hasPreload}`);
  console.log(`  snippet before preload: ${JSON.stringify(snippet)}`);
}

check('dist-baseline', 'BASELINE (flag off)');
check('dist-worker', 'WORKER (flag on)');
