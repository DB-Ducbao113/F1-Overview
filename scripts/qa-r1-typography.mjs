import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const base = process.env.R1_TYPE_QA_URL || 'http://127.0.0.1:4182';
const label = process.env.R1_TYPE_QA_LABEL || 'current';
const smoke = process.env.R1_TYPE_QA_SMOKE === '1';
const screenshots = process.env.R1_TYPE_QA_SCREENSHOTS !== '0';
const fontModes = process.env.R1_TYPE_QA_FONT_MODE
  ? [process.env.R1_TYPE_QA_FONT_MODE]
  : smoke
    ? ['fallback']
    : ['remote', 'fallback'];
const output = path.resolve('docs/commercialization/r1/typography-evidence');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.R1_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
  args: ['--disable-background-networking'],
});
const results = [];

try {
  for (const fontMode of fontModes) {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      reducedMotion: 'reduce',
    });
    if (fontMode === 'fallback') {
      await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
        route.abort('blockedbyclient'),
      );
    }
    const page = await context.newPage();
    const warnings = [];
    const errors = [];
    page.on('console', (message) => {
      if (message.type() === 'warning' || message.type() === 'error') warnings.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('**/api/**', (route) =>
      route.fulfill({ status: 503, body: 'Offline typography QA' }),
    );
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.locator('#official-grid h1').waitFor({ state: 'visible' });
    const sizes = smoke
      ? [[Number(process.env.R1_TYPE_QA_WIDTH || 375), 812]]
      : [
          [320, 720],
          [375, 812],
          [390, 844],
          [768, 1024],
          [1024, 768],
          [1440, 900],
        ];
    for (const [width, height] of sizes) {
      await page.setViewportSize({ width, height });
      for (const motion of smoke ? ['reduce'] : ['reduce', 'no-preference']) {
        await page.emulateMedia({ reducedMotion: motion });
        for (const lang of ['vi', 'en']) {
          await page
            .getByRole('button', { name: lang === 'vi' ? 'Tiếng Việt' : 'English' })
            .click();
          const heading = page.locator('#official-grid h1');
          await heading.waitFor({ state: 'visible' });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(450);
          await heading.scrollIntoViewIfNeeded();
          const reading = await heading.evaluate((node) => {
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            return {
              text: node.textContent?.replace(/\s+/g, ' ').trim(),
              html: node.innerHTML,
              fontFamily: style.fontFamily,
              fontWeight: style.fontWeight,
              lineHeight: style.lineHeight,
              letterSpacing: style.letterSpacing,
              width: rect.width,
              height: rect.height,
              scrollHeight: node.scrollHeight,
              scrollWidth: node.scrollWidth,
              headingOverflow: node.scrollWidth - node.clientWidth,
              viewportOverflow: document.documentElement.scrollWidth - innerWidth,
              loadedFaces: [...document.fonts]
                .filter((face) => face.status === 'loaded')
                .map((face) => `${face.family}:${face.weight}`),
              fetchPriority: document
                .querySelector('.podium-hero-image')
                ?.getAttribute('fetchpriority'),
            };
          });
          const name = `${label}-${width}-${lang}-${fontMode}-${motion}`;
          if (screenshots) await heading.screenshot({ path: path.join(output, `${name}.png`) });
          results.push({ name, width, height, lang, fontMode, motion, ...reading });
        }
      }
    }
    if (!smoke && fontMode === 'fallback') {
      for (const [width, height] of [
        [320, 720],
        [1440, 900],
      ]) {
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        for (const [name, route, mobileSelector] of [
          ['championship', '/season/2026', '#giai-dau h1'],
          ['showroom', '/showroom', '#showroom h1'],
          ['engineering-index', '/engineering', 'main h1'],
          ['engineering-article', '/engineering/ground-effect-aerodynamics', 'main h1'],
          ['teams', '/teams', 'main h1'],
          ['team-profile', '/teams/ferrari', 'main h1'],
          ['drivers', '/drivers', 'main h1'],
          ['driver-profile', '/drivers/verstappen', 'main h1'],
        ]) {
          await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
          await page.getByRole('button', { name: 'Tiếng Việt' }).click();
          const heading = page.locator(width <= 860 ? mobileSelector : 'main h1').first();
          try {
            await heading.waitFor({ state: 'visible', timeout: 20000 });
            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(450);
            const reading = await heading.evaluate((node) => {
              const style = getComputedStyle(node);
              return {
                text: node.textContent?.replace(/\s+/g, ' ').trim(),
                fontFamily: style.fontFamily,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeight,
                letterSpacing: style.letterSpacing,
                viewportOverflow: document.documentElement.scrollWidth - innerWidth,
                headingOverflow: node.scrollWidth - node.clientWidth,
                height: node.getBoundingClientRect().height,
              };
            });
            if (screenshots)
              await heading.screenshot({
                path: path.join(output, `${label}-${name}-${width}.png`),
              });
            results.push({ route, name: `${label}-${name}-${width}`, width, ...reading });
          } catch (error) {
            results.push({ route, name: `${label}-${name}-${width}`, error: String(error) });
          }
        }
      }
    }
    results.push({ fontMode, warnings, errors });
    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(output, `${label}-results.json`), JSON.stringify(results, null, 2));
console.log(
  JSON.stringify({
    cases: results.filter((result) => result.name).length,
    loadedRemoteFaces:
      results
        .filter((result) => result.fontMode === 'remote' && result.loadedFaces?.length)
        .map((result) => result.loadedFaces)[0] ?? [],
    warnings: results.filter((result) => result.warnings).flatMap((result) => result.warnings),
    errors: results.filter((result) => result.errors).flatMap((result) => result.errors),
  }),
);
if (process.env.R1_TYPE_QA_EXPECT_PASS === '1') {
  const defects = results.filter(
    (result) =>
      result.error ||
      result.viewportOverflow > 1 ||
      result.headingOverflow > 1 ||
      (result.html &&
        (result.html.includes(' · ') ||
          !result.html.includes('<span class="block">') ||
          result.fetchPriority !== 'high')) ||
      result.warnings?.some((warning) => warning.includes('fetchPriority')) ||
      result.errors?.length,
  );
  if (defects.length) {
    console.error(
      JSON.stringify({ defects: defects.map((result) => result.name || result.fontMode) }),
    );
    process.exitCode = 1;
  }
}
