import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.M5_QA_URL || 'http://127.0.0.1:4173';
const chromePath =
  process.env.M5_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDirectory = path.resolve(
  process.env.M5_QA_OUTPUT || 'docs/commercialization/m5/evidence',
);
const views = [
  { name: 'engineering-index-desktop-1440x900', path: '/engineering', width: 1440, height: 900 },
  {
    name: 'ground-effect-article-desktop-1440x900',
    path: '/engineering/ground-effect-aerodynamics',
    width: 1440,
    height: 900,
  },
  {
    name: 'ground-effect-article-mobile-375x812',
    path: '/engineering/ground-effect-aerodynamics',
    width: 375,
    height: 812,
    mobile: true,
  },
  {
    name: 'engineering-index-tablet-768x1024',
    path: '/engineering',
    width: 768,
    height: 1024,
  },
];
const isExpectedLocalPreviewFailure = (failure) =>
  failure.includes('/api/') ||
  failure.includes('/_vercel/insights/') ||
  failure.includes('/_vercel/speed-insights/');

await fs.mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--disable-background-networking', '--disable-component-update', '--disable-sync'],
});
const results = [];
try {
  for (const view of views) {
    const context = await browser.newContext({
      viewport: { width: view.width, height: view.height },
      isMobile: Boolean(view.mobile),
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    const failedResources = [];
    const failedRequests = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.url().startsWith(baseUrl) && response.status() >= 400)
        failedResources.push(`${response.status()} ${response.url()}`);
    });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('requestfailed', (request) => {
      failedRequests.push(`${request.failure()?.errorText ?? 'FAILED'} ${request.url()}`);
    });
    await page.goto(`${baseUrl}${view.path}`, { waitUntil: 'networkidle' });
    await page
      .locator('.podium-intro__skip')
      .click({ timeout: 1500 })
      .catch(() => {});
    await page.waitForSelector('h1');
    const metrics = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      brokenImages: [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.getAttribute('src')),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
      hasArticleSchema: [...document.querySelectorAll('script[type="application/ld+json"]')].some(
        (script) => script.textContent?.includes('TechArticle'),
      ),
    }));
    if (metrics.overflow > 1)
      throw new Error(`${view.name}: horizontal overflow ${metrics.overflow}px`);
    if (metrics.brokenImages.length)
      throw new Error(`${view.name}: broken images ${metrics.brokenImages.join(', ')}`);
    const unexpectedConsoleErrors = consoleErrors.filter(
      (message) => !message.startsWith('Failed to load resource:'),
    );
    const unexpectedFailedResources = failedResources.filter(
      (failure) => !isExpectedLocalPreviewFailure(failure),
    );
    const unexpectedFailedRequests = failedRequests.filter(
      (failure) => failure.includes(baseUrl) && !isExpectedLocalPreviewFailure(failure),
    );
    if (pageErrors.length)
      throw new Error(`${view.name}: page exceptions ${pageErrors.join(' | ')}`);
    if (unexpectedConsoleErrors.length)
      throw new Error(`${view.name}: console errors ${unexpectedConsoleErrors.join(' | ')}`);
    if (unexpectedFailedResources.length)
      throw new Error(`${view.name}: failed resources ${unexpectedFailedResources.join(' | ')}`);
    if (unexpectedFailedRequests.length)
      throw new Error(`${view.name}: failed requests ${unexpectedFailedRequests.join(' | ')}`);
    if (view.path.includes('ground-effect') && !metrics.hasArticleSchema)
      throw new Error(`${view.name}: TechArticle schema missing`);
    await page.screenshot({
      path: path.join(outputDirectory, `${view.name}.png`),
      fullPage: view.name.includes('mobile'),
    });
    results.push({
      ...view,
      ...metrics,
      consoleErrors,
      pageErrors,
      failedResources,
      failedRequests,
      expectedOfflineFailures: failedResources.filter(isExpectedLocalPreviewFailure),
    });
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/showroom?hotspot=floor`, { waitUntil: 'domcontentloaded' });
  await page
    .locator('.podium-intro__skip')
    .click({ timeout: 1500 })
    .catch(() => {});
  await page.waitForSelector('[role="dialog"]', { timeout: 20_000 });
  const showroom = await page.evaluate(() => ({
    selectedHotspot: document
      .querySelector('[data-eds-hotspot="floor"]')
      ?.getAttribute('aria-pressed'),
    dialogTitle: document.querySelector('[role="dialog"] h2')?.textContent?.trim(),
    articleLink: document
      .querySelector('[role="dialog"] a[href^="/engineering/"]')
      ?.getAttribute('href'),
  }));
  if (!showroom.dialogTitle || !showroom.articleLink)
    throw new Error(`Showroom deep link failed: ${JSON.stringify(showroom)}`);
  results.push({ showroomDeepLink: showroom });
  await context.close();

  const validationContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const validationPage = await validationContext.newPage();
  const articles = JSON.parse(await fs.readFile('src/data/engineeringArticles.json', 'utf8'));
  const routeChecks = [];
  for (const article of articles) {
    const response = await validationPage.goto(`${baseUrl}/engineering/${article.slug}`, {
      waitUntil: 'domcontentloaded',
    });
    await validationPage.waitForSelector('h1');
    const check = await validationPage.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      brokenImages: [...document.images].filter(
        (image) => image.complete && image.naturalWidth === 0,
      ).length,
    }));
    if (!response?.ok() || !check.h1 || check.overflow > 1 || check.brokenImages)
      throw new Error(`Article route failed ${article.slug}: ${JSON.stringify(check)}`);
    routeChecks.push({ slug: article.slug, status: response.status(), ...check });
  }
  await validationPage.goto(`${baseUrl}/engineering/not-a-real-article`, {
    waitUntil: 'domcontentloaded',
  });
  await validationPage.waitForSelector('h1');
  const notFound = await validationPage.evaluate(() => ({
    heading: document.querySelector('h1')?.textContent?.trim(),
    has404Code: document.body.textContent?.includes('404') ?? false,
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content'),
  }));
  if (!notFound.has404Code)
    throw new Error(`Article 404 state failed: ${JSON.stringify(notFound)}`);
  if (notFound.robots !== 'noindex, nofollow')
    throw new Error(`Article 404 must be noindex: ${JSON.stringify(notFound)}`);
  results.push({ routeChecks, notFound });
  await validationContext.close();
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(outputDirectory, 'browser-results.json'),
  `${JSON.stringify({ baseUrl, capturedAt: new Date().toISOString(), results }, null, 2)}\n`,
  'utf8',
);
console.log(
  `PASS M5 browser QA: ${views.length} responsive captures, four article routes, 404 state and Showroom hotspot deep link.`,
);
