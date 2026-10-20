import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

// Layout comparison only: the standalone concept's CDN-hosted example 3D cannot load offline.
const input = path.resolve('references/podium-review.html');
const output = path.resolve('docs/commercialization/r1/evidence');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.R1_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-background-networking'],
});
try {
  for (const [name, width, height] of [
    ['mobile', 375, 812],
    ['desktop', 1440, 900],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    await page.goto(pathToFileURL(input).href, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.body.classList.add('loaded'));
    await page.waitForTimeout(1100);
    await page.screenshot({ path: path.join(output, `reference-layout-${name}-${width}.png`) });
    await page.close();
  }
} finally {
  await browser.close();
}
