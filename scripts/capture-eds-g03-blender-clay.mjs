import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve(
  'docs/commercialization/r3/blender-authoring/evidence/matched-comparison',
);
const base = process.env.R3_GDR_URL || 'http://127.0.0.1:4173';
const chrome =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sources = [
  { id: 'detailed-eds-dev-reference', file: 'public/models/c42.v2.glb', scale: 0.105 },
  { id: 'g03-revision-6', file: 'public/models/eds-g03-preview.glb', scale: 1 },
  {
    id: 'blender-clay-study',
    file: 'docs/commercialization/r3/blender-authoring/eds-g03-clay-review.glb',
    scale: 1,
  },
];
const views = [
  ['front', 'design-front'],
  ['rear', 'design-rear'],
  ['side', 'design-side'],
  ['top', 'design-top'],
  ['front-three-quarter', 'design-front-three-quarter'],
  ['rear-three-quarter', 'design-rear-three-quarter'],
  ['cockpit-close-up', 'blender-cockpit-close-up'],
  ['sidepod-close-up', 'blender-sidepod-close-up'],
  ['diffuser-underside', 'blender-diffuser-underside'],
  ['wheel-suspension-close-up', 'blender-wheel-suspension-close-up'],
];
const modes = ['diffuse', 'reflective'];
const report = {
  baselineCommit: '254210db66a4e5b941289681b684a69f56ca9d77',
  viewport: [900, 650],
  fov: 38,
  methodology:
    'Same Three.js renderer, camera, light, viewport and mode per comparison sheet; only documented DEV-reference scale differs.',
  sources: Object.fromEntries(sources.map(({ id, file, scale }) => [id, { file, scale }])),
  captures: {},
  errors: [],
};

await fs.mkdir(root, { recursive: true });
const browser = await chromium.launch({ executablePath: chrome, headless: true });

async function capture(source, viewId, mode) {
  const bytes = await fs.readFile(path.resolve(source.file));
  const page = await browser.newPage({
    viewport: { width: 900, height: 650 },
    deviceScaleFactor: 1,
  });
  const label = `${source.id}/${viewId}/${mode}`;
  page.on('pageerror', (error) => report.errors.push(`${label}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') report.errors.push(`${label}: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(base)) report.errors.push(`${label}: request ${request.url()}`);
  });
  await page.route('**/gdr-prototype.glb', (route) =>
    route.fulfill({ status: 200, contentType: 'model/gltf-binary', body: bytes }),
  );
  await page.goto(`${base}/gdr-review.html?region=${viewId}&mode=${mode}&scale=${source.scale}`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForFunction(() => window.__gdrReady === true, null, { timeout: 60000 });
  const stats = await page.evaluate(() => window.__gdrStats);
  const image = await page.locator('canvas').screenshot();
  await page.close();
  return { image, stats };
}

try {
  for (const [name, viewId] of views) {
    report.captures[name] = {};
    for (const mode of modes) {
      const panels = [];
      report.captures[name][mode] = {};
      for (const source of sources) {
        const result = await capture(source, viewId, mode);
        panels.push({ label: source.id, png: result.image.toString('base64') });
        report.captures[name][mode][source.id] = result.stats;
      }
      const sheet = await browser.newPage({
        viewport: { width: 2736, height: 708 },
        deviceScaleFactor: 1,
      });
      const cards = panels
        .map(
          ({ label, png }) =>
            `<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${png}"></figure>`,
        )
        .join('');
      await sheet.setContent(
        `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:10px;background:#071018;color:#ecf3f7;font:14px Arial}h1{font-size:18px;margin:0 0 10px;text-transform:uppercase}main{display:grid;grid-template-columns:repeat(3,900px);gap:8px}figure{margin:0;border:1px solid #455d6d}figcaption{height:28px;padding:5px 9px;text-transform:uppercase}img{display:block;width:900px;height:650px}</style><h1>EDS-G03 Blender clay gate / ${name} / ${mode} / matched camera + light</h1><main>${cards}</main>`,
      );
      await sheet.screenshot({ path: path.join(root, `${name}-${mode}.png`) });
      await sheet.close();
    }
  }
  await fs.writeFile(
    path.join(root, 'browser-report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(
    JSON.stringify({ sheets: views.length * modes.length, errors: report.errors }, null, 2),
  );
  if (report.errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
