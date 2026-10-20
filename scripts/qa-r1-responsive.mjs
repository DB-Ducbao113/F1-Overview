import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const base = process.env.R1_QA_URL || 'http://127.0.0.1:4173';
const executablePath =
  process.env.R1_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const output = path.resolve('docs/commercialization/r1/evidence');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--disable-background-networking', '--enable-precise-memory-info'],
});
const results = [];

async function open(context, route) {
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failedResources = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400)
      failedResources.push({ status: response.status(), url: response.url() });
  });
  page.on('requestfailed', (request) =>
    failedResources.push({ error: request.failure()?.errorText, url: request.url() }),
  );
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('/api/'))
      consoleErrors.push(message.text());
  });
  // Existing automatic sync is deliberately kept offline in this local UI regression.
  await page.route('**/api/**', (request) =>
    request.fulfill({ status: 503, body: 'Offline UI QA' }),
  );
  await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
  const skip = page.locator('.podium-intro__skip');
  if (await skip.isVisible()) await skip.click();
  await page.locator('.podium-intro').waitFor({ state: 'hidden', timeout: 10000 });
  return { page, pageErrors, consoleErrors, failedResources };
}

function measure(page) {
  return page.evaluate(() => ({
    path: location.pathname + location.search + location.hash,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    canvasCount: document.querySelectorAll('canvas').length,
    webglCanvasCount: document.querySelectorAll('canvas[data-engine]').length,
    canvasDetails: [...document.querySelectorAll('canvas')].map((canvas) =>
      canvas.outerHTML.slice(0, 160),
    ),
    bottomNavBottom: document.querySelector('[data-mobile-hub] > nav')?.getBoundingClientRect()
      .bottom,
    mobileSections: [...document.querySelectorAll('[data-mobile-hub] > section')].map(
      (node) => node.id,
    ),
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    navigationDclMs: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,
    jsHeapMiB: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null,
  }));
}

function frameSample(page) {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        const samples = [];
        let previous;
        const tick = (time) => {
          if (previous !== undefined) samples.push(time - previous);
          previous = time;
          if (samples.length < 40) requestAnimationFrame(tick);
          else {
            samples.sort((a, b) => a - b);
            resolve({
              medianMs: Number(samples[20].toFixed(2)),
              p95Ms: Number(samples[38].toFixed(2)),
              mode: 'HEADLESS_CHROME_ONLY',
            });
          }
        };
        requestAnimationFrame(tick);
      }),
  );
}

