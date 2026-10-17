
import { chromium } from 'playwright-core';
import * as fs from 'fs';
import * as path from 'path';

const CHANNEL = 'chrome';
const BASELINE_URL = 'http://127.0.0.1:5173/showroom';
const WORKER_URL = 'http://127.0.0.1:5174/showroom';
const OUT_DIR = path.resolve('bench-results-mobile');
const RUNS_PER_VARIANT = 5;
const NAV_TIMEOUT = 60000;
const CPU_THROTTLE_RATE = 4;
const MOBILE_VIEWPORT = { width: 412, height: 823, deviceScaleFactor: 1.75 };
const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36';

function median(v) {
  const s = [...v].sort((a, b) => a - b);
  const n = s.length;
  if (n === 0) return 0;
  return n % 2 ? s[Math.floor(n / 2)] : (s[n / 2 - 1] + s[n / 2]) / 2;
}
function pct(v, p) {
  const s = [...v].sort((a, b) => a - b);
  if (s.length === 0) return 0;
  const r = (p / 100) * (s.length - 1);
  const lo = Math.floor(r), hi = Math.ceil(r), f = r - lo;
  return s[lo] + (s[hi] - s[lo]) * f;
}
function stats(v) {
  return {
    count: v.length,
    min: Math.min(...v),
    max: Math.max(...v),
    median: median(v),
    mean: v.reduce((a, b) => a + b, 0) / v.length,
    p90: pct(v, 90),
  };
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function tbtProxy(longTasks) {
  return longTasks.reduce((sum, t) => sum + Math.max(0, t.duration - 50), 0);
}

async function runOne(browser, variant, profile, runIndex) {
  const url = variant === 'baseline' ? BASELINE_URL : WORKER_URL;
  console.log(`run ${runIndex + 1}/${RUNS_PER_VARIANT} ${variant.toUpperCase()} mobile -> ${url}`);

  const context = await browser.newContext({
    viewport: MOBILE_VIEWPORT,
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: MOBILE_VIEWPORT.deviceScaleFactor,
    userAgent: MOBILE_UA,
    locale: 'en-US',
    timezoneId: 'Asia/Ho_Chi_Minh',
  });
  const page = await context.newPage();

  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_THROTTLE_RATE });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });

  let firstUsableMs = null;
  try {
    await page.waitForFunction(
      () => performance.getEntriesByName('showroom:first-usable-frame').length > 0,
      { timeout: 40000 },
    );
    const val = await page.evaluate(() => performance.getEntriesByName('showroom:first-usable-frame')[0].startTime);
    firstUsableMs = val;
  } catch {}

  await sleep(1500);

  const app = await page.evaluate(() => {
    const fcf = performance.getEntriesByName('showroom:first-complete-submitted-frame')[0];
    const compile = performance.getEntriesByName('showroom:compile')[0];
    const mem = performance.memory;
    return {
      firstUsableFrame: performance.getEntriesByName('showroom:first-usable-frame')[0]?.startTime,
      firstCompleteFrame: fcf ? fcf.startTime : null,
      compileDuration: compile ? compile.duration : null,
      compileStart: compile ? compile.startTime : null,
      longTasks: window.__bench ? window.__bench.longTasks : [],
      lcp: window.__bench ? window.__bench.lcp : null,
      fcp: window.__bench ? window.__bench.fcp : null,
      errors: window.__bench ? window.__bench.errors : [],
      workerCreated: window.__bench ? window.__bench.workerCreated : null,
      workerScript: window.__bench ? window.__bench.workerScript : null,
      workerPatched: window.__bench ? window.__bench.workerPatched : null,
      workerPatchError: window.__bench ? window.__bench.workerPatchError : null,
      jsHeapUsedSize: mem ? mem.usedJSHeapSize : null,
      navStart: performance.timeOrigin,
    };
  });

  const longTasks = app.longTasks || [];
  const tbtMs = tbtProxy(longTasks);

  const result = {
    variant,
    profile: 'mobile-throttled-4x',
    runIndex,
    firstUsableFrameMs: firstUsableMs ?? app.firstUsableFrame,
    firstCompleteFrameMs: app.firstCompleteFrame,
    compileMs: app.compileDuration,
    compileStartMs: app.compileStart,
    lcpMs: app.lcp,
    fcpMs: app.fcp,
    tbtMs,
    longTaskCount: longTasks.length,
    longTasks,
    consoleErrorCount: app.errors.length,
    consoleErrors: app.errors,
    workerCreated: Boolean(app.workerCreated),
    workerScript: app.workerScript || null,
    workerPatched: Boolean(app.workerPatched),
    workerPatchError: app.workerPatchError || null,
    jsHeapUsedSize: app.jsHeapUsedSize,
    navDurationMs: Date.now() - app.navStart,
  };

  await context.close();
  return result;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const results = [];

  const browser = await chromium.launch({
    channel: CHANNEL,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  console.log('Browser:', await browser.version());
  console.log('CPU throttling rate:', CPU_THROTTLE_RATE, '(4x slowdown)');
  console.log('Viewport:', JSON.stringify(MOBILE_VIEWPORT));

  const runList = [];
  for (let i = 0; i < RUNS_PER_VARIANT; i += 1) {
    runList.push({ variant: 'baseline' });
    runList.push({ variant: 'worker' });
  }

  for (let i = 0; i < runList.length; i += 1) {
    const { variant } = runList[i];
    console.log(`
[${i + 1}/${runList.length}] ${variant.toUpperCase()} mobile-throttled`);
    try {
      const r = await runOne(browser, variant, null, i);
      results.push(r);
      console.log(`    fuf=${r.firstUsableFrameMs} compile=${r.compileMs} tbt=${r.tbtMs} lt=${r.longTaskCount} workerCreated=${r.workerCreated} workerPatched=${r.workerPatched} err=${r.consoleErrorCount} workerScript=${r.workerScript}`);
    } catch (e) {
      console.log(`    [ERROR] ${e.message}`);
      results.push({ variant, profile: 'mobile-throttled-4x', runIndex: i, error: e.message, failed: true });
    }
    await sleep(1000);
  }

  await browser.close();

  const rawPath = path.join(OUT_DIR, 'raw-results.json');
  fs.writeFileSync(rawPath, JSON.stringify({ results, timestamp: new Date().toISOString() }, null, 2));
  console.log(`
Raw results -> ${rawPath}`);

  const summary = {};
  for (const variant of ['baseline', 'worker']) {
    const vals = results.filter((r) => !r.failed && r.variant === variant);
    summary[variant] = {
      runs: vals.length,
      firstUsableFrame: stats(vals.map((r) => r.firstUsableFrameMs).filter((v) => v != null)),
      compileMs: stats(vals.map((r) => r.compileMs).filter((v) => v != null)),
      tbtMs: stats(vals.map((r) => r.tbtMs).filter((v) => v != null)),
      lcpMs: stats(vals.map((r) => r.lcpMs).filter((v) => v != null)),
      fcpMs: stats(vals.map((r) => r.fcpMs).filter((v) => v != null)),
      longTaskCount: stats(vals.map((r) => r.longTaskCount)),
      consoleErrorCount: stats(vals.map((r) => r.consoleErrorCount)),
      workerCreated: vals.filter((r) => r.workerCreated).length,
      workerPatched: vals.filter((r) => r.workerPatched).length,
      jsHeapUsedSize: stats(vals.map((r) => r.jsHeapUsedSize).filter((v) => v != null)),
    };
  }

  const summaryPath = path.join(OUT_DIR, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({ summary, timestamp: new Date().toISOString() }, null, 2));
  console.log(`Summary -> ${summaryPath}`);

  console.log(`
=== MEDIAN SUMMARY (mobile, 4x CPU throttled) ===`);
  console.log(`${'Variant'.padEnd(10)} ${'Runs'.padEnd(6)} ${'FirstUsable'.padEnd(14)} ${'Compile'.padEnd(10)} ${'TBT'.padEnd(10)} ${'LongTasks'.padEnd(12)} ${'WorkerCreated'.padEnd(14)} ${'WorkerPatched'.padEnd(14)} ${'Heap'.padEnd(12)} ${'Err'.padEnd(6)}`);
  for (const variant of ['baseline', 'worker']) {
    const s = summary[variant];
    console.log(
      `${variant.padEnd(10)} ${String(s.runs).padEnd(6)} ` +
      `${(s.firstUsableFrame.median || 0).toFixed(0).padEnd(14)} ` +
      `${(s.compileMs.median || 0).toFixed(0).padEnd(10)} ` +
      `${(s.tbtMs.median || 0).toFixed(0).padEnd(10)} ` +
      `${s.longTaskCount.median.toFixed(0).padEnd(12)} ` +
      `${s.workerCreated.toString().padEnd(14)} ` +
      `${s.workerPatched.toString().padEnd(14)} ` +
      `${(s.jsHeapUsedSize.median || 0).toFixed(0).padEnd(12)} ` +
      `${s.consoleErrorCount.median.toFixed(0).padEnd(6)}`
    );
  }

  console.log(`
=== DELTA (worker - baseline) ===`);
  const b = summary.baseline;
  const w = summary.worker;
  if (b && w) {
    const dFuf = (w.firstUsableFrame.median || 0) - (b.firstUsableFrame.median || 0);
    const dCompile = (w.compileMs.median || 0) - (b.compileMs.median || 0);
    const dTbt = (w.tbtMs.median || 0) - (b.tbtMs.median || 0);
    const dHeap = (w.jsHeapUsedSize.median || 0) - (b.jsHeapUsedSize.median || 0);
    console.log(`firstUsableFrame Δ=${dFuf.toFixed(0)} ms`);
    console.log(`compile Δ=${dCompile.toFixed(0)} ms`);
    console.log(`TBT proxy Δ=${dTbt.toFixed(0)} ms`);
    console.log(`heap Δ=${(dHeap / 1048576).toFixed(2)} MB`);
  }
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
