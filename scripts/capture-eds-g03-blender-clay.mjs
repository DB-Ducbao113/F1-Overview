import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const root = path.resolve(
  'docs/commercialization/r3/blender-authoring/evidence/refinement-revision-2/matched-comparison',
);
const focusedRoot = path.resolve(
  'docs/commercialization/r3/blender-authoring/evidence/refinement-revision-2/focused-before-after',
);
const base = process.env.R3_GDR_URL || 'http://127.0.0.1:4173';
const chrome =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baselineCommit = '8fda531d222acda2fd68b33ab8cf8b980b9ac6d8';
const clayFile = 'docs/commercialization/r3/blender-authoring/eds-g03-clay-review.glb';
const sources = [
  { id: 'detailed-eds-dev-reference', file: 'public/models/c42.v2.glb', scale: 0.105 },
  { id: 'previous-clay-revision', file: `${baselineCommit}:${clayFile}`, scale: 1,
    bytes: execFileSync('git', ['show', `${baselineCommit}:${clayFile}`], { maxBuffer: 16 * 1024 * 1024 }) },
  { id: 'refinement-revision-2', file: clayFile, scale: 1 },
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
  ['floor-edge-undercut', 'blender-floor-edge-undercut'],
  ['diffuser-underside', 'blender-diffuser-underside'],
  ['wheel-suspension-close-up', 'blender-wheel-suspension-close-up'],
];
const modes = ['diffuse', 'reflective'];
const focusedViews = new Map([
  ['sidepod-close-up', 'sidepod-inlet'],
  ['floor-edge-undercut', 'floor-undercut'],
  ['diffuser-underside', 'diffuser-exit'],
  ['side', 'side-silhouette'],
  ['front-three-quarter', 'front-three-quarter'],
  ['rear-three-quarter', 'rear-three-quarter'],
]);
const report = {
  baselineCommit,
  viewport: [900, 650],
  fov: 38,
  methodology:
    'Same Three.js renderer, camera, light, viewport and mode per comparison sheet; only documented DEV-reference scale differs.',
  sources: Object.fromEntries(sources.map(({ id, file, scale }) => [id, { file, scale }])),
  captures: {},
  errors: [],
};

await fs.mkdir(root, { recursive: true });
await fs.mkdir(focusedRoot, { recursive: true });
for (const source of sources) {
  if (!source.bytes) source.bytes = await fs.readFile(path.resolve(source.file));
}
const browser = await chromium.launch({ executablePath: chrome, headless: true });

async function capture(source, viewId, mode) {
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
    route.fulfill({ status: 200, contentType: 'model/gltf-binary', body: source.bytes }),
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

      if (focusedViews.has(name)) {
        const focused = await browser.newPage({ viewport: { width: 1828, height: 708 } });
        const comparisonPanels = [panels[1], panels[2]]
          .map(({ label, png }) => `<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${png}"></figure>`)
          .join('');
        await focused.setContent(
          `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:10px;background:#071018;color:#ecf3f7;font:14px Arial}h1{font-size:18px;margin:0 0 10px;text-transform:uppercase}main{display:grid;grid-template-columns:repeat(2,900px);gap:8px}figure{margin:0;border:1px solid #455d6d}figcaption{height:28px;padding:5px 9px;text-transform:uppercase}img{display:block;width:900px;height:650px}</style><h1>Revision 2 / ${focusedViews.get(name)} / ${mode} / matched before-after</h1><main>${comparisonPanels}</main>`,
        );
        await focused.screenshot({ path: path.join(focusedRoot, `${focusedViews.get(name)}-${mode}.png`) });
        await focused.close();
      }
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
