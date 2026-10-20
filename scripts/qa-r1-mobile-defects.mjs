import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const base = process.env.R1_QA_URL || 'http://127.0.0.1:4182';
const label = process.env.R1_QA_LABEL || 'current';
const output = path.resolve(
  process.env.R1_QA_OUTPUT || 'docs/commercialization/r1/phase2-evidence',
);
const browser = await chromium.launch({
  executablePath:
    process.env.R1_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-background-networking'],
});

const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.goto(base, { waitUntil: 'domcontentloaded' });
await page.locator('[data-mobile-hub] > nav button').first().waitFor();

const sections = [];
for (const [index, id] of [
  [2, 'showroom'],
  [0, 'home'],
  [1, 'giai-dau'],
  [2, 'showroom'],
  [0, 'home'],
]) {
  await page.locator('[data-mobile-hub] > nav button').nth(index).click();
  await page.waitForTimeout(1200);
  sections.push(
    await page.evaluate((section) => {
      const target = document.getElementById(section);
      const nav = document.querySelector('[data-mobile-hub] > nav');
      const active = nav?.querySelector('[aria-current="location"]');
      return {
        requested: section,
        hash: location.hash,
        targetTop: target?.getBoundingClientRect().top,
        activeLabel: active?.textContent?.trim(),
        visibleSection: document.elementFromPoint(innerWidth / 2, 120)?.closest('section[id]')?.id,
        scrollY,
      };
    }, id),
  );
}

await page.screenshot({ path: path.join(output, `mobile-defect-${label}.png`) });
const pause = page.getByRole('button', { name: /Tạm dừng dòng tin|Pause ticker/ });
await pause.click();
await page.waitForTimeout(50);
const ticker = await page.evaluate(() => {
  const track = document.querySelector('.animate-ticker-marquee');
  return {
    label: document.querySelector('button[aria-label*="dòng tin"]')?.getAttribute('aria-label'),
    computedPlayState: track && getComputedStyle(track).animationPlayState,
    transform: track && getComputedStyle(track).transform,
  };
});
await page.waitForTimeout(300);
ticker.pausedTransformAfterWait = await page
  .locator('.animate-ticker-marquee')
  .evaluate((track) => getComputedStyle(track).transform);
await page.getByRole('button', { name: /Tiếp tục dòng tin|Resume ticker/ }).click();
ticker.resumedPlayState = await page
  .locator('.animate-ticker-marquee')
  .evaluate((track) => getComputedStyle(track).animationPlayState);
const fonts = await page.evaluate(() => ({
  displayLoaded: document.fonts.check('700 40px "Playfair Display"'),
  bodyFont: getComputedStyle(document.body).fontFamily,
  heroFont: getComputedStyle(document.querySelector('.r1-mobile-hero h1')).fontFamily,
}));
await browser.close();

const result = { sections, ticker, fonts, errors };
await fs.writeFile(
  path.join(output, `mobile-defect-${label}.json`),
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));
if (process.env.R1_QA_EXPECT_PASS === '1') {
  const labels = { home: 'Trang chủ', 'giai-dau': 'Giải đấu', showroom: 'Showroom' };
  const sectionFailure = sections.some(
    (section) =>
      Math.abs(section.targetTop - 64) > 4 ||
      section.visibleSection !== section.requested ||
      section.activeLabel !== labels[section.requested],
  );
  const tickerFailure =
    ticker.computedPlayState !== 'paused' ||
    ticker.transform !== ticker.pausedTransformAfterWait ||
    ticker.resumedPlayState !== 'running';
  if (sectionFailure || tickerFailure || errors.length) process.exitCode = 1;
}
