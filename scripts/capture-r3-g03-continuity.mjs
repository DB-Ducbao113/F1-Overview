import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baselineCommit =
  process.env.R3_G03_BASELINE_COMMIT || '47fcfca54cc5a2208216af19c36806806ba8d415';
const revisionLabel = process.env.R3_G03_REVISION_LABEL || 'Revision 5';
const modelPath = 'public/models/eds-g03-preview.glb';
const baselineBytes = execFileSync('git', ['show', `${baselineCommit}:${modelPath}`], {
  maxBuffer: 8 * 1024 * 1024,
});
const candidateBytes = await fs.readFile(modelPath);
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const base = process.env.R3_G03_URL || 'http://127.0.0.1:4173';
const output = path.resolve(
  process.env.R3_G03_CONTINUITY_OUTPUT || 'docs/commercialization/r3/evidence/r3-2-revision-5',
);
const executablePath =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const reviews = [
  ['sidepod', 'sidepod-inlet-closeup'],
  ['sidepod-floor', 'sidepod-floor-closeup'],
  ['rear-underfloor', 'rear-underfloor-closeup'],
  ['diffuser-exit', 'diffuser-exit-closeup'],
  ['halo-mounts', 'halo-mounts-closeup'],
  ['full-side', 'side'],
  ['full-front-three-quarter', 'front-three-quarter'],
  ['full-rear', 'rear'],
  ['full-rear-three-quarter', 'rear-three-quarter'],
  ['diffuser-low-rear', 'diffuser-low-rear-closeup'],
  ['diffuser-underside', 'diffuser-underside-closeup'],
  ['halo-rear-mount', 'halo-rear-mount-closeup'],
  ['halo-rear-right-mount', 'halo-rear-right-mount-closeup'],
  ['halo-front-mount', 'halo-front-mount-closeup'],
];
const wireframes = [
  ['sidepod', 'sidepod-topology-closeup'],
  ['diffuser-low-rear', 'diffuser-topology-closeup'],
  ['halo-rear-mount', 'halo-topology-closeup'],
  ['halo-rear-right-mount', 'halo-rear-right-mount-closeup'],
  ['halo-front-mount', 'halo-front-mount-closeup'],
];
const errors = { page: [], console: [], localRequests: [] };

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--enable-precise-memory-info'],
});

