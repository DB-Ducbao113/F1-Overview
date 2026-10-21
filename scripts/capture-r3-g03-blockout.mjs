import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const base = process.env.R3_G03_URL || 'http://127.0.0.1:4173';
const output = path.resolve(
  process.env.R3_G03_OUTPUT || 'docs/commercialization/r3/evidence/r3-1-blockout',
);
const executablePath =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const views = ['front-three-quarter', 'side', 'top', 'front', 'rear', 'rear-three-quarter'];
const revisionLabel = process.env.R3_G03_REVISION_LABEL || 'R3.1 revision 1';
const evidenceTag = process.env.R3_G03_EVIDENCE_TAG || 'DEV REVIEW';
const closeups = (process.env.R3_G03_CLOSEUPS || '').split(',').filter(Boolean);
const beforeDirectory = process.env.R3_G03_BEFORE_DIR
  ? path.resolve(process.env.R3_G03_BEFORE_DIR)
  : null;
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

async function captureCanvas(mode, view, inspection = 'diffuse') {
  await page.evaluate(
    ({ nextMode, nextView, nextInspection }) => {
      window.__legacySkinReview.setMode(nextMode);
      window.__legacySkinReview.setView(nextView);
      window.__legacySkinReview.setInspection(nextInspection);
    },
    { nextMode: mode, nextView: view, nextInspection: inspection },
  );
  await page.waitForTimeout(mode === 'eds-g03' ? 700 : 420);
  return page.locator('canvas').screenshot();
}

function measureSilhouette(bytes) {
  const png = PNG.sync.read(bytes);
  const corners = [
    [0, 0],
    [png.width - 1, 0],
    [0, png.height - 1],
    [png.width - 1, png.height - 1],
  ];
  const background = corners
    .map(([x, y]) => {
      const index = (y * png.width + x) * 4;
      return [png.data[index], png.data[index + 1], png.data[index + 2]];
    })
    .reduce((sum, pixel) => sum.map((value, index) => value + pixel[index]), [0, 0, 0])
    .map((value) => value / corners.length);
  const columns = new Uint32Array(png.width);
  const rows = new Uint32Array(png.height);
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const index = (y * png.width + x) * 4;
      const distance = Math.hypot(
        png.data[index] - background[0],
        png.data[index + 1] - background[1],
        png.data[index + 2] - background[2],
      );
      if (distance > 48) {
        columns[x] += 1;
        rows[y] += 1;
      }
    }
  }
  const activeColumns = [...columns.keys()].filter((x) => columns[x] >= 8);
  const activeRows = [...rows.keys()].filter((y) => rows[y] >= 8);
  if (!activeColumns.length || !activeRows.length) throw new Error('Unable to measure silhouette');
  const minX = activeColumns[0];
  const maxX = activeColumns.at(-1);
  const minY = activeRows[0];
  const maxY = activeRows.at(-1);
  return {
    canvas: { width: png.width, height: png.height },
    backgroundRgb: background.map((value) => Math.round(value)),
    bounds: { minX, minY, maxX, maxY },
    visibleWidth: maxX - minX + 1,
    visibleHeight: maxY - minY + 1,
    groundLineY: maxY,
  };
}

function cropSilhouette(bytes, measurement, padding = 10) {
  const source = PNG.sync.read(bytes);
  const minX = Math.max(0, measurement.bounds.minX - padding);
  const minY = Math.max(0, measurement.bounds.minY - padding);
  const maxX = Math.min(source.width - 1, measurement.bounds.maxX + padding);
  const maxY = Math.min(source.height - 1, measurement.bounds.maxY + padding);
  const outputPng = new PNG({ width: maxX - minX + 1, height: maxY - minY + 1 });
  PNG.bitblt(source, outputPng, minX, minY, outputPng.width, outputPng.height, 0, 0);
  return PNG.sync.write(outputPng);
}

function cropRegion(bytes, x, y, width, height) {
  const source = PNG.sync.read(bytes);
  const outputPng = new PNG({ width, height });
  PNG.bitblt(source, outputPng, x, y, width, height, 0, 0);
  return PNG.sync.write(outputPng);
}

