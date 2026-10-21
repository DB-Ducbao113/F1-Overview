import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from 'playwright-core';

const out = path.resolve('docs/commercialization/r3/evidence/r3-2-revision-7');
const baseline = await fs.readFile('public/models/eds-g03-preview.glb');
const candidate = await fs.readFile(path.join(out, 'eds-g03-rev7-candidate.glb'));
const host = process.env.R3_GDR_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({
  executablePath: process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const views = [
  ['full-front-three-quarter', 'full-front-three-quarter'],
  ['full-side', 'full-side'],
  ['full-rear-three-quarter', 'full-rear-three-quarter'],
  ['diffuser-low-rear', 'diffuser-r7-rear'],
  ['diffuser-underside', 'diffuser-r7-under'],
  ['diffuser-outlet', 'diffuser-outlet'],
  ['halo-front-mount', 'halo-front-mount'],
  ['halo-rear-left', 'halo-rear-left'],
  ['halo-rear-right', 'halo-rear-right'],
  ['halo-upper-t', 'halo-upper-t'],
  ['sidepod-regression', 'sidepod-regression'],
];
const wireframes = new Set(['diffuser-low-rear', 'diffuser-underside', 'halo-rear-left', 'halo-rear-right', 'halo-upper-t']);
const report = {
  baselineSha256: crypto.createHash('sha256').update(baseline).digest('hex'),
  candidateSha256: crypto.createHash('sha256').update(candidate).digest('hex'),
  viewport: [900, 650], fov: 38, scenes: {}, errors: [],
};

async function render(label, bytes, camera, mode) {
  const page = await browser.newPage({ viewport: { width: 900, height: 650 }, deviceScaleFactor: 1 });
  page.on('pageerror', (error) => report.errors.push(`${label}/${camera}/${mode}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') report.errors.push(`${label}/${camera}/${mode}: ${message.text()}`);
  });
  page.on('requestfailed', (request) => report.errors.push(`${label}/${camera}/${mode}: ${request.url()} ${request.failure()?.errorText}`));
  await page.route('**/gdr-prototype.glb', (route) => route.fulfill({ status: 200, contentType: 'model/gltf-binary', body: bytes }));
  await page.goto(`${host}/gdr-review.html?region=${camera}&mode=${mode}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__gdrReady === true, { timeout: 20000 });
  const stats = await page.evaluate(() => window.__gdrStats);
  if (camera === 'full-front-three-quarter' && mode === 'diffuse') {
    stats.rafSampling = await page.evaluate(async () => {
      const intervals = [];
      let previous;
      await new Promise((resolve) => {
        const tick = (time) => {
          if (previous !== undefined) intervals.push(time - previous);
          previous = time;
          if (intervals.length === 90) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      intervals.sort((a, b) => a - b);
      return { sampleCount: intervals.length, medianMs: intervals[44], p95Ms: intervals[85], note: 'Browser rAF scheduler intervals with static scene; not independent GPU render time' };
    });
    stats.webgl = await page.evaluate(() => {
      const gl = document.querySelector('canvas')?.getContext('webgl2');
      const extension = gl?.getExtension('WEBGL_debug_renderer_info');
      return extension ? gl?.getParameter(extension.UNMASKED_RENDERER_WEBGL) : 'unavailable';
    });
  }
  const png = await page.locator('canvas').screenshot();
  await page.close();
  return { png, stats };
}

try {
  for (const [name, camera] of views) {
    for (const mode of ['diffuse', 'reflective', ...(wireframes.has(name) ? ['wireframe'] : [])]) {
      const before = await render('revision-6', baseline, camera, mode);
      const after = await render('revision-7', candidate, camera, mode);
      report.scenes[`${name}-${mode}`] = { camera, before: before.stats, after: after.stats };
      const sheet = await browser.newPage({ viewport: { width: 1820, height: 730 }, deviceScaleFactor: 1 });
      const panels = [
        ['Revision 6 baseline', before.png],
        ['Revision 7 candidate', after.png],
      ].map(([caption, png]) => `<figure><figcaption>${caption}</figcaption><img src="data:image/png;base64,${png.toString('base64')}"></figure>`).join('');
      await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:10px;background:#080c12;color:#e7eef5;font:15px Arial}h1{font-size:19px;margin:0 0 10px}main{display:grid;grid-template-columns:1fr 1fr;gap:8px}figure{margin:0;border:1px solid #35414d}figcaption{height:28px;padding:5px 10px}img{display:block;width:900px;height:650px}</style><h1>${name} / ${mode} / identical camera and light</h1><main>${panels}</main>`);
      await sheet.screenshot({ path: path.join(out, `${name}-${mode}.png`) });
      await sheet.close();
      console.log(`${name}-${mode}`);
    }
  }
  await fs.writeFile(path.join(out, 'browser-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  if (report.errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
