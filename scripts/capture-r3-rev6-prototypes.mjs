import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve('docs/commercialization/r3/evidence/r3-2-revision-6');
const base = process.env.R3_GDR_URL || 'http://127.0.0.1:4173';
const executablePath = process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true });
const report = { baseline: 'ff29e5ae526ddc1df6034861987e112a63e5cc70', cameras: {}, renders: {}, errors: [] };

async function capture(region, filename, mode) {
  const bytes = await fs.readFile(path.join(root, filename));
  const page = await browser.newPage({ viewport: { width: 900, height: 650 }, deviceScaleFactor: 1 });
  page.on('pageerror', (error) => report.errors.push(`${region}/${filename}/${mode}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') report.errors.push(`${region}/${filename}/${mode}: ${message.text()}`);
  });
  await page.route('**/gdr-prototype.glb', (route) => route.fulfill({ status: 200, contentType: 'model/gltf-binary', body: bytes }));
  await page.goto(`${base}/gdr-review.html?region=${region === 'halo' ? 'halo-upper' : 'diffuser-rev6'}&mode=${mode}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__gdrReady === true);
  const stats = await page.evaluate(() => window.__gdrStats);
  const image = await page.locator('canvas').screenshot();
  await page.close();
  return { stats, image };
}

try {
  for (const region of ['halo', 'diffuser']) {
    report.cameras[region] = region === 'halo'
      ? { position: [0.43, 1.13, -0.12], target: [0, 0.895, -0.5], fov: 38 }
      : { position: [0.46, 0.24, 3.12], target: [0, 0.26, 2.12], fov: 38 };
    for (const mode of ['diffuse', 'reflective', 'wireframe']) {
      const before = await capture(region, `${region}-rev5-crop.glb`, mode);
      const after = await capture(region, `${region}-prototype.glb`, mode);
      report.renders[`${region}-${mode}`] = { before: before.stats, after: after.stats };
      const sheet = await browser.newPage({ viewport: { width: 1820, height: 730 }, deviceScaleFactor: 1 });
      const figures = [
        ['Revision 5', before.image],
        ['Revision 6 isolated prototype', after.image],
      ].map(([label, image]) => `<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${image.toString('base64')}"></figure>`).join('');
      await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:10px;background:#080c12;color:#e7eef5;font:15px Arial}h1{font-size:19px;margin:0 0 10px}main{display:grid;grid-template-columns:1fr 1fr;gap:8px}figure{margin:0;border:1px solid #35414d}figcaption{height:28px;padding:5px 10px}img{display:block;width:900px;height:650px}</style><h1>${region.toUpperCase()} / ${mode} / matched camera and lighting</h1><main>${figures}</main>`);
      await sheet.screenshot({ path: path.join(root, `${region}-prototype-${mode}.png`) });
      await sheet.close();
    }
  }
  await fs.writeFile(path.join(root, 'prototype-render-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (report.errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
