// playwright_test.js
const { chromium } = require('playwright-core');
(async () => {
  const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: false,
    args: ['--no-sandbox'],
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const url = 'http://localhost:4173/';
  await page.goto(url, { waitUntil: 'networkidle' });
  console.log('PAGE_TITLE:', await page.title());
  await page.screenshot({ path: 'browser_homepage.png', fullPage: true });
  console.log('SCREENSHOT_SAVED: browser_homepage.png');
  await browser.close();
})();
