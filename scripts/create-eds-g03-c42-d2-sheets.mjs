import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const rootD2 = path.join(
  ROOT,
  'docs/commercialization/r3/blender-authoring/c42-fidelity-d2/evidence',
);
const rootD1 = path.join(
  ROOT,
  'docs/commercialization/r3/blender-authoring/c42-reconstruction-d1/evidence',
);
const output = path.join(rootD2, 'comparison-sheets');

fs.mkdirSync(output, { recursive: true });

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

const gap = 8;

// 1. Generate 3-Column Matched Comparison Sheets: C42 Reference | EDS D1 | EDS D2
for (const view of views) {
  const c42Path = path.join(rootD2, 'c42-reference', `${view}.png`);
  const d1Path = path.join(rootD1, 'eds-clay', `${view}.png`);
  const d2Path = path.join(rootD2, 'eds-clay', `${view}.png`);

  if (!fs.existsSync(c42Path) || !fs.existsSync(d1Path) || !fs.existsSync(d2Path)) {
    console.warn(`Skipping ${view}: missing one of [c42, d1, d2]`);
    continue;
  }

  const c42 = PNG.sync.read(fs.readFileSync(c42Path));
  const d1 = PNG.sync.read(fs.readFileSync(d1Path));
  const d2 = PNG.sync.read(fs.readFileSync(d2Path));

  const w = c42.width;
  const h = c42.height;

  const sheet = new PNG({ width: w * 3 + gap * 2, height: h });
  // Fill background with dark studio slate
  for (let i = 0; i < sheet.data.length; i += 4) {
    sheet.data[i] = 7;
    sheet.data[i + 1] = 8;
    sheet.data[i + 2] = 11;
    sheet.data[i + 3] = 255;
  }

  PNG.bitblt(c42, sheet, 0, 0, w, h, 0, 0);
  PNG.bitblt(d1, sheet, 0, 0, w, h, w + gap, 0);
  PNG.bitblt(d2, sheet, 0, 0, w, h, w * 2 + gap * 2, 0);

  fs.writeFileSync(path.join(output, `c42-vs-d1-vs-d2-${view}.png`), PNG.sync.write(sheet));
}

// 2. Silhouette Overlay: C42 vs D2 (Side View)
const c42Side = PNG.sync.read(fs.readFileSync(path.join(rootD2, 'c42-reference', 'side.png')));
const d2Side = PNG.sync.read(fs.readFileSync(path.join(rootD2, 'eds-clay', 'side.png')));
const overlaySide = new PNG({ width: c42Side.width, height: c42Side.height });

for (let y = 0; y < c42Side.height; y++) {
  for (let x = 0; x < c42Side.width; x++) {
    const idx = (y * c42Side.width + x) * 4;
    const c42Lum = (c42Side.data[idx] + c42Side.data[idx + 1] + c42Side.data[idx + 2]) / 3;
    const d2Lum = (d2Side.data[idx] + d2Side.data[idx + 1] + d2Side.data[idx + 2]) / 3;
    const bgLum = 18; // dark studio background threshold

    const isC42Car = c42Lum > bgLum;
    const isD2Car = d2Lum > bgLum;

    if (isC42Car && isD2Car) {
      // Overlap: Neutral silver / bright matching zone
      overlaySide.data[idx] = Math.min(255, (c42Side.data[idx] + d2Side.data[idx]) / 2 + 50);
      overlaySide.data[idx + 1] = Math.min(
        255,
        (c42Side.data[idx + 1] + d2Side.data[idx + 1]) / 2 + 50,
      );
      overlaySide.data[idx + 2] = Math.min(
        255,
        (c42Side.data[idx + 2] + d2Side.data[idx + 2]) / 2 + 50,
      );
      overlaySide.data[idx + 3] = 255;
    } else if (isC42Car) {
      // C42 only: Cyan tint
      overlaySide.data[idx] = 40;
      overlaySide.data[idx + 1] = 180;
      overlaySide.data[idx + 2] = 240;
      overlaySide.data[idx + 3] = 255;
    } else if (isD2Car) {
      // D2 only: Coral / Amber tint
      overlaySide.data[idx] = 245;
      overlaySide.data[idx + 1] = 120;
      overlaySide.data[idx + 2] = 40;
      overlaySide.data[idx + 3] = 255;
    } else {
      // Background
      overlaySide.data[idx] = 10;
      overlaySide.data[idx + 1] = 12;
      overlaySide.data[idx + 2] = 16;
      overlaySide.data[idx + 3] = 255;
    }
  }
}
fs.writeFileSync(
  path.join(output, 'silhouette-overlay-c42-vs-d2.png'),
  PNG.sync.write(overlaySide),
);

// 3. Top-View Shape Comparison (Side-by-side C42 vs D2 with center alignment guide)
const c42Top = PNG.sync.read(fs.readFileSync(path.join(rootD2, 'c42-reference', 'top.png')));
const d2Top = PNG.sync.read(fs.readFileSync(path.join(rootD2, 'eds-clay', 'top.png')));
const sheetTop = new PNG({ width: c42Top.width * 2 + gap, height: c42Top.height });
PNG.bitblt(c42Top, sheetTop, 0, 0, c42Top.width, c42Top.height, 0, 0);
PNG.bitblt(d2Top, sheetTop, 0, 0, d2Top.width, d2Top.height, c42Top.width + gap, 0);
fs.writeFileSync(path.join(output, 'top-view-shape-comparison.png'), PNG.sync.write(sheetTop));

// 4. Side-View Nose / Cockpit Comparison Sheet
const c42Nose = PNG.sync.read(
  fs.readFileSync(path.join(rootD2, 'c42-reference', 'nose-front-wing.png')),
);
const d2Nose = PNG.sync.read(fs.readFileSync(path.join(rootD2, 'eds-clay', 'nose-front-wing.png')));
const sheetNose = new PNG({ width: c42Nose.width * 2 + gap, height: c42Nose.height });
PNG.bitblt(c42Nose, sheetNose, 0, 0, c42Nose.width, c42Nose.height, 0, 0);
PNG.bitblt(d2Nose, sheetNose, 0, 0, d2Nose.width, d2Nose.height, c42Nose.width + gap, 0);
fs.writeFileSync(
  path.join(output, 'side-view-nose-cockpit-comparison.png'),
  PNG.sync.write(sheetNose),
);

// 5. Front/Rear Stance Comparison Sheet
const d2Front = PNG.sync.read(fs.readFileSync(path.join(rootD2, 'eds-clay', 'front.png')));
const d2Rear = PNG.sync.read(fs.readFileSync(path.join(rootD2, 'eds-clay', 'rear.png')));
const sheetStance = new PNG({ width: d2Front.width * 2 + gap, height: d2Front.height });
PNG.bitblt(d2Front, sheetStance, 0, 0, d2Front.width, d2Front.height, 0, 0);
PNG.bitblt(d2Rear, sheetStance, 0, 0, d2Rear.width, d2Rear.height, d2Front.width + gap, 0);
fs.writeFileSync(
  path.join(output, 'front-rear-stance-comparison.png'),
  PNG.sync.write(sheetStance),
);

console.log(
  JSON.stringify({
    output,
    threeColumnSheets: views.length,
    silhouetteOverlay: 'silhouette-overlay-c42-vs-d2.png',
    topViewComparison: 'top-view-shape-comparison.png',
    noseCockpitComparison: 'side-view-nose-cockpit-comparison.png',
    stanceComparison: 'front-rear-stance-comparison.png',
  }),
);
