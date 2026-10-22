import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const base = process.env.R3_GDR_URL || 'http://127.0.0.1:4173';
const chrome =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const model = await fs.readFile(
  path.resolve(
    process.env.R3_GLB_PATH ??
      'docs/commercialization/r3/blender-authoring/eds-g03-clay-review.glb',
  ),
);
const output = path.resolve(
  process.env.R3_BENCHMARK_OUTPUT ??
    'docs/commercialization/r3/blender-authoring/browser-performance.json',
);
const evidenceRoot = path.resolve(
  process.env.R3_BENCHMARK_EVIDENCE ??
    'docs/commercialization/r3/blender-authoring/evidence/refinement-revision-2/browser',
);
const viewports = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile-emulation', width: 375, height: 812 },
];
const report = {
  method:
    'Headless Chrome WebGL load timing and requestAnimationFrame interval; RAF is not GPU render time.',
  modelBytes: model.length,
  runsPerViewport: 3,
  viewports: {},
  errors: [],
};
const browser = await chromium.launch({ executablePath: chrome, headless: true });
await fs.mkdir(evidenceRoot, { recursive: true });

try {
  for (const viewport of viewports) {
    const runs = [];
    for (let run = 0; run < 3; run += 1) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      page.on('pageerror', (error) =>
        report.errors.push(`${viewport.id}/${run}: ${error.message}`),
      );
      page.on('console', (message) => {
        if (message.type() === 'error')
          report.errors.push(`${viewport.id}/${run}: ${message.text()}`);
      });
      await page.route('**/gdr-prototype.glb', (route) =>
        route.fulfill({ status: 200, contentType: 'model/gltf-binary', body: model }),
      );
      const started = performance.now();
      await page.goto(`${base}/gdr-review.html?region=design-front-three-quarter&mode=diffuse`, {
        waitUntil: 'domcontentloaded',
      });
      await page.waitForFunction(() => window.__gdrReady === true, null, { timeout: 60000 });
      const readyMs = performance.now() - started;
      const data = await page.evaluate(async () => {
        const intervals = [];
        let previous = performance.now();
        for (let index = 0; index < 120; index += 1) {
          await new Promise((resolve) => requestAnimationFrame(resolve));
          const now = performance.now();
          intervals.push(now - previous);
          previous = now;
        }
        intervals.sort((a, b) => a - b);
        return {
          stats: window.__gdrStats,
          rafMedianMs: intervals[Math.floor(intervals.length / 2)],
          rafP95Ms: intervals[Math.floor(intervals.length * 0.95)],
        };
      });
      if (run === 0) {
        await page.screenshot({
          path: path.join(evidenceRoot, `${viewport.id}-front-three-quarter.png`),
          fullPage: true,
        });
      }
      runs.push({ readyMs, ...data });
      await page.close();
    }
    report.viewports[viewport.id] = { viewport: [viewport.width, viewport.height], runs };
  }
  await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  await fs.writeFile(
    path.join(evidenceRoot, 'browser-errors.json'),
    `${JSON.stringify({ errors: report.errors }, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
  if (report.errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
