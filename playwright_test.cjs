// playwright_test.cjs
// Full regression script for LOCAL PREVIEW (http://localhost:4173)
// Captures screenshots, console & network errors, mobile viewports, and Showroom stress test.
const { chromium } = require('playwright-core');
const fs = require('fs');

(async () => {
  const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: false,
    args: ['--no-sandbox'],
  });

  // Helper to capture console & network failures
  const captureLogs = async (page, prefix) => {
    const logs = [];
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      logs.push(`[${type}] ${text}`);
    });
    page.on('pageerror', (err) => logs.push(`[PAGEERROR] ${err.message}`));
    page.on('requestfailed', (request) => {
      logs.push(`[REQFAIL] ${request.url()} - ${request.failure().errorText}`);
    });
    const logPath = `${prefix}_logs.txt`;
    await page.waitForLoadState('networkidle');
    fs.writeFileSync(logPath, logs.join('\n'));
    console.log('LOGS_SAVED:', logPath);
  };

  // ---------- Desktop run (default 1280x800) ----------
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const desktopPage = await desktopContext.newPage();
  const baseUrl = 'http://localhost:4173/';
  await desktopPage.goto(baseUrl, { waitUntil: 'networkidle' });
  console.log('DESKTOP PAGE_TITLE:', await desktopPage.title());
  await desktopPage.screenshot({ path: 'desktop_homepage.png', fullPage: true });
  console.log('SCREENSHOT_SAVED: desktop_homepage.png');
  await captureLogs(desktopPage, 'desktop');

  // ---------- Verify Home & Start Lights ----------
  // Assuming start lights are rendered on the home page; we just check their presence via selector.
  const startLights = await desktopPage.$('[data-testid="start-lights"]');
  if (startLights) {
    console.log('START_LIGHTS_FOUND: true');
  } else {
    console.warn('START_LIGHTS_FOUND: false');
  }

  // ---------- Season selector (2025/2026) ----------
  // Click season dropdown and verify option exists.
  const seasonToggle = await desktopPage.$('button[data-testid="season-toggle"]');
  if (seasonToggle) {
    await seasonToggle.click();
    const option = await desktopPage.$('text=2025/2026');
    console.log('SEASON_2025_2026_FOUND:', !!option);
    await desktopPage.screenshot({ path: 'desktop_season_2025_2026.png', fullPage: true });
  }

  // ---------- Teams & Drivers pages ----------
  const navTeams = await desktopPage.$('a[href*="/teams"]');
  if (navTeams) {
    await navTeams.click();
    await desktopPage.waitForLoadState('networkidle');
    await desktopPage.screenshot({ path: 'desktop_teams.png', fullPage: true });
    console.log('SCREENSHOT_SAVED: desktop_teams.png');
  }
  const navDrivers = await desktopPage.$('a[href*="/drivers"]');
  if (navDrivers) {
    await navDrivers.click();
    await desktopPage.waitForLoadState('networkidle');
    await desktopPage.screenshot({ path: 'desktop_drivers.png', fullPage: true });
    console.log('SCREENSHOT_SAVED: desktop_drivers.png');
  }

  // ---------- Showroom liveries & hotspots ----------
  const navShowroom = await desktopPage.$('a[href*="/showroom"]');
  if (navShowroom) {
    await navShowroom.click();
    await desktopPage.waitForLoadState('networkidle');
    await desktopPage.screenshot({ path: 'desktop_showroom_initial.png', fullPage: true });
    console.log('SCREENSHOT_SAVED: desktop_showroom_initial.png');

    // Verify 11 liveries via selector count (e.g., .livery-tab)
    const liveries = await desktopPage.$$('[data-testid="livery-tab"]');
    console.log('SHOWROOM_LIVERIES_COUNT:', liveries.length);

    // Verify 7 hotspots via selector count (e.g., .hotspot)
    const hotspots = await desktopPage.$$('[data-testid="hotspot"]');
    console.log('SHOWROOM_HOTSPOTS_COUNT:', hotspots.length);
  }

  // ---------- Camera controls (orbit, zoom, auto-rotate) ----------
  // Simulate some interactions on the canvas.
  const canvas = await desktopPage.$('canvas');
  if (canvas) {
    const box = await canvas.boundingBox();
    // Orbit: drag mouse
    await desktopPage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await desktopPage.mouse.down();
    await desktopPage.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2);
    await desktopPage.mouse.up();
    // Zoom: scroll
    await desktopPage.mouse.wheel(0, -200);
    // Auto‑rotate toggle (assume button exists)
    const autoRotateBtn = await desktopPage.$('[data-testid="auto-rotate-toggle"]');
    if (autoRotateBtn) await autoRotateBtn.click();
    console.log('CAMERA_INTERACTIONS_DONE');
    await desktopPage.screenshot({ path: 'desktop_showroom_camera.png', fullPage: true });
  }

  // ---------- Mobile bottom sheet (390px & 768px) ----------
  const mobileSizes = [
    { width: 390, height: 800 },
    { width: 768, height: 1024 },
  ];
  for (const size of mobileSizes) {
    const mobileContext = await browser.newContext({ viewport: size, isMobile: true });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(baseUrl, { waitUntil: 'networkidle' });
    // Open bottom sheet via known button (e.g., data-testid="bottom-sheet-toggle")
    const sheetBtn = await mobilePage.$('[data-testid="bottom-sheet-toggle"]');
    if (sheetBtn) await sheetBtn.click();
    await mobilePage.waitForTimeout(500); // allow animation
    await mobilePage.screenshot({ path: `mobile_${size.width}_bottomsheet.png`, fullPage: true });
    console.log('SCREENSHOT_SAVED: mobile_${size.width}_bottomsheet.png');
    await mobileContext.close();
  }

  // ---------- Reduced motion (prefers-reduced-motion media query) ----------
  const reducedContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseUrl, { waitUntil: 'networkidle' });
  await reducedPage.screenshot({ path: 'reduced_motion.png', fullPage: true });
  console.log('SCREENSHOT_SAVED: reduced_motion.png');
  await reducedContext.close();

  // ---------- Showroom stress test: 30 enter/exit cycles ----------
  const stressPage = await desktopContext.newPage();
  for (let i = 1; i <= 30; i++) {
    await stressPage.goto(baseUrl + 'showroom', { waitUntil: 'networkidle' });
    await stressPage.waitForTimeout(300); // short settle
    await stressPage.goBack();
    await stressPage.waitForTimeout(200);
    console.log(`SHOWROOM_CYCLE_${i}_DONE`);
  }
  await stressPage.screenshot({ path: 'showroom_30cycles_final.png', fullPage: true });
  console.log('SCREENSHOT_SAVED: showroom_30cycles_final.png');

  // Capture any console errors that may have appeared during cycles
  await captureLogs(stressPage, 'showroom_cycles');

  // Close all contexts & browser
  await desktopContext.close();
  await browser.close();
})();
