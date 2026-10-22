import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const root = path.resolve(
  'docs/commercialization/r3/blender-authoring/c42-reconstruction-d1/evidence',
);
const output = path.join(root, 'comparison-sheets');
const views = [
  'top',
  'side',
  'front',
  'rear',
  'front-three-quarter',
  'rear-three-quarter',
  'cockpit-close-up',
  'halo-construction',
  'nose-front-wing',
  'sidepod-inlet',
  'floor-diffuser',
  'suspension-wheels-brakes',
];

fs.mkdirSync(output, { recursive: true });
for (const view of views) {
  const left = PNG.sync.read(fs.readFileSync(path.join(root, 'c42-reference', `${view}.png`)));
  const right = PNG.sync.read(fs.readFileSync(path.join(root, 'eds-clay', `${view}.png`)));
  if (left.width !== right.width || left.height !== right.height) {
    throw new Error(`Image dimensions differ for ${view}`);
  }
  const gap = 8;
  const sheet = new PNG({ width: left.width * 2 + gap, height: left.height });
  PNG.bitblt(left, sheet, 0, 0, left.width, left.height, 0, 0);
  PNG.bitblt(right, sheet, 0, 0, right.width, right.height, left.width + gap, 0);
  fs.writeFileSync(path.join(output, `c42-vs-eds-${view}.png`), PNG.sync.write(sheet));
}

console.log(JSON.stringify({ output, sheets: views.length, layout: 'C42 left; EDS-G03 D1 right' }));
