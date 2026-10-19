import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:4177';
const outputDir = path.resolve('docs/commercialization/m5/evidence/phase2');
const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
let executablePath;
for (const candidate of chromeCandidates) {
  try {
    await fs.access(candidate);
    executablePath = candidate;
    break;
  } catch {
    // Continue through known local browser locations.
  }
}
if (!executablePath) throw new Error('Chrome/Chromium not found. Set CHROME_PATH.');

await fs.mkdir(outputDir, { recursive: true });
const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'podium-m5-routes-'));
const generated = spawnSync(
  process.execPath,
  ['scripts/generate-seo-artifacts.mjs', `--output=${tempDir}`],
  {
    cwd: process.cwd(),
    env: {
      ...process.env,
      VITE_SITE_URL: 'https://commercial.example',
      VITE_ALLOW_INDEXING: 'true',
      VITE_DEPLOYMENT_CONTEXT: 'production',
    },
    encoding: 'utf8',
  },
);
if (generated.status !== 0) throw new Error(generated.stderr || generated.stdout);
const sitemap = await fs.readFile(path.join(tempDir, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/commercial\.example([^<]*)<\/loc>/g)].map(
  (match) => match[1] || '/',
);

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--disable-background-networking', '--disable-component-update', '--disable-sync'],
});
const results = { baseUrl, routeCount: routes.length, viewports: [], routeFailures: [] };
try {
  for (const viewport of [
    { name: 'mobile', width: 375, height: 812 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
  ]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/engineering/ground-effect-aerodynamics`, {
      waitUntil: 'networkidle',
    });
    await page
      .locator('.podium-intro__skip')
      .click({ timeout: 1500 })
      .catch(() => {});
    await page.waitForSelector('article h1');
    const semantics = await page.evaluate(() => {
      const headingLevels = [
        ...document.querySelectorAll('article h1, article h2, article h3'),
      ].map((heading) => Number(heading.tagName.slice(1)));
      return {
        h1Count: document.querySelectorAll('article h1').length,
        headingLevels,
        imagesWithoutAlt: [...document.images]
          .filter((image) => !image.hasAttribute('alt'))
          .map((image) => image.getAttribute('src')),
        unnamedLinks: [...document.querySelectorAll('a')]
          .filter((link) => !link.textContent?.trim() && !link.getAttribute('aria-label'))
          .map((link) => link.getAttribute('href')),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    if (semantics.h1Count !== 1) throw new Error(`${viewport.name}: expected one article h1`);
    if (semantics.imagesWithoutAlt.length)
      throw new Error(
        `${viewport.name}: images without alt ${semantics.imagesWithoutAlt.join(', ')}`,
      );
    if (semantics.unnamedLinks.length)
      throw new Error(`${viewport.name}: unnamed links ${semantics.unnamedLinks.join(', ')}`);
    if (semantics.overflow > 1)
      throw new Error(`${viewport.name}: horizontal overflow ${semantics.overflow}px`);
    for (let index = 1; index < semantics.headingLevels.length; index += 1) {
      if (semantics.headingLevels[index] - semantics.headingLevels[index - 1] > 1)
        throw new Error(`${viewport.name}: skipped heading level`);
    }

    const focusChecks = [];
    await page.locator('body').focus();
    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => {
        const element = document.activeElement;
        if (!(element instanceof HTMLElement)) return null;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          text: (element.getAttribute('aria-label') || element.textContent || '')
            .trim()
            .slice(0, 80),
          visible: rect.width > 0 && rect.height > 0,
          indicator:
            (style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) > 0) ||
            style.boxShadow !== 'none',
        };
      });
      if (!focus?.visible || !focus.indicator)
        throw new Error(
          `${viewport.name}: missing visible keyboard focus ${JSON.stringify(focus)}`,
        );
      focusChecks.push(focus);
    }
    results.viewports.push({ ...viewport, semantics, focusChecks });
    await context.close();
  }

  const metadataContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const metadataPage = await metadataContext.newPage();
  await metadataPage.goto(`${baseUrl}/engineering/ground-effect-aerodynamics`, {
    waitUntil: 'networkidle',
  });
  await metadataPage
    .locator('.podium-intro__skip')
    .click({ timeout: 1500 })
    .catch(() => {});
  await metadataPage.getByTitle('English').click();
  await metadataPage.waitForFunction(() => document.documentElement.lang === 'en');
  results.bilingualMetadata = await metadataPage.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    locale: document.querySelector('meta[property="og:locale"]')?.getAttribute('content'),
    socialImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
  }));
  if (
    results.bilingualMetadata.lang !== 'en' ||
    results.bilingualMetadata.locale !== 'en_US' ||
    !results.bilingualMetadata.title.includes('Ground Effect') ||
    !results.bilingualMetadata.socialImage?.endsWith('.png')
  )
    throw new Error(`Bilingual metadata failed ${JSON.stringify(results.bilingualMetadata)}`);

  const routePage = await metadataContext.newPage();
  for (const route of routes) {
    const response = await routePage.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded' });
    await routePage.waitForSelector('h1', { timeout: 10_000 }).catch(() => {});
    const routeState = await routePage.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim(),
      notFound:
        document.body.textContent?.includes('Không tìm thấy trang') ||
        document.body.textContent?.includes('Page Not Found') ||
        false,
    }));
    if (!response?.ok() || !routeState.h1 || routeState.notFound)
      results.routeFailures.push({ route, status: response?.status(), ...routeState });
  }
  if (results.routeFailures.length)
    throw new Error(`Invalid sitemap routes: ${JSON.stringify(results.routeFailures)}`);
  await metadataContext.close();

  const noJsContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    javaScriptEnabled: false,
  });
  const noJsPage = await noJsContext.newPage();
  const noJsResponse = await noJsPage.goto(
    `${baseUrl}/engineering/ground-effect-aerodynamics/index.html`,
    { waitUntil: 'load' },
  );
  results.noJavaScript = await noJsPage.evaluate(() => ({
    statusText: document.querySelector('h1')?.textContent?.trim(),
    paragraphCount: document.querySelectorAll('article p').length,
    imageAlt: document.querySelector('article img')?.getAttribute('alt'),
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
  }));
  if (
    !noJsResponse?.ok() ||
    !results.noJavaScript.statusText ||
    results.noJavaScript.paragraphCount < 16 ||
    !results.noJavaScript.imageAlt
  )
    throw new Error(`No-JavaScript article failed ${JSON.stringify(results.noJavaScript)}`);
  await noJsContext.close();
} finally {
  await browser.close();
  await fs.rm(tempDir, { recursive: true, force: true });
}

await fs.writeFile(
  path.join(outputDir, 'accessibility-browser-results.json'),
  `${JSON.stringify({ ...results, capturedAt: new Date().toISOString() }, null, 2)}\n`,
  'utf8',
);
console.log(
  `PASS M5 accessibility/browser QA: three viewports, keyboard focus, bilingual metadata, ${routes.length} sitemap routes and no-JavaScript rendering verified.`,
);