try {
  for (const [width, height] of [
    [320, 720],
    [375, 812],
    [390, 844],
    [768, 1024],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    const { page, pageErrors, consoleErrors, failedResources } = await open(context, '/');
    await page.waitForSelector('[data-mobile-hub]');
    const initial = await measure(page);
    if (width === 375) await page.screenshot({ path: path.join(output, 'mobile-home-375.png') });
    const nav = page.locator('[data-mobile-hub] > nav');
    await nav.locator('button').nth(1).click();
    await page.waitForTimeout(350);
    const championship = await measure(page);
    const champTop = await page
      .locator('#giai-dau')
      .evaluate((node) => node.getBoundingClientRect().top);
    if (width === 375)
      await page.screenshot({ path: path.join(output, 'mobile-championship-375.png') });
    await nav.locator('button').nth(2).click();
    await page.locator('#showroom [data-eds-livery]').first().waitFor({ timeout: 15000 });
    await page.waitForTimeout(350);
    const showroom = await measure(page);
    const frameTime = width === 375 ? await frameSample(page) : undefined;
    const showroomTop = await page
      .locator('#showroom')
      .evaluate((node) => node.getBoundingClientRect().top);
    const controlLayout = await page.evaluate(() => ({
      hudTop: document.querySelector('#showroom .r1-quick-hud')?.getBoundingClientRect().top,
      hudBottom: document.querySelector('#showroom .r1-quick-hud')?.getBoundingClientRect().bottom,
      navTop: document.querySelector('[data-mobile-hub] > nav')?.getBoundingClientRect().top,
    }));
    if (width === 375)
      await page.screenshot({ path: path.join(output, 'mobile-showroom-375.png') });
    let interactions;
    if (width === 375) {
      const liveries = page.locator('#showroom [data-eds-livery]');
      let liverySelectionsVerified = 0;
      for (let index = 0; index < 6; index++) {
        await liveries.nth(index).click();
        if ((await liveries.nth(index).getAttribute('aria-pressed')) === 'true')
          liverySelectionsVerified++;
      }
      const pressedLivery = await liveries.nth(5).getAttribute('aria-pressed');
      const hotspots = page.locator('#showroom [data-eds-hotspot]');
      const dialog = page.locator('[role="dialog"][aria-labelledby="eds-detail-title"]');
      let hotspotDialogsOpened = 0;
      for (let index = 0; index < 7; index++) {
        await hotspots.nth(index).click();
        if (await dialog.isVisible()) hotspotDialogsOpened++;
        await dialog.locator('button[aria-label]').first().click();
      }
      await page.goBack();
      const backHash = await page.evaluate(() => location.hash);
      await page.goForward();
      const forwardHash = await page.evaluate(() => location.hash);
      await nav.locator('button').first().focus();
      await page.keyboard.press('Enter');
      const keyboardHash = await page.evaluate(() => location.hash);
      interactions = {
        pressedLivery,
        liverySelectionsVerified,
        hotspotDialogsOpened,
        backHash,
        forwardHash,
        keyboardHash,
      };
    }
    results.push({
      viewport: `${width}x${height}`,
      initial,
      championship,
      showroom,
      frameTime,
      champTop,
      showroomTop,
      controlLayout,
      liveryCount: await page.locator('#showroom [data-eds-livery]').count(),
      hotspotCount: await page.locator('#showroom [data-eds-hotspot]').count(),
      interactions,
      pageErrors,
      consoleErrors,
      failedResources,
    });
    await context.close();
  }

  {
    const context = await browser.newContext({
      viewport: { width: 860, height: 900 },
      reducedMotion: 'reduce',
    });
    const { page, pageErrors, failedResources } = await open(context, '/');
    await page.waitForSelector('[data-mobile-hub]');
    const at860 = Boolean(await page.locator('[data-mobile-hub]').count());
    await page.setViewportSize({ width: 861, height: 900 });
    await page.locator('[data-mobile-hub]').waitFor({ state: 'detached' });
    const at861 = Boolean(await page.locator('[data-mobile-hub]').count());
    await page.setViewportSize({ width: 860, height: 900 });
    await page.waitForSelector('[data-mobile-hub]');
    const backAt860 = Boolean(await page.locator('[data-mobile-hub]').count());
    results.push({ resize: '860→861→860', at860, at861, backAt860, pageErrors, failedResources });
    await context.close();
  }

  for (const [width, height] of [
    [1024, 768],
    [1440, 900],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
    });
    for (const [name, route] of [
      ['home', '/'],
      ['championship', '/season/2026'],
      ['showroom', '/showroom'],
    ]) {
      const { page, pageErrors, consoleErrors, failedResources } = await open(context, route);
      await page.waitForTimeout(1600);
      if (width === 1440)
        await page.screenshot({ path: path.join(output, `desktop-${name}-1440.png`) });
      results.push({
        viewport: `${width}x${height}`,
        route,
        ...(await measure(page)),
        frameTime: name === 'home' || name === 'showroom' ? await frameSample(page) : undefined,
        pageErrors,
        consoleErrors,
        failedResources,
      });
      await page.close();
    }
    await context.close();
  }

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    reducedMotion: 'reduce',
  });
  const { page } = await open(context, '/showroom?hotspot=floor');
  await page.waitForSelector('[data-mobile-hub]');
  await page.locator('#showroom [data-eds-livery]').first().waitFor({ timeout: 15000 });
  results.push({
    deepLink: '/showroom?hotspot=floor',
    ...(await measure(page)),
    hotspotPanel: await page
      .locator('[role="dialog"][aria-labelledby="eds-detail-title"]')
      .isVisible(),
    showroomTop: await page
      .locator('#showroom')
      .evaluate((node) => node.getBoundingClientRect().top),
  });
  await context.close();
} finally {
  await browser.close();
}

await fs.writeFile(path.join(output, 'browser-results.json'), JSON.stringify(results, null, 2));
const failures = results.filter(
  (result) =>
    result.overflow > 1 ||
    result.webglCanvasCount > 1 ||
    result.showroom?.webglCanvasCount > 1 ||
    (result.controlLayout &&
      (result.controlLayout.hudTop < 0 ||
        result.controlLayout.hudBottom > result.controlLayout.navTop - 2)) ||
    (result.initial &&
      Math.abs(result.initial.bottomNavBottom - Number(result.viewport?.split('x')[1])) > 2) ||
    (result.interactions &&
      (result.interactions.pressedLivery !== 'true' ||
        result.interactions.liverySelectionsVerified !== 6 ||
        result.interactions.hotspotDialogsOpened !== 7 ||
        result.interactions.backHash !== '#giai-dau' ||
        result.interactions.forwardHash !== '#showroom' ||
        result.interactions.keyboardHash !== '#home')) ||
    (result.deepLink && (!result.hotspotPanel || Math.abs(result.showroomTop - 64) > 40)) ||
    (result.initial?.mobileSections?.join(',') !== undefined &&
      result.initial.mobileSections.join(',') !== 'home,giai-dau,showroom') ||
    result.pageErrors?.length ||
    result.consoleErrors?.some((message) => !message.startsWith('Failed to load resource')) ||
    result.failedResources?.some(
      (resource) =>
        !['fonts.googleapis.com/css2?', '/_vercel/', '/api/jolpica?'].some((expected) =>
          resource.url.includes(expected),
        ),
    ) ||
    (result.resize && (!result.at860 || result.at861 || !result.backAt860)),
);
console.log(
  JSON.stringify(
    {
      views: results.length,
      failures: failures.length,
      failedChecks: failures.map((result) => result.viewport || result.resize || result.deepLink),
    },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
