import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const base = process.env.R2_REVIEW_URL || 'http://127.0.0.1:4173';
const output = path.resolve(process.env.R2_REVIEW_OUTPUT || 'docs/commercialization/r2/evidence');
const views = ['front', 'side', 'top', 'rear', 'threeQuarter', 'showroom'];
const browser = await chromium.launch({
  executablePath:
    process.env.R2_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--enable-precise-memory-info'],
});
await fs.mkdir(output, { recursive: true });
const evidence = [];
try {
  for (const model of ['g01', 'g02']) {
    for (const size of [
      [1200, 750],
      [375, 700],
    ]) {
      const [width, height] = size;
      const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
      const exceptions = [];
      page.on('pageerror', (error) => exceptions.push(error.message));
      const started = Date.now();
      await page.goto(`${base}/scripts/r2-model-review.html?model=${model}&view=showroom`, {
        waitUntil: 'domcontentloaded',
      });
      await page.waitForFunction(() => window.__r2Review?.ready === true);
      const loadMs = Date.now() - started;
      await page.waitForTimeout(2200);
      const stats = await page.evaluate(() => window.__r2Review.getStats());
      if (width === 1200) {
        for (const view of views) {
          await page.evaluate((value) => window.__r2Review.setView(value), view);
          await page.waitForTimeout(180);
          await page
            .locator('canvas')
            .screenshot({ path: path.join(output, `${model}-${view}.png`) });
        }
      } else {
        await page.locator('canvas').screenshot({ path: path.join(output, `${model}-mobile.png`) });
      }
      evidence.push({ model, width, height, loadMs, ...stats, exceptions });
      await page.close();
    }
  }
} finally {
  await browser.close();
}
await fs.writeFile(path.join(output, 'browser-report.json'), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
if (evidence.some((item) => item.exceptions.length)) process.exitCode = 1;
