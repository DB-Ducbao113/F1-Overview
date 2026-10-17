/**
 * M3D.3.2E — Playwright A/B Benchmark Harness
 *
 * Compares Showroom Worker OFF (baseline) vs Worker ON (experiment) using
 * system Chrome 155 via playwright-core (no Chromium download).
 *
 * Runs 20 cold runs: 5 baseline desktop, 5 Worker desktop, 5 baseline mobile,
 * 5 Worker mobile, alternated to reduce drift.
 *
 * All metrics are captured from the page's own Performance API
 * (PerformanceObserver) via page.evaluate — no reliance on Playwright's
 * internal CDP channel.
 *
 * Usage (PowerShell, from repo root, servers already started):
 *   $env:VITE_EXPERIMENTAL_WORKER_GLTF=""; npm run build
 *   Copy-Item dist dist-baseline -Recurse -Force
 *   $env:VITE_EXPERIMENTAL_WORKER_GLTF="true"; npm run build
 *   Copy-Item dist dist-worker -Recurse -Force
 *   $env:VITE_EXPERIMENTAL_WORKER_GLTF=""
 *   # Terminal 1: node scripts/static-server.mjs dist-baseline 5173
 *   # Terminal 2: node scripts/static-server.mjs dist-worker 5174
 *   node scripts/playwright-bench.mjs
 */

import { chromium } from 'playwright-core';
import * as fs from 'fs';
import * as path from 'path';

const CHANNEL = 'chrome'; // system-installed Chrome, no download
const BASELINE_URL = 'http://127.0.0.1:5173/showroom';
const WORKER_URL = 'http://127.0.0.1:5174/showroom';
const OUT_DIR = path.resolve('bench-results');
const RUNS_PER_VARIANT = 5;
const NAV_TIMEOUT = 45000;

// Init script: capture LCP, FCP, CLS, long tasks, errors — all via the page's
// own Performance API, stored on window.__bench for page.evaluate to read.
const INIT_SCRIPT = `
(() => {
  window.__bench = { lcp: null, fcp: null, cls: null, longTasks: [], errors: [] };
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      window.__bench.lcp = last ? last.startTime : null;
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.name === 'first-contentful-paint') window.__bench.fcp = e.startTime;
      }
    }).observe({ entryTypes: ['paint'] });
  } catch {}
  try {
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) clsValue += e.value;
      }
      window.__bench.cls = clsValue;
    }).observe({ entryTypes: ['layout-shift'] });
  } catch {}
  try {
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.entryType === 'longtask') {
          window.__bench.longTasks.push({
            startTime: e.startTime,
            duration: e.duration,
            name: e.name || '',
          });
        }
      }
    }).observe({ entryTypes: ['longtask'] });
  } catch {}
  window.addEventListener('error', (e) => {
    window.__bench.errors.push(e.message || String(e));
  });
  window.addEventListener('unhandledrejection', (e) => {
    window.__bench.errors.push(String(e.reason));
  });
})();
`;

