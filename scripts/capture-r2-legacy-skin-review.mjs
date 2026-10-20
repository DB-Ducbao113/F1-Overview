import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const base = process.env.R2_LEGACY_URL || 'http://127.0.0.1:4173';
const output = path.resolve(
  process.env.R2_LEGACY_OUTPUT || 'docs/commercialization/r2/legacy-skin-evidence',
);
const executablePath =
  process.env.R2_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const views = ['front-three-quarter', 'side', 'top', 'front', 'rear', 'rear-three-quarter'];
const liveries = [
  'eds-carbon',
  'eds-aero',
  'eds-crimson',
  'eds-monochrome',
  'eds-gold',
  'eds-electric',
];

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
const pageErrors = [];
const consoleErrors = [];
const failedLocalRequests = [];
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

try {
  await page.goto(`${base}/dev-showroom.html?mode=legacy-eds&livery=eds-aero`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForFunction(
    () =>
      window.__legacySkinReview?.ready &&
      window.__legacySkinReview.getStats().geometry?.geometryPreserved,
  );
  await page.waitForTimeout(1800);

  for (const mode of ['legacy-original', 'legacy-eds']) {
    await page.evaluate((value) => window.__legacySkinReview.setMode(value), mode);
    await page.waitForTimeout(600);
    for (const view of views) {
      await page.evaluate((value) => window.__legacySkinReview.setView(value), view);
      await page.waitForTimeout(420);
      await page.locator('canvas').screenshot({
        path: path.join(output, `${mode}-${view}.png`),
      });
    }
  }

  await page.evaluate(() => window.__legacySkinReview.setMode('legacy-eds'));
  await page.evaluate(() => window.__legacySkinReview.setView('front-three-quarter'));
  for (const livery of liveries) {
    await page.evaluate((value) => window.__legacySkinReview.setLivery(value), livery);
    await page.waitForTimeout(500);
    await page.locator('canvas').screenshot({ path: path.join(output, `skin-${livery}.png`) });
  }

  const memorySamples = [];
  for (let cycle = 0; cycle < 5; cycle += 1) {
    for (const livery of liveries) {
      await page.evaluate((value) => window.__legacySkinReview.setLivery(value), livery);
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(450);
    memorySamples.push(
      await page.evaluate(
        (cycleNumber) => ({
          cycle: cycleNumber,
          stats: window.__legacySkinReview.getStats(),
          jsHeapBytes: performance.memory?.usedJSHeapSize ?? null,
        }),
        cycle,
      ),
    );
  }
  await page.waitForTimeout(1500);
  const finalStats = await page.evaluate(() => window.__legacySkinReview.getStats());
  const report = {
    generatedAt: new Date().toISOString(),
    viewport: [1440, 900],
    views,
    liveries,
    geometryPreserved: finalStats.geometry?.geometryPreserved ?? false,
    finalStats,
    memorySamples,
    pageErrors,
    consoleErrors,
    failedLocalRequests,
    limitations: [
      'Headless desktop Chrome only; no physical mobile GPU or sustained thermal test.',
      'RAF intervals include headless capture overhead and are not field Web Vitals.',
      'JS heap and renderer counters are short-run leak indicators, not proof of leak freedom.',
    ],
  };
  await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (
    !report.geometryPreserved ||
    pageErrors.length ||
    consoleErrors.length ||
    failedLocalRequests.length
  ) {
    process.exitCode = 1;
  }
} finally {
  await page.close();
  await browser.close();
}
