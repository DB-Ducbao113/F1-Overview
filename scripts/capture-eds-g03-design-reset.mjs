import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve('docs/commercialization/r3/evidence/r3-design-reset');
const base = process.env.R3_GDR_URL || 'http://127.0.0.1:4173';
const chrome =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sources = [
  { id: 'detailed-eds-reference', file: 'public/models/c42.v2.glb', scale: 0.105, provenance: 'DEV reference only' },
  { id: 'g03-revision-6', file: 'public/models/eds-g03-preview.glb', scale: 1, provenance: 'Current accepted technical baseline' },
  { id: 'concept-a-aero-ribbon', file: 'docs/commercialization/r3/evidence/r3-design-reset/eds-g03-design-concept-a.glb', scale: 1, provenance: 'Original design-reset concept' },
  { id: 'concept-b-tensioned-wedge', file: 'docs/commercialization/r3/evidence/r3-design-reset/eds-g03-design-concept-b.glb', scale: 1, provenance: 'Original design-reset concept' },
];
const views = ['front-three-quarter', 'side', 'top', 'front', 'rear', 'rear-three-quarter'];
const modes = ['diffuse', 'reflective'];
const report = {
  baselineCommit: 'cb942b48170126add1bea16d5b504125003471f1',
  viewport: [900, 650],
  methodology: 'Identical DEV renderer, camera, FOV, viewport and lights per panel; only documented reference scale differs.',
  sources: Object.fromEntries(sources.map(({ id, file, scale, provenance }) => [id, { file, scale, provenance }])),
  views: {},
  errors: [],
};

await fs.mkdir(root, { recursive: true });
const browser = await chromium.launch({ executablePath: chrome, headless: true });

async function capture(source, view, mode) {
  const bytes = await fs.readFile(path.resolve(source.file));
  const page = await browser.newPage({ viewport: { width: 900, height: 650 }, deviceScaleFactor: 1 });
  const label = `${source.id}/${view}/${mode}`;
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
  await page.goto(`${base}/gdr-review.html?region=design-${view}&mode=${mode}&scale=${source.scale}`, {
    waitUntil: 'domcontentloaded',
  });
  try {
    await page.waitForFunction(() => window.__gdrReady === true, null, { timeout: 60000 });
  } catch (error) {
    throw new Error(`${label}: renderer did not become ready; ${report.errors.slice(-5).join(' | ')}`, {
      cause: error,
    });
  }
  const stats = await page.evaluate(() => window.__gdrStats);
  const image = await page.locator('canvas').screenshot();
  if (source.id.startsWith('concept-')) {
    await fs.writeFile(path.join(root, `${source.id}-${view}-${mode}.png`), image);
  }
  await page.close();
  return { image, stats };
}

try {
  for (const view of views) {
    report.views[view] = {};
    for (const mode of modes) {
      const panels = [];
      report.views[view][mode] = {};
      for (const source of sources) {
        const captured = await capture(source, view, mode);
        panels.push({ label: source.id, png: captured.image.toString('base64') });
        report.views[view][mode][source.id] = captured.stats;
      }
      const sheet = await browser.newPage({ viewport: { width: 1836, height: 1372 }, deviceScaleFactor: 1 });
      const cards = panels
        .map(({ label, png }) => `<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${png}"></figure>`)
        .join('');
      await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:10px;background:#071018;color:#ecf3f7;font:15px Arial}h1{font-size:20px;margin:0 0 10px;text-transform:uppercase}main{display:grid;grid-template-columns:repeat(2,900px);gap:8px}figure{margin:0;border:1px solid #455d6d}figcaption{height:28px;padding:5px 9px;text-transform:uppercase}img{display:block;width:900px;height:650px}</style><h1>EDS-G03 full design reset / ${view} / ${mode} / matched camera + light</h1><main>${cards}</main>`);
      await sheet.screenshot({ path: path.join(root, `comparison-${view}-${mode}.png`) });
      await sheet.close();
    }
  }
  await fs.writeFile(path.join(root, 'browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ comparisonSheets: views.length * modes.length, conceptImages: views.length * modes.length * 2, errors: report.errors }, null, 2));
  if (report.errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