const PROFILES = [
  {
    name: 'desktop',
    viewport: { width: 1350, height: 940, deviceScaleFactor: 1 },
    isMobile: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36',
    note: 'desktop (1x CPU, unthrottled network)',
  },
  {
    name: 'mobile',
    viewport: { width: 412, height: 823, deviceScaleFactor: 1.75 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36',
    note: 'mobile (viewport/UA only; CPU unthrottled — Playwright has no CPU throttle API)',
  },
];

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

// TBT proxy: sum of long-task durations exceeding 50ms (standard TBT definition).
function tbtProxy(longTasks) {
  return longTasks.reduce((sum, t) => sum + Math.max(0, t.duration - 50), 0);
}

async function runOne(browser, variant, profile, runIndex) {
  const url = variant === 'baseline' ? BASELINE_URL : WORKER_URL;
  console.log(`  [run ${runIndex + 1}/${RUNS_PER_VARIANT}] ${variant.toUpperCase()} ${profile.name} -> ${url}`);

  // Fresh context per run = cold cache + isolated storage.
  const context = await browser.newContext({
    viewport: profile.viewport,
    isMobile: profile.isMobile,
    hasTouch: profile.hasTouch,
    userAgent: profile.userAgent,
    locale: 'en-US',
    timezoneId: 'Asia/Ho_Chi_Minh',
  });
  const page = await context.newPage();

  let navStartMs = Date.now();
  let result = {
    variant, profile: profile.name, runIndex,
    firstUsableFrameMs: null, firstCompleteFrameMs: null, compileMs: null,
    lcpMs: null, fcpMs: null, cls: null, tbtMs: null,
    longTaskCount: 0, longTasks: [],
    consoleErrorCount: 0, consoleErrors: [],
    jsHeapUsedSize: null, navDurationMs: null,
    profileNote: profile.note,
  };

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });

    // Wait for the app's first-usable-frame mark (max ~4s expected).
    try {
      await page.waitForFunction(
        () => performance.getEntriesByName('showroom:first-usable-frame').length > 0,
        { timeout: 20000 },
      );
    } catch {
      // mark may not appear if scene never usable
    }

    // Settle so PerformanceObserver entries (LCP/FCP/CLS/long-tasks) are flushed.
    await sleep(1500);

    // Single combined evaluation reading all app telemetry.
    const app = await page.evaluate(() => {
      const fuf = performance.getEntriesByName('showroom:first-usable-frame')[0];
      const fcf = performance.getEntriesByName('showroom:first-complete-submitted-frame')[0];
      const compile = performance.getEntriesByName('showroom:compile')[0];
      const mem = performance.memory;
      return {
        firstUsableFrame: fuf ? fuf.startTime : null,
        firstCompleteFrame: fcf ? fcf.startTime : null,
        compileDuration: compile ? compile.duration : null,
        compileStart: compile ? compile.startTime : null,
        longTasks: window.__bench ? window.__bench.longTasks : [],
        lcp: window.__bench ? window.__bench.lcp : null,
        fcp: window.__bench ? window.__bench.fcp : null,
        cls: window.__bench ? window.__bench.cls : null,
        errors: window.__bench ? window.__bench.errors : [],
        jsHeapUsedSize: mem ? mem.usedJSHeapSize : null,
        navStart: performance.timeOrigin,
      };
    });

    result.firstUsableFrameMs = app.firstUsableFrame;
    result.firstCompleteFrameMs = app.firstCompleteFrame;
    result.compileMs = app.compileDuration;
    result.lcpMs = app.lcp;
    result.fcpMs = app.fcp;
    result.cls = app.cls;
    result.jsHeapUsedSize = app.jsHeapUsedSize;
    result.longTasks = app.longTasks;
    result.longTaskCount = app.longTasks.length;
    result.consoleErrors = app.errors;
    result.consoleErrorCount = app.errors.length;
    // TBT proxy from long tasks (durations > 50ms).
    result.tbtMs = tbtProxy(app.longTasks);
  } catch (e) {
    console.log(`    [warn] run error: ${e.message}`);
  } finally {
    await context.close();
  }

  result.navDurationMs = Date.now() - navStartMs;
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

  // Alternating run list: D-baseline, D-worker, M-baseline, M-worker × 5
  const runList = [];
  for (let i = 0; i < RUNS_PER_VARIANT; i += 1) {
    for (const profile of PROFILES) {
      runList.push({ variant: 'baseline', profile });
      runList.push({ variant: 'worker', profile });
    }
  }

  for (let i = 0; i < runList.length; i += 1) {
    const { variant, profile } = runList[i];
    console.log(`\n[${i + 1}/${runList.length}] ${variant.toUpperCase()} ${profile.name}`);
    try {
      const r = await runOne(browser, variant, profile, i);
      results.push(r);
      console.log(`    fuf=${r.firstUsableFrameMs} lcp=${r.lcpMs} fcp=${r.fcpMs} tbt=${r.tbtMs} lt=${r.longTaskCount} err=${r.consoleErrorCount}`);
    } catch (e) {
      console.log(`    [ERROR] ${e.message}`);
      results.push({ variant, profile: profile.name, runIndex: i, error: e.message, failed: true });
    }
    await sleep(1000);
  }

  await browser.close();

  // Write raw results.
  const rawPath = path.join(OUT_DIR, 'raw-results.json');
  fs.writeFileSync(rawPath, JSON.stringify({ results, timestamp: new Date().toISOString() }, null, 2));
  console.log(`\nRaw results -> ${rawPath}`);

  // Summary medians.
  const summary = {};
  for (const variant of ['baseline', 'worker']) {
    for (const profile of PROFILES) {
      const key = `${variant}-${profile.name}`;
      const vals = results.filter((r) => !r.failed && r.variant === variant && r.profile === profile.name);
      summary[key] = {
        runs: vals.length,
        firstUsableFrame: stats(vals.map((r) => r.firstUsableFrameMs).filter((v) => v != null)),
        firstCompleteFrame: stats(vals.map((r) => r.firstCompleteFrameMs).filter((v) => v != null)),
        compileMs: stats(vals.map((r) => r.compileMs).filter((v) => v != null)),
        lcp: stats(vals.map((r) => r.lcpMs).filter((v) => v != null)),
        fcp: stats(vals.map((r) => r.fcpMs).filter((v) => v != null)),
        cls: stats(vals.map((r) => r.cls).filter((v) => v != null)),
        tbt: stats(vals.map((r) => r.tbtMs).filter((v) => v != null)),
        jsHeap: stats(vals.map((r) => r.jsHeapUsedSize).filter((v) => v != null)),
        longTaskCount: stats(vals.map((r) => r.longTaskCount)),
        consoleErrorCount: stats(vals.map((r) => r.consoleErrorCount)),
      };
    }
  }

  const summaryPath = path.join(OUT_DIR, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({ summary, timestamp: new Date().toISOString() }, null, 2));
  console.log(`Summary -> ${summaryPath}`);

  console.log('\n=== MEDIAN SUMMARY ===');
  console.log(`${'Variant'.padEnd(10)} ${'Profile'.padEnd(10)} ${'Runs'.padEnd(6)} ${'FirstUsable'.padEnd(12)} ${'LCP'.padEnd(10)} ${'FCP'.padEnd(10)} ${'TBT'.padEnd(10)} ${'LongTasks'.padEnd(10)} ${'Compile'.padEnd(10)} ${'Heap'.padEnd(12)} ${'Err'.padEnd(6)}`);
  for (const [key, s] of Object.entries(summary)) {
    const [variant, profile] = key.split('-');
    console.log(
      `${variant.padEnd(10)} ${profile.padEnd(10)} ${String(s.runs).padEnd(6)} ` +
      `${(s.firstUsableFrame.median || 0).toFixed(0).padEnd(12)} ` +
      `${(s.lcp.median || 0).toFixed(0).padEnd(10)} ` +
      `${(s.fcp.median || 0).toFixed(0).padEnd(10)} ` +
      `${(s.tbt.median || 0).toFixed(0).padEnd(10)} ` +
      `${s.longTaskCount.median.toFixed(0).padEnd(10)} ` +
      `${(s.compileMs.median || 0).toFixed(0).padEnd(10)} ` +
      `${(s.jsHeap.median || 0).toFixed(0).padEnd(12)} ` +
      `${s.consoleErrorCount.median.toFixed(0).padEnd(6)}`
    );
  }

  console.log('\n=== DELTA (worker - baseline) ===');
  for (const profile of PROFILES) {
    const b = summary[`baseline-${profile.name}`];
    const w = summary[`worker-${profile.name}`];
    if (!b || !w) continue;
    const dFuf = (w.firstUsableFrame.median || 0) - (b.firstUsableFrame.median || 0);
    const dLcp = (w.lcp.median || 0) - (b.lcp.median || 0);
    const dTbt = (w.tbt.median || 0) - (b.tbt.median || 0);
    console.log(`${profile.name}: firstUsableFrame Δ=${dFuf.toFixed(0)}ms  LCP Δ=${dLcp.toFixed(0)}ms  TBT Δ=${dTbt.toFixed(0)}ms`);
  }
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
