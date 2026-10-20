import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const base = process.env.R1_QA_URL || 'http://127.0.0.1:4173';
const output = path.resolve(
  process.env.R1_INTRO_QA_OUTPUT || 'docs/commercialization/r1/phase3-evidence',
);
const executablePath =
  process.env.R1_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];
const failures = [];

function check(viewport, scenario, observed, expected) {
  const pass = expected(observed);
  results.push({ viewport, scenario, pass, observed });
  if (!pass) failures.push(`${viewport} ${scenario}`);
}

async function state(page) {
  return page.evaluate(() => ({
    route: location.pathname + location.search + location.hash,
    navigationType: performance.getEntriesByType('navigation')[0]?.type ?? null,
    introVisible: Boolean(document.querySelector('.podium-intro')),
    introAppearances: window.__introAppearances ?? 0,
    bodyOverflow: document.body.style.overflow,
  }));
}

async function assertNoIntro(page, viewport, scenario) {
  await page.waitForTimeout(120);
  check(
    viewport,
    scenario,
    await state(page),
    (value) => !value.introVisible && value.introAppearances === 0,
  );
}

async function dismiss(page, method) {
  if (method === 'Escape') await page.keyboard.press('Escape');
  else await page.locator('.podium-intro__skip').click();
  await page.locator('.podium-intro').waitFor({ state: 'hidden' });
}

async function primary(page, mobile, id) {
  if (mobile) {
    await page
      .locator('[data-mobile-hub] > nav button')
      .nth({ home: 0, championship: 1, showroom: 2 }[id])
      .click();
  } else {
    const href = { home: '/', championship: '/season/2026', showroom: '/showroom' }[id];
    await page.locator(`nav[aria-label="Main navigation"] a[href="${href}"]`).click();
  }
}

async function setupPage(context) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.__introAppearances = 0;
    let wasVisible = false;
    new MutationObserver(() => {
      const visible = Boolean(document.querySelector('.podium-intro'));
      if (visible && !wasVisible) window.__introAppearances++;
      wasVisible = visible;
    }).observe(document, { childList: true, subtree: true });
  });
  await page.route('**/api/**', (request) =>
    request.fulfill({ status: 503, body: 'Offline UI QA' }),
  );
  return { page, errors };
}

try {
  for (const [viewport, width, height] of [
    ['mobile', 375, 812],
    ['desktop', 1440, 900],
  ]) {
    const mobile = viewport === 'mobile';
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: 'reduce',
    });
    const { page, errors } = await setupPage(context);

    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await assertNoIntro(page, viewport, 'A new navigation to /');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.podium-intro').waitFor({ state: 'visible' });
    check(
      viewport,
      'B refresh / once',
      await state(page),
      (value) =>
        value.navigationType === 'reload' && value.introVisible && value.introAppearances === 1,
    );
    await page.waitForTimeout(2200);
    await page.screenshot({ path: path.join(output, `${viewport}-intro-reload.png`) });
    await dismiss(page, 'Escape');
    check(
      viewport,
      'L Escape then no reappearance',
      await state(page),
      (value) =>
        !value.introVisible && value.introAppearances === 1 && value.bodyOverflow !== 'hidden',
    );
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.podium-intro').waitFor({ state: 'visible' });
    check(
      viewport,
      'K second refresh once',
      await state(page),
      (value) => value.navigationType === 'reload' && value.introAppearances === 1,
    );
    await dismiss(page, 'Skip');
    check(
      viewport,
      'L Skip then no reappearance',
      await state(page),
      (value) =>
        !value.introVisible && value.introAppearances === 1 && value.bodyOverflow !== 'hidden',
    );

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('.podium-intro').waitFor({ state: 'visible' });
    await page.locator('.podium-intro').waitFor({ state: 'hidden', timeout: 12000 });
    check(
      viewport,
      'C completes once',
      await state(page),
      (value) =>
        !value.introVisible && value.introAppearances === 1 && value.bodyOverflow !== 'hidden',
    );
    await page.screenshot({ path: path.join(output, `${viewport}-after-intro.png`) });

    if (mobile) await page.locator('[data-mobile-hub] > nav').waitFor();
    for (let index = 0; index < 3; index++) await primary(page, mobile, 'home');
    check(
      viewport,
      'D repeat Home',
      await state(page),
      (value) => !value.introVisible && value.introAppearances === 1,
    );
    for (const id of ['championship', 'showroom', 'home']) await primary(page, mobile, id);
    check(
      viewport,
      'E Home Championship Showroom Home',
      await state(page),
      (value) =>
        !value.introVisible &&
        value.introAppearances === 1 &&
        (mobile ? value.route.endsWith('#home') : value.route === '/'),
    );
    if (mobile) {
      await page.getByRole('button', { name: 'Open navigation menu' }).click();
      await page.locator('#mobile-nav-menu a[href="/engineering"]').click();
      await page.getByRole('button', { name: 'Open navigation menu' }).click();
      await page.locator('#mobile-nav-menu a[href="/"]').click();
    } else {
      await page.locator('nav[aria-label="Main navigation"] a[href="/engineering"]').click();
      await page.locator('nav[aria-label="Main navigation"] a[href="/"]').click();
    }
    check(
      viewport,
      'F Engineering to Home',
      await state(page),
      (value) => !value.introVisible && value.introAppearances === 1,
    );
    await page.goBack({ waitUntil: 'domcontentloaded' });
    check(
      viewport,
      'G Back',
      await state(page),
      (value) => !value.introVisible && value.introAppearances === 1,
    );
    await page.goForward({ waitUntil: 'domcontentloaded' });
    check(
      viewport,
      'G Forward',
      await state(page),
      (value) => !value.introVisible && value.introAppearances === 1,
    );

    await page.getByRole('button', { name: 'English' }).click();
    await page.getByRole('button', { name: 'Tiếng Việt' }).click();
    await primary(page, mobile, 'championship');
    await page.locator('[data-season-option="2025"]').first().click();
    if (mobile) await primary(page, mobile, 'showroom');
    check(
      viewport,
      'H VI EN season mobile section',
      await state(page),
      (value) => !value.introVisible && value.introAppearances === 1,
    );

    await page.setViewportSize({ width: 860, height: 900 });
    await page.locator('[data-mobile-hub]').waitFor();
    await page.setViewportSize({ width: 861, height: 900 });
    await page.locator('[data-mobile-hub]').waitFor({ state: 'detached' });
    await page.setViewportSize({ width, height });
    check(
      viewport,
      'I resize 860 to 861 and back',
      await state(page),
      (value) => !value.introVisible && value.introAppearances === 1,
    );

    for (const route of ['/season/2026', '/showroom', '/engineering']) {
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
      await assertNoIntro(page, viewport, `J navigate ${route} before refresh`);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.locator('.podium-intro').waitFor({ state: 'visible' });
      check(
        viewport,
        `J refresh ${route} once`,
        await state(page),
        (value) =>
          value.navigationType === 'reload' && value.introVisible && value.introAppearances === 1,
      );
      await dismiss(page, 'Skip');
    }
    check(viewport, 'no uncaught browser exceptions', errors, (value) => value.length === 0);
    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(output, 'intro-lifecycle-results.json'),
  JSON.stringify({ results, failures }, null, 2),
);
console.log(JSON.stringify({ checks: results.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
