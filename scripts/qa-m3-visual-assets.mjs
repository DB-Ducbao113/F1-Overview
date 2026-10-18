import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.M3_QA_URL || 'http://127.0.0.1:4173';
const chromePath =
  process.env.M3_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDirectory = process.env.M3_QA_OUTPUT ? path.resolve(process.env.M3_QA_OUTPUT) : null;
const routes = [
  '/',
  '/teams',
  '/teams/ferrari?season=2026',
  '/drivers',
  '/drivers/hamilton?season=2026',
  '/cars/sf24',
  '/season/2026',
  '/showroom',
];
const viewports = [
  { name: 'mobile-375x812', width: 375, height: 812, isMobile: true, hasTouch: true },
  { name: 'desktop-1440x900', width: 1440, height: 900, isMobile: false, hasTouch: false },
];

if (outputDirectory) await fs.mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--disable-background-networking', '--disable-component-update', '--disable-sync'],
});

const results = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.hasTouch,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const localFailures = [];
    const knownPreviewFailures = [];
    const prohibitedVisualRequests = [];

    const isKnownPreviewOnlyUrl = (url) =>
      url.includes('/_vercel/') || url.includes('/api/jolpica');

    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
        consoleErrors.push(message.text());
      }
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) => {
      if (request.url().startsWith(baseUrl)) {
        const failure = `${request.url()}: ${request.failure()?.errorText || 'failed'}`;
        (isKnownPreviewOnlyUrl(request.url()) ? knownPreviewFailures : localFailures).push(failure);
      }
    });
    page.on('request', (request) => {
      if (/images\.unsplash\.com|arcgisonline\.com|tile\.openstreetmap\.org/i.test(request.url())) {
        prohibitedVisualRequests.push(request.url());
      }
    });
    page.on('response', (response) => {
      if (response.url().startsWith(baseUrl) && response.status() >= 400) {
        const failure = `${response.url()}: HTTP ${response.status()}`;
        (isKnownPreviewOnlyUrl(response.url()) ? knownPreviewFailures : localFailures).push(
          failure,
        );
      }
    });

    for (const route of routes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 20_000 });
      await page.waitForTimeout(150);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(600);
      if (route === '/season/2026') {
        await page.locator('[data-championship-tab="calendar"]').click();
        await page.waitForSelector('[data-circuit-track-map]', { timeout: 20_000 });
        await page.waitForSelector('img[src*="/images/eds/circuits/"]', { timeout: 20_000 });
        await page.locator('[data-open-circuit-detail]').first().click();
        await page.waitForSelector('[data-offline-circuit-atlas]', { timeout: 20_000 });
        if (outputDirectory) {
          await page.locator('[data-offline-circuit-atlas]').scrollIntoViewIfNeeded();
          await page.screenshot({
            path: path.join(outputDirectory, `${viewport.name}-offline-circuit-atlas.png`),
          });
        }
        await page.keyboard.press('Escape');
      }
      if (route === '/showroom') {
        await page.waitForSelector('canvas', { timeout: 20_000 });
        await page.waitForFunction(
          () =>
            document.querySelectorAll('[data-eds-livery]').length === 6 &&
            document.querySelectorAll('[data-eds-hotspot]').length === 7,
          { timeout: 20_000 },
        );
      }
      await page.evaluate(async () => {
        const images = [...document.images];
        images.forEach((image) => {
          image.loading = 'eager';
        });
        await Promise.all(
          images.map(async (image) => {
            if (image.complete) return;
            await Promise.race([
              image.decode().catch(() => undefined),
              new Promise((resolve) => window.setTimeout(resolve, 5_000)),
            ]);
          }),
        );
      });
      const state = await page.evaluate(() => {
        const images = [...document.images].map((image) => ({
          src: image.getAttribute('src') || '',
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        }));
        return {
          title: document.title,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          images,
        };
      });
      const brokenImages = state.images.filter(
        (image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0,
      );
      const legacyImages = state.images.filter(
        (image) => image.src.includes('/images/teams/') || image.src.includes('/images/drivers/'),
      );
      results.push({
        viewport: viewport.name,
        route,
        title: state.title,
        imageCount: state.images.length,
        originalEdsImages: state.images.filter((image) => image.src.includes('/images/eds/'))
          .length,
        brokenImages,
        legacyImages,
        horizontalOverflow: state.horizontalOverflow,
        showroom:
          route === '/showroom'
            ? {
                canvas: Boolean(await page.$('canvas')),
                liveries: await page.locator('[data-eds-livery]').count(),
                hotspots: await page.locator('[data-eds-hotspot]').count(),
              }
            : undefined,
      });

      if (
        outputDirectory &&
        ['/', '/teams', '/drivers', '/season/2026', '/showroom'].includes(route)
      ) {
        const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
        await page.screenshot({
          path: path.join(outputDirectory, `${viewport.name}-${slug}.png`),
          fullPage: true,
        });
      }
    }

    results.push({
      viewport: viewport.name,
      browserErrors: {
        consoleErrors,
        pageErrors,
        localFailures,
        knownPreviewFailures,
        prohibitedVisualRequests,
      },
    });
    await context.close();
  }
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  results,
};
console.log(JSON.stringify(report, null, 2));

const failures = results.flatMap((result) => {
  if ('browserErrors' in result) {
    return [
      ...result.browserErrors.consoleErrors,
      ...result.browserErrors.pageErrors,
      ...result.browserErrors.localFailures,
      ...result.browserErrors.prohibitedVisualRequests,
    ];
  }
  return [
    ...(result.brokenImages || []),
    ...(result.legacyImages || []),
    ...(result.horizontalOverflow ? [`horizontal overflow at ${result.route}`] : []),
    ...(result.showroom &&
    (!result.showroom.canvas || result.showroom.liveries !== 6 || result.showroom.hotspots !== 7)
      ? [`showroom controls incomplete at ${result.viewport}`]
      : []),
  ];
});
if (failures.length > 0) process.exitCode = 1;