async function renderComparison(view, reference, candidate, normalized) {
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
      .viewport { height: 575px; display: flex; align-items: ${view === 'top' ? 'center' : 'flex-end'}; justify-content: center; overflow: hidden; background: #070a0f; }
      img { display: block; ${normalized ? 'width: 92%; height: auto; max-height: 555px;' : 'width: 100%; height: 575px; object-fit: contain;'} }
    </style></head><body>
      <header><h1>${view.replaceAll('-', ' ')}</h1><div class="tag">${evidenceTag} · ${normalized ? 'NORMALIZED SILHOUETTE' : 'PHYSICAL-SCALE CAMERA'}</div></header>
      <div class="grid">
        <figure><figcaption>A · Detailed + EDS quality reference</figcaption><div class="viewport"><img src="data:image/png;base64,${reference.toString('base64')}" /></div></figure>
        <figure><figcaption>B · EDS-G03 ${revisionLabel}</figcaption><div class="viewport"><img src="data:image/png;base64,${candidate.toString('base64')}" /></div></figure>
      </div>
    </body></html>
  `);
  const prefix = normalized ? 'comparison' : 'physical-comparison';
  await comparison.screenshot({ path: path.join(output, `${prefix}-${view}.png`) });
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
      <header><h1>Side / top silhouette comparison</h1><div class="tag">DEV REVIEW · NORMALIZED LENGTH + GROUND</div></header>
      <div class="grid">
        ${panel('Side · Detailed + EDS reference', captures.side.referenceCrop)}
        ${panel(`Side · EDS-G03 ${revisionLabel}`, captures.side.candidateCrop)}
        ${panel('Top · Detailed + EDS reference', captures.top.referenceCrop)}
        ${panel(`Top · EDS-G03 ${revisionLabel}`, captures.top.candidateCrop)}
      </div>
    </body></html>
  `);
  await comparison.screenshot({ path: path.join(output, 'silhouette-side-top-contact-sheet.png') });
  await comparison.close();
}

async function renderInspectionComparison(view, diffuse, reflective) {
  const comparison = await browser.newPage({ viewport: { width: 1600, height: 700 } });
  await comparison.setContent(`
    <!doctype html><html><head><style>
      * { box-sizing: border-box; } body { margin: 0; padding: 22px; background: #05070a; color: #f3f4f6; font-family: Arial,sans-serif; }
      header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:14px; }
      h1 { margin:0; font-size:22px; letter-spacing:.08em; text-transform:uppercase; }
      .tag { color:#fbbf24; font-size:13px; font-weight:800; letter-spacing:.14em; }
      .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
      figure { margin:0; border:1px solid #36404a; border-radius:12px; overflow:hidden; background:#070a0f; }
      figcaption { padding:10px 14px; border-bottom:1px solid #29313a; font-size:14px; font-weight:800; text-transform:uppercase; }
      img { display:block; width:100%; height:575px; object-fit:contain; }
    </style></head><body>
      <header><h1>${view.replaceAll('-', ' ')}</h1><div class="tag">R3.2 SURFACE INSPECTION</div></header>
      <div class="grid">
        <figure><figcaption>A · Neutral diffuse</figcaption><img src="data:image/png;base64,${diffuse.toString('base64')}" /></figure>
        <figure><figcaption>B · Subtle reflective</figcaption><img src="data:image/png;base64,${reflective.toString('base64')}" /></figure>
      </div>
    </body></html>
  `);
  await comparison.screenshot({ path: path.join(output, `closeup-${view}.png`) });
  await comparison.close();
}

