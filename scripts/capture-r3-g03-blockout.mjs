import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const base = process.env.R3_G03_URL || 'http://127.0.0.1:4173';
const output = path.resolve(
  process.env.R3_G03_OUTPUT || 'docs/commercialization/r3/evidence/r3-1-blockout',
);
const executablePath =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const views = ['front-three-quarter', 'side', 'top', 'front', 'rear', 'rear-three-quarter'];
const pageErrors = [];
const consoleErrors = [];
const failedLocalRequests = [];

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--enable-precise-memory-info'],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
page.on('pageerror', (error) => pageErrors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('requestfailed', (request) => {
  if (request.url().startsWith(base)) {
    failedLocalRequests.push(
      `${request.method()} ${request.url()} :: ${request.failure()?.errorText}`,
    );
  }
});

async function captureCanvas(mode, view) {
  await page.evaluate(
    ({ nextMode, nextView }) => {
      window.__legacySkinReview.setMode(nextMode);
      window.__legacySkinReview.setView(nextView);
    },
    { nextMode: mode, nextView: view },
  );
  await page.waitForTimeout(mode === 'eds-g03' ? 700 : 420);
  return page.locator('canvas').screenshot();
}

async function renderComparison(view, reference, candidate) {
  const comparison = await browser.newPage({
    viewport: { width: 1600, height: 700 },
    deviceScaleFactor: 1,
  });
  await comparison.setContent(`
    <!doctype html>
    <html><head><style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 22px; background: #05070a; color: #f3f4f6; font-family: Arial, sans-serif; }
      header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
      h1 { margin: 0; font-size: 22px; letter-spacing: .08em; text-transform: uppercase; }
      .tag { color: #fbbf24; font-size: 13px; font-weight: 800; letter-spacing: .14em; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      figure { margin: 0; border: 1px solid #36404a; border-radius: 12px; overflow: hidden; background: #070a0f; }
      figcaption { padding: 10px 14px; border-bottom: 1px solid #29313a; font-size: 14px; font-weight: 800; text-transform: uppercase; }
      img { display: block; width: 100%; height: 575px; object-fit: contain; background: #070a0f; }
    </style></head><body>
      <header><h1>${view.replaceAll('-', ' ')}</h1><div class="tag">DEV REVIEW · MATCHED CAMERA</div></header>
      <div class="grid">
        <figure><figcaption>A · Detailed + EDS quality reference</figcaption><img src="data:image/png;base64,${reference.toString('base64')}" /></figure>
        <figure><figcaption>B · EDS-G03 R3.1 neutral blockout</figcaption><img src="data:image/png;base64,${candidate.toString('base64')}" /></figure>
      </div>
    </body></html>
  `);
  await comparison.screenshot({ path: path.join(output, `comparison-${view}.png`) });
  await comparison.close();
}

async function renderSilhouetteSheet(captures) {
  const comparison = await browser.newPage({
    viewport: { width: 1600, height: 1040 },
    deviceScaleFactor: 1,
  });
  const panel = (label, bytes) => `
    <figure><figcaption>${label}</figcaption>
      <img src="data:image/png;base64,${bytes.toString('base64')}" />
    </figure>`;
  await comparison.setContent(`
    <!doctype html><html><head><style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 20px; background: #05070a; color: white; font-family: Arial, sans-serif; }
      header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
      h1 { margin: 0; font-size: 21px; text-transform: uppercase; letter-spacing: .08em; }
      .tag { color: #fbbf24; font-size: 12px; font-weight: 800; letter-spacing: .13em; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      figure { margin: 0; border: 1px solid #36404a; border-radius: 10px; overflow: hidden; background: #070a0f; }
      figcaption { padding: 8px 12px; border-bottom: 1px solid #29313a; font-size: 13px; font-weight: 800; text-transform: uppercase; }
      img { display: block; width: 100%; height: 440px; object-fit: contain; filter: grayscale(1) contrast(1.25); }
    </style></head><body>
      <header><h1>Side / top silhouette comparison</h1><div class="tag">DEV REVIEW · NORMALIZED FRAMING</div></header>
      <div class="grid">
        ${panel('Side · Detailed + EDS reference', captures.side.reference)}
        ${panel('Side · EDS-G03 R3.1', captures.side.candidate)}
        ${panel('Top · Detailed + EDS reference', captures.top.reference)}
        ${panel('Top · EDS-G03 R3.1', captures.top.candidate)}
      </div>
    </body></html>
  `);
  await comparison.screenshot({ path: path.join(output, 'silhouette-side-top-contact-sheet.png') });
  await comparison.close();
}

try {
  await page.goto(`${base}/dev-showroom.html?mode=legacy-eds&livery=eds-aero`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForFunction(() => window.__legacySkinReview?.ready);
  await page.waitForTimeout(1800);

  const captures = {};
  for (const view of views) {
    const reference = await captureCanvas('legacy-eds', view);
    const candidate = await captureCanvas('eds-g03', view);
    captures[view] = { reference, candidate };
    await renderComparison(view, reference, candidate);
  }
  await renderSilhouetteSheet(captures);

  await page.evaluate(() => {
    window.__legacySkinReview.setMode('eds-g03');
    window.__legacySkinReview.setView('front-three-quarter');
  });
  await page.waitForTimeout(1800);
  const runtime = await page.evaluate(() => {
    const stats = window.__legacySkinReview.getStats();
    return {
      stats: {
        gpu: stats.gpu,
        calls: stats.calls,
        triangles: stats.triangles,
        geometries: stats.geometries,
        textures: stats.textures,
        frameSamples: stats.frameSamples,
        medianRafMs: stats.medianRafMs,
        p95RafMs: stats.p95RafMs,
        mode: stats.mode,
      },
      jsHeapBytes: performance.memory?.usedJSHeapSize ?? null,
    };
  });
  const report = {
    generatedAt: new Date().toISOString(),
    viewport: [1440, 900],
    comparisonResolution: [1600, 700],
    views,
    candidateMode: 'eds-g03',
    referenceMode: 'legacy-eds',
    candidateViewerTransform: {
      rotationYRadians: Math.PI,
      reason: 'Match +Z-front legacy camera convention',
    },
    runtime,
    pageErrors,
    consoleErrors,
    failedLocalRequests,
    physicalDevice: 'NOT TESTED',
    limitations: [
      'Headless desktop Chrome only; no physical-device or sustained thermal test.',
      'Detailed + EDS is a visual-quality reference only; its geometry is not used by EDS-G03.',
      'Contact sheets compare matched perspective cameras; they are not pixel-fidelity targets.',
    ],
  };
  await fs.writeFile(
    path.join(output, 'browser-report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
  if (pageErrors.length || consoleErrors.length || failedLocalRequests.length) process.exitCode = 1;
} finally {
  await page.close();
  await browser.close();
}