async function createReviewPage(label, useBaseline) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  if (useBaseline) {
    await page.route('**/models/eds-g03-preview.glb', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'model/gltf-binary',
        body: baselineBytes,
      }),
    );
  }
  page.on('pageerror', (error) => errors.page.push(`${label}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.console.push(`${label}: ${message.text()}`);
  });
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(base))
      errors.localRequests.push(`${label}: ${request.url()} :: ${request.failure()?.errorText}`);
  });
  await page.goto(`${base}/dev-showroom.html?mode=eds-g03&inspection=diffuse`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForFunction(
    () =>
      window.__legacySkinReview?.ready && window.__legacySkinReview.getStats().triangles > 50000,
  );
  await page.waitForTimeout(500);
  return page;
}

async function capture(page, view, inspection) {
  await page.evaluate(
    ({ view, inspection }) => {
      window.__legacySkinReview.setView(view);
      window.__legacySkinReview.setInspection(inspection);
    },
    { view, inspection },
  );
  await page.waitForTimeout(550);
  return page.locator('canvas').screenshot();
}

async function renderSheet(label, view, captures) {
  const sheet = await browser.newPage({ viewport: { width: 1600, height: 1280 } });
  const panel = (title, bytes) => `
    <figure><figcaption>${title}</figcaption>
      <img src="data:image/png;base64,${bytes.toString('base64')}" />
    </figure>`;
  await sheet.setContent(`
    <!doctype html><html><head><style>
      * { box-sizing:border-box; }
      body { margin:0; padding:22px; background:#05070a; color:#f3f4f6; font-family:Arial,sans-serif; }
      header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:15px; }
      h1 { margin:0; font-size:23px; text-transform:uppercase; letter-spacing:.08em; }
      .tag { color:#fbbf24; font-size:13px; font-weight:800; letter-spacing:.12em; }
      .grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
      figure { margin:0; border:1px solid #36404a; border-radius:10px; overflow:hidden; background:#070a0f; }
      figcaption { padding:9px 13px; border-bottom:1px solid #29313a; font-size:13px; font-weight:800; text-transform:uppercase; }
      img { display:block; width:100%; height:553px; object-fit:contain; }
    </style></head><body>
      <header><h1>${label.replaceAll('-', ' ')}</h1><span class="tag">GATE 2 ${revisionLabel.toUpperCase()} · ${view} · MATCHED CAMERA</span></header>
      <div class="grid">
        ${panel('Before · committed baseline neutral diffuse', captures.before.diffuse)}
        ${panel(`After · ${revisionLabel} neutral diffuse`, captures.after.diffuse)}
        ${panel('Before · committed baseline controlled reflective', captures.before.reflective)}
        ${panel(`After · ${revisionLabel} controlled reflective`, captures.after.reflective)}
      </div>
    </body></html>
  `);
  await sheet.screenshot({ path: path.join(output, `continuity-${label}.png`) });
  await sheet.close();
}

async function renderWireframe(label, view, beforeBytes, afterBytes) {
  const sheet = await browser.newPage({ viewport: { width: 1600, height: 660 } });
  await sheet.setContent(`<!doctype html><html><head><style>
    body { margin:0; padding:20px; background:#05070a; color:white; font:16px Arial; }
    main { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    img { width:100%; height:550px; object-fit:contain; border:1px solid #36404a; }
  </style></head><body><h2>GATE 2 ${revisionLabel.toUpperCase()} / ${label} / ${view} / MATCHED WIREFRAME</h2><main>
    <div>BEFORE<img src="data:image/png;base64,${beforeBytes.toString('base64')}"></div>
    <div>AFTER<img src="data:image/png;base64,${afterBytes.toString('base64')}"></div>
  </main></body></html>`);
  await sheet.screenshot({ path: path.join(output, `wireframe-${label}.png`) });
  await sheet.close();
}

let before;
let after;
try {
  before = await createReviewPage('before', true);
  after = await createReviewPage('after', false);
  for (const [label, view] of reviews) {
    const captures = {
      before: {
        diffuse: await capture(before, view, 'diffuse'),
        reflective: await capture(before, view, 'reflective'),
      },
      after: {
        diffuse: await capture(after, view, 'diffuse'),
        reflective: await capture(after, view, 'reflective'),
      },
    };
    await renderSheet(label, view, captures);
  }
  for (const [label, view] of wireframes) {
    await renderWireframe(
      label,
      view,
      await capture(before, view, 'wireframe'),
      await capture(after, view, 'wireframe'),
    );
  }
  for (const page of [before, after]) {
    await page.evaluate(() => {
      window.__legacySkinReview.setView('front-three-quarter');
      window.__legacySkinReview.setInspection('diffuse');
    });
  }
  await before.waitForTimeout(1700);
  await after.waitForTimeout(1700);
  const runtime = {
    before: await before.evaluate(() => window.__legacySkinReview.getStats()),
    after: await after.evaluate(() => window.__legacySkinReview.getStats()),
  };
  const report = {
    generatedAt: new Date().toISOString(),
    baselineCommit,
    revisionLabel,
    baselineSha256: sha256(baselineBytes),
    candidateSha256: sha256(candidateBytes),
    viewport: [1440, 900],
    sheetResolution: [1600, 1280],
    cameraFovDegrees: 38,
    method:
      'Two fresh DEV viewer pages use the same code, viewport, preset, lighting, FOV, model transform and zoom. The before page receives the committed baseline GLB through a local Playwright response override; the after page loads the revised GLB.',
    reviews: reviews.map(([label, view]) => ({ label, view, modes: ['diffuse', 'reflective'] })),
    wireframes: wireframes.map(([label, view]) => ({ label, view })),
    runtime,
    errors,
    physicalDevice: 'NOT TESTED',
  };
  await fs.writeFile(
    path.join(output, 'browser-report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
  if (Object.values(errors).some((items) => items.length)) process.exitCode = 1;
} finally {
  await before?.close();
  await after?.close();
  await browser.close();
}