async function renderBeforeAfter(view, beforePanel, after) {
  const comparison = await browser.newPage({ viewport: { width: 1600, height: 700 } });
  await comparison.setContent(`
    <!doctype html><html><head><style>
      * { box-sizing:border-box; } body { margin:0; padding:22px; background:#05070a; color:#f3f4f6; font-family:Arial,sans-serif; }
      header { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:14px; }
      h1 { margin:0; font-size:22px; letter-spacing:.08em; text-transform:uppercase; }
      .tag { color:#fbbf24; font-size:13px; font-weight:800; letter-spacing:.14em; }
      .grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
      figure { margin:0; border:1px solid #36404a; border-radius:12px; overflow:hidden; background:#070a0f; }
      figcaption { padding:10px 14px; border-bottom:1px solid #29313a; font-size:14px; font-weight:800; text-transform:uppercase; }
      .viewport { height:575px; display:flex; align-items:${view === 'top' ? 'center' : 'flex-end'}; justify-content:center; overflow:hidden; }
      img { display:block; width:94%; height:auto; max-height:555px; object-fit:contain; }
    </style></head><body>
      <header><h1>${view.replaceAll('-', ' ')}</h1><div class="tag">R3.1 → R3.2 · NORMALIZED</div></header>
      <div class="grid">
        <figure><figcaption>Before · R3.1 revision 1</figcaption><div class="viewport"><img src="data:image/png;base64,${beforePanel.toString('base64')}" /></div></figure>
        <figure><figcaption>After · ${revisionLabel}</figcaption><div class="viewport"><img src="data:image/png;base64,${after.toString('base64')}" /></div></figure>
      </div>
    </body></html>
  `);
  await comparison.screenshot({ path: path.join(output, `before-after-${view}.png`) });
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
    const referenceMeasurement = measureSilhouette(reference);
    const candidateMeasurement = measureSilhouette(candidate);
    const referenceCrop = cropSilhouette(reference, referenceMeasurement);
    const candidateCrop = cropSilhouette(candidate, candidateMeasurement);
    captures[view] = {
      reference,
      candidate,
      referenceCrop,
      candidateCrop,
      referenceMeasurement,
      candidateMeasurement,
    };
    await renderComparison(view, reference, candidate, false);
    await renderComparison(view, referenceCrop, candidateCrop, true);
  }
  await renderSilhouetteSheet(captures);

  for (const view of closeups) {
    const diffuse = await captureCanvas('eds-g03', view, 'diffuse');
    const reflective = await captureCanvas('eds-g03', view, 'reflective');
    await renderInspectionComparison(view, diffuse, reflective);
  }

  if (beforeDirectory) {
    for (const view of views) {
      const beforeSheet = await fs.readFile(path.join(beforeDirectory, `comparison-${view}.png`));
      const beforeViewport = cropRegion(beforeSheet, 810, 103, 766, 575);
      const beforePanel = cropSilhouette(beforeViewport, measureSilhouette(beforeViewport));
      await renderBeforeAfter(view, beforePanel, captures[view].candidateCrop);
    }
  }

  await page.evaluate(() => {
    window.__legacySkinReview.setMode('eds-g03');
    window.__legacySkinReview.setView('front-three-quarter');
    window.__legacySkinReview.setInspection('diffuse');
  });
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.__legacySkinReview.setMode('eds-g01'));
  await page.waitForTimeout(500);
  await page.evaluate(() => window.__legacySkinReview.setMode('eds-g03'));
  await page.waitForTimeout(500);
  const lifetimeBefore = await page.evaluate(() => window.__legacySkinReview.getStats());
  for (let cycle = 0; cycle < 12; cycle += 1) {
    await page.evaluate(
      (inspection) => {
        window.__legacySkinReview.setInspection(inspection);
      },
      cycle % 2 === 0 ? 'reflective' : 'diffuse',
    );
    await page.waitForTimeout(100);
  }
  const lifetimeAfterInspection = await page.evaluate(() => window.__legacySkinReview.getStats());
  for (let cycle = 0; cycle < 6; cycle += 1) {
    await page.evaluate(() => window.__legacySkinReview.setMode('eds-g01'));
    await page.waitForTimeout(140);
    await page.evaluate(() => window.__legacySkinReview.setMode('eds-g03'));
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => window.__legacySkinReview.setInspection('diffuse'));
  await page.waitForTimeout(900);
  const lifetimeAfter = await page.evaluate(() => window.__legacySkinReview.getStats());
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
        inspection: stats.inspection,
      },
      jsHeapBytes: performance.memory?.usedJSHeapSize ?? null,
    };
  });
  const report = {
    generatedAt: new Date().toISOString(),
    viewport: [1440, 900],
    comparisonResolution: [1600, 700],
    views,
    closeups,
    revisionLabel,
    beforeDirectory: beforeDirectory
      ? path.relative(process.cwd(), beforeDirectory).replaceAll('\\', '/')
      : null,
    candidateMode: 'eds-g03',
    referenceMode: 'legacy-eds',
    candidateViewerTransform: {
      rotationYRadians: Math.PI,
      reason: 'Match +Z-front legacy camera convention',
    },
    comparisonMethodology: {
      physicalScale:
        'Identical camera position, target, FOV, viewport and world-space model transforms; no crop normalization.',
      normalized:
        'Foreground bounds are measured against the canvas background, cropped with 10 px padding, assigned identical panel width and bottom-aligned except top view.',
      targetApparentWidthPercent: 92,
      silhouetteThresholdRgbDistance: 48,
      minimumActivePixelsPerAxis: 8,
    },
    silhouetteMeasurements: Object.fromEntries(
      views.map((view) => {
        const capture = captures[view];
        return [
          view,
          {
            reference: capture.referenceMeasurement,
            candidate: capture.candidateMeasurement,
            physicalApparentWidthRatio:
              capture.candidateMeasurement.visibleWidth / capture.referenceMeasurement.visibleWidth,
            normalizationScaleRatio:
              capture.referenceMeasurement.visibleWidth / capture.candidateMeasurement.visibleWidth,
          },
        ];
      }),
    ),
    runtime,
    resourceLifetime: {
      inspectionSwitches: 12,
      modelUnmountRemountCycles: 6,
      alternateModel: 'eds-g01',
      before: {
        geometries: lifetimeBefore.geometries,
        textures: lifetimeBefore.textures,
      },
      after: {
        geometries: lifetimeAfter.geometries,
        textures: lifetimeAfter.textures,
      },
      afterInspection: {
        geometries: lifetimeAfterInspection.geometries,
        textures: lifetimeAfterInspection.textures,
      },
      inspectionStable:
        lifetimeBefore.geometries === lifetimeAfterInspection.geometries &&
        lifetimeBefore.textures === lifetimeAfterInspection.textures,
      modelReloadStable:
        lifetimeBefore.geometries === lifetimeAfter.geometries &&
        lifetimeBefore.textures === lifetimeAfter.textures,
    },
    pageErrors,
    consoleErrors,
    failedLocalRequests,
    physicalDevice: 'NOT TESTED',
    limitations: [
      'Headless desktop Chrome only; no physical-device or sustained thermal test.',
      'Detailed + EDS is a visual-quality reference only; its geometry is not used by EDS-G03.',
      'Physical-scale sheets preserve matched cameras; normalized sheets deliberately remove apparent-size differences.',
      'Visible bounds use a documented RGB-distance segmentation threshold and are comparative, not metrology.',
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
