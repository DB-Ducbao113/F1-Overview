import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve('docs/commercialization/r3/evidence/r3-2-revision-7-prototypes');
const base = process.env.R3_GDR_URL || 'http://127.0.0.1:4173';
const chrome = process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const views = [
  { id: 'diffuser-rear', region: 'diffuser-r7-rear', labels: ['diffuser-baseline', 'diffuser-A-rounded', 'diffuser-B-flared'], camera: { position: [0, 0.20, 3.35], target: [0, 0.24, 2.04], fov: 38 } },
  { id: 'diffuser-under', region: 'diffuser-r7-under', labels: ['diffuser-baseline', 'diffuser-A-rounded', 'diffuser-B-flared'], camera: { position: [0.42, 0.08, 2.92], target: [0, 0.25, 1.97], fov: 38 } },
  { id: 'halo-rear', region: 'halo-r7-rear', labels: ['halo-baseline', 'halo-A-saddle', 'halo-B-boattail'], camera: { position: [-1.12, 1.02, 0.91], target: [-0.26, 0.68, 0.12], fov: 38 } },
  { id: 'halo-side', region: 'halo-r7-side', labels: ['halo-baseline', 'halo-A-saddle', 'halo-B-boattail'], camera: { position: [-1.05, 0.86, -0.62], target: [-0.26, 0.68, 0.12], fov: 38 } },
];
const onlyViews = process.env.R3_REV7_ONLY_VIEWS?.split(',').map((value) => value.trim());
const selectedViews = onlyViews ? views.filter((view) => onlyViews.includes(view.id)) : views;
const report = { baselineCommit: '48ddf12818fc978b9b4d7d6ef649897f3e83ea10', viewport: [900, 650], lighting: 'identical GDRReview DEV studio for all panels', views: {}, errors: [] };

async function capture(view, label, mode) {
  const bytes = await fs.readFile(path.join(root, `${label}.glb`));
  const page = await browser.newPage({ viewport: { width: 900, height: 650 }, deviceScaleFactor: 1 });
  page.on('pageerror', (error) => report.errors.push(`${view.id}/${label}/${mode}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') report.errors.push(`${view.id}/${label}/${mode}: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(base)) report.errors.push(`${view.id}/${label}/${mode}: request ${request.url()}`);
  });
  await page.route('**/gdr-prototype.glb', (route) => route.fulfill({ status: 200, contentType: 'model/gltf-binary', body: bytes }));
  await page.goto(`${base}/gdr-review.html?region=${view.region}&mode=${mode}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__gdrReady === true);
  const stats = await page.evaluate(() => window.__gdrStats);
  const image = await page.locator('canvas').screenshot();
  await page.close();
  return { image, stats };
}

try {
  for (const view of selectedViews) {
    report.views[view.id] = { camera: view.camera, modes: {} };
    for (const mode of ['diffuse', 'reflective', 'wireframe']) {
      const panels = [];
      const stats = {};
      for (const label of view.labels) {
        const captured = await capture(view, label, mode);
        panels.push({ label, png: captured.image.toString('base64') });
        stats[label] = captured.stats;
      }
      report.views[view.id].modes[mode] = stats;
      const sheet = await browser.newPage({ viewport: { width: 2736, height: 732 }, deviceScaleFactor: 1 });
      const cards = panels.map(({ label, png }) => `<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${png}"></figure>`).join('');
      await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:10px;background:#071018;color:#ecf3f7;font:15px Arial}h1{font-size:20px;margin:0 0 10px}main{display:grid;grid-template-columns:repeat(3,900px);gap:8px}figure{margin:0;border:1px solid #455d6d}figcaption{height:28px;padding:5px 9px}img{display:block;width:900px;height:650px}</style><h1>R3.2 REV7 PROTOTYPE DESIGN GATE / ${view.id} / ${mode} / fixed camera + light</h1><main>${cards}</main>`);
      await sheet.screenshot({ path: path.join(root, `${view.id}-${mode}.png`) });
      await sheet.close();
    }
  }
  await fs.writeFile(path.join(root, 'browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ images: selectedViews.length * 3, errors: report.errors }, null, 2));
  if (report.errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
