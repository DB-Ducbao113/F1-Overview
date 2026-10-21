import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const base = process.env.R3_GDR_URL || 'http://127.0.0.1:4173';
const output = path.resolve('docs/commercialization/r3/gdr/evidence');
const executablePath =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true });
const errors = [];
const results = {};

async function capture(region, label, mode) {
  const bytes = await fs.readFile(path.join(output, `${label}.glb`));
  const page = await browser.newPage({ viewport: { width: 900, height: 650 } });
  page.on('pageerror', (error) => errors.push(`${label}/${mode}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`${label}/${mode}: ${message.text()}`);
  });
  await page.route('**/gdr-prototype.glb', (route) =>
    route.fulfill({ status: 200, contentType: 'model/gltf-binary', body: bytes }),
  );
  await page.goto(`${base}/gdr-review.html?region=${region}&mode=${mode}`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForFunction(() => window.__gdrReady === true);
  const stats = await page.evaluate(() => window.__gdrStats);
  const image = await page.locator('canvas').screenshot();
  await page.close();
  return { image, stats };
}

async function sheet(region, mode, labels) {
  const panels = [];
  for (const label of labels) {
    const captureResult = await capture(region, label, mode);
    results[`${label}/${mode}`] = captureResult.stats;
    panels.push({ label, image: captureResult.image.toString('base64') });
  }
  const page = await browser.newPage({ viewport: { width: 1800, height: 590 } });
  const cells = panels
    .map(
      ({ label, image }) =>
        `<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${image}" /></figure>`,
    )
    .join('');
  await page.setContent(`<!doctype html><html><head><style>
    *{box-sizing:border-box}body{margin:0;padding:18px;background:#05080c;color:#eff6fa;font:16px Arial}
    h1{margin:0 0 12px;font-size:22px;text-transform:uppercase;letter-spacing:.06em}
    section{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
    figure{margin:0;border:1px solid #45515e;background:#090d13}
    figcaption{height:34px;padding:8px;font-size:13px;font-weight:bold;text-transform:uppercase}
    img{display:block;width:100%;height:490px;object-fit:contain}
  </style></head><body><h1>GDR ${region} — ${mode} / matched camera + light</h1><section>${cells}</section></body></html>`);
  await page.screenshot({ path: path.join(output, `${region}-${mode}-comparison.png`) });
  await page.close();
}

try {
  for (const mode of ['diffuse', 'reflective', 'wireframe']) {
    await sheet('diffuser', mode, ['diffuser-rev4', 'diffuser-A-profile', 'diffuser-B-resection']);
    await sheet('halo', mode, ['halo-rev4', 'halo-A-fairing', 'halo-B-welded']);
  }
  const report = {
    method:
      'Isolated region GLBs rendered by the same DEV Three.js scene with identical camera, 38-degree FOV, studio lighting and viewport within each comparison sheet.',
    hardware: 'Headless Chrome WebGL; not a physical-device validation',
    results,
    errors,
  };
  await fs.writeFile(
    path.join(output, 'prototype-browser-report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
