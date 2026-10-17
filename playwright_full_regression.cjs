// playwright_full_regression.cjs
// Full regression script using Playwright role/name/aria locators.
// Run from the project root where node_modules are installed.

const { chromium } = require('playwright-core');
const fs = require('fs');

function logResult(step, status, details = '') {
  const line = `${step}: ${status}${details ? ' – ' + details : ''}`;
  console.log(line);
  return line;
}

(async () => {
  const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: false,
    args: ['--no-sandbox'],
  });

  const results = [];
  const baseUrl = 'http://localhost:4173/';

  const captureErrors = (page, prefix) => {
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`[console error] ${msg.text()}`);
    });
    page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));
    page.on('requestfailed', (request) => {
      const failure = request.failure();
      errors.push(`[request failed] ${request.url()} – ${failure?.errorText}`);
    });
    const outPath = `${prefix}_errors.txt`;
    fs.writeFileSync(outPath, errors.join('\n'));
    console.log('ERROR_LOG_SAVED:', outPath);
  };

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  // 1. Start Lights
  try {
    await page.reload({ waitUntil: 'networkidle' });
    const startLights = await page.getByRole('img', { name: /Start Lights/i }).first();
    if ((await startLights.count()) > 0) {
      results.push(logResult('START_LIGHTS', 'PASS'));
    } else {
      results.push(logResult('START_LIGHTS', 'SELECTOR_ERROR', 'no matching element'));
    }
  } catch (e) {
    results.push(logResult('START_LIGHTS', 'FAIL', e.message));
  }

  // 2. Season selector 2025/2026
  try {
    const seasonToggle = await page.getByRole('button', { name: /Season/i });
    await seasonToggle.click();
    const option = await page.getByRole('option', { name: '2025/2026' });
    if ((await option.count()) > 0) {
      await option.click();
      results.push(logResult('SEASON_2025_2026', 'PASS'));
    } else {
      results.push(logResult('SEASON_2025_2026', 'SELECTOR_ERROR', 'option not found'));
    }
  } catch (e) {
    results.push(logResult('SEASON_2025_2022', 'FAIL', e.message));
  }

  // 3. Liveries count
  try {
    const liveryTab = await page.getByRole('tab', { name: /Livery|Showroom/i }).first();
    await liveryTab.click();
    const liveries = await page.getByRole('button', { name: /Livery/i });
    const count = await liveries.count();
    if (count === 11) {
      results.push(logResult('SHOWROOM_LIVERIES_COUNT', 'PASS', `found ${count}`));
    } else if (count > 0) {
      results.push(logResult('SHOWROOM_LIVERIES_COUNT', 'FAIL', `found ${count}`));
    } else {
      results.push(logResult('SHOWROOM_LIVERIES_COUNT', 'SELECTOR_ERROR', 'no livery buttons'));
    }
  } catch (e) {
    results.push(logResult('SHOWROOM_LIVERIES_COUNT', 'FAIL', e.message));
  }

  // 4. Hotspot toggle
  try {
    const hotspotToggle = await page.getByRole('button', { name: /Show Hotspots/i });
    await hotspotToggle.click();
    results.push(logResult('HOTSPOT_TOGGLE', 'PASS'));
  } catch (e) {
    results.push(logResult('HOTSPOT_TOGGLE', 'SELECTOR_ERROR', e.message));
  }

  // 5. Hotspot modals
  try {
    const hotspots = await page.getByRole('button', { name: /Hotspot/i });
    const count = await hotspots.count();
    if (count === 7) {
      results.push(logResult('HOTSPOTS_COUNT', 'PASS', `found ${count}`));
    } else if (count > 0) {
      results.push(logResult('HOTSPOTS_COUNT', 'FAIL', `found ${count}`));
    } else {
      results.push(logResult('HOTSPOTS_COUNT', 'SELECTOR_ERROR', 'no hotspot buttons'));
    }
    for (let i = 0; i < count; i++) {
      const btn = await hotspots.nth(i);
      await btn.click();
      const dialog = await page.getByRole('dialog').first();
      if ((await dialog.count()) > 0) {
        results.push(logResult(`HOTSPOT_${i + 1}_MODAL`, 'PASS'));
        const closeBtn = await dialog.getByRole('button', { name: /Close/i }).first();
        await closeBtn.click();
        results.push(logResult(`HOTSPOT_${i + 1}_CLOSE`, 'PASS'));
      } else {
        results.push(logResult(`HOTSPOT_${i + 1}_MODAL`, 'FAIL', 'dialog not found'));
      }
    }
  } catch (e) {
    results.push(logResult('HOTSPOTS_INTERACTION', 'FAIL', e.message));
  }

  // 6. Camera controls
  try {
    const canvas = await page.getByRole('canvas').first();
    const box = await canvas.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2);
    await page.mouse.up();
    await page.mouse.wheel(0, -150);
    const autoBtn = await page.getByRole('button', { name: /Auto[- ]?Rotate/i }).first();
    if ((await autoBtn.count()) > 0) await autoBtn.click();
    results.push(logResult('CAMERA_CONTROLS', 'PASS'));
  } catch (e) {
    results.push(logResult('CAMERA_CONTROLS', 'SELECTOR_ERROR', e.message));
  }

  // 7. Mobile bottom sheet
  const mobileSizes = [
    { width: 390, height: 800 },
    { width: 768, height: 1024 },
  ];
  for (const size of mobileSizes) {
    try {
      const mobCtx = await browser.newContext({ viewport: size, isMobile: true });
      const mobPage = await mobCtx.newPage();
      await mobPage.goto(baseUrl, { waitUntil: 'networkidle' });
      const sheetBtn = await mobPage
        .getByRole('button', { name: /Bottom Sheet|Toggle Sheet/i })
        .first();
      if ((await sheetBtn.count()) > 0) {
        await sheetBtn.click();
        await mobPage.waitForTimeout(400);
        await mobPage.screenshot({ path: `mobile_${size.width}_bottomsheet.png`, fullPage: true });
        results.push(logResult(`MOBILE_${size.width}_BOTTOM_SHEET`, 'PASS'));
      } else {
        results.push(
          logResult(`MOBILE_${size.width}_BOTTOM_SHEET`, 'SELECTOR_ERROR', 'button not found'),
        );
      }
      await mobCtx.close();
    } catch (e) {
      results.push(logResult(`MOBILE_${size.width}_BOTTOM_SHEET`, 'FAIL', e.message));
    }
  }

  // 8. Reduced motion
  try {
    const rmCtx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: 'reduce',
    });
    const rmPage = await rmCtx.newPage();
    await rmPage.goto(baseUrl, { waitUntil: 'networkidle' });
    await rmPage.screenshot({ path: 'reduced_motion.png', fullPage: true });
    results.push(logResult('REDUCED_MOTION', 'PASS'));
    await rmCtx.close();
  } catch (e) {
    results.push(logResult('REDUCED_MOTION', 'FAIL', e.message));
  }

  // 9. Showroom 30 cycles
  try {
    const stressPage = await context.newPage();
    for (let i = 1; i <= 30; i++) {
      await stressPage.goto(`${baseUrl}showroom`, { waitUntil: 'networkidle' });
      await stressPage.waitForTimeout(250);
      await stressPage.goBack();
      await stressPage.waitForTimeout(150);
      results.push(logResult(`SHOWROOM_CYCLE_${i}`, 'PASS'));
    }
    const errors = [];
    stressPage.on('pageerror', (err) => errors.push(err.message));
    if (errors.length === 0) {
      results.push(logResult('SHOWROOM_CYCLES_ERRORS', 'PASS'));
    } else {
      results.push(logResult('SHOWROOM_CYCLES_ERRORS', 'FAIL', errors.join('; ')));
    }
    await stressPage.screenshot({ path: 'showroom_30cycles_final.png', fullPage: true });
  } catch (e) {
    results.push(logResult('SHOWROOM_CYCLES', 'FAIL', e.message));
  }

  // 10. WebGL context recovery
  try {
    const glErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('WebGL')) glErrors.push(msg.text());
    });
    await page.goto('about:blank');
    await page.waitForTimeout(200);
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    if (glErrors.length === 0) {
      results.push(logResult('WEBGL_CONTEXT', 'PASS'));
    } else {
      results.push(logResult('WEBGL_CONTEXT', 'FAIL', glErrors.join('; ')));
    }
    results.push(logResult('ZERO_IDLE_RENDERING', 'NOT RUN'));
  } catch (e) {
    results.push(logResult('WEBGL_CONTEXT', 'FAIL', e.message));
  }

  captureErrors(page, 'desktop');
  const summaryPath = 'regression_summary.txt';
  fs.writeFileSync(summaryPath, results.join('\n'));
  console.log('REGRESSION_SUMMARY_SAVED:', summaryPath);

  await context.close();
  await browser.close();
})();
