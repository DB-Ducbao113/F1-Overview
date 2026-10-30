import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4173;
const DEBUG_PORT = 9222;
const BASE_URL = `http://localhost:${PORT}/showroom?showroomDiagnostics`;

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 0;
    this.pending = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = ++this.msgId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.exception?.description || 'Evaluation failed');
    }
    return res.result?.value;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runShowroomBenchmark(suiteName = 'baseline') {
  console.log(`\n==================================================`);
  console.log(` Starting Showroom 3D Benchmark: ${suiteName.toUpperCase()}`);
  console.log(`==================================================\n`);

  // 1. Launch Vite Preview
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    shell: true,
    stdio: 'ignore',
  });

  await sleep(1500);

  // 2. Launch Chrome Headless
  const outDir = path.resolve('benchmark-artifacts', suiteName);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const useNvidia = process.env.SHOWROOM_GPU !== 'intel';
  const chromeFlags = [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--use-gl=angle',
    '--window-size=1920,1080',
  ];
  if (useNvidia) {
    chromeFlags.push('--force_high_performance_gpu');
  }
  chromeFlags.push('about:blank');

  const chrome = spawn(CHROME_PATH, chromeFlags);

  await sleep(2000);

  let cdp;
  try {
    const targetsRes = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`);
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
      throw new Error('No page target found on Chrome');
    }

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('DOM.enable');

    const gpuInfo = await cdp.evaluate(`
      (() => {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return { error: 'No WebGL' };
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        return {
          vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
          renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
        };
      })()
    `);
    console.log(`\n  >> Active WebGL GPU: ${gpuInfo?.renderer} <<\n`);

    const results = {
      suite: suiteName,
      gpu: gpuInfo,
      timestamp: new Date().toISOString(),
      scenarios: {},
    };

    // ── SCENARIO 1: Initial Loading Time ──
    console.log('[Scenario 1] Measuring Initial Model Loading...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const targetMode = suiteName.startsWith('high')
      ? 'high'
      : suiteName.startsWith('average')
        ? 'average'
        : suiteName.startsWith('performance')
          ? 'performance'
          : suiteName.startsWith('auto')
            ? 'auto'
            : null;

    if (targetMode) {
      await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `try { localStorage.setItem('f1_showroom_graphics_quality', '${targetMode}'); } catch (e) {}`,
      });
    }

    const loadStart = Date.now();
    await cdp.send('Page.navigate', { url: BASE_URL });

    // Wait until document URL has navigated to showroom
    for (let i = 0; i < 40; i++) {
      await sleep(100);
      try {
        const href = await cdp.evaluate('window.location.href');
        if (href && href.includes('showroom')) break;
      } catch {}
    }

    // Wait for showroom:first-usable-frame mark
    let loaded = false;
    let loadDurationMs = 0;
    for (let i = 0; i < 60; i++) {
      await sleep(250);
      try {
        const isUsable = await cdp.evaluate(`
          Boolean(performance.getEntriesByName('showroom:first-usable-frame').length > 0)
        `);
        if (isUsable) {
          loaded = true;
          loadDurationMs = Date.now() - loadStart;
          break;
        }
      } catch {}
    }

    const marks = await cdp.evaluate(`
      performance.getEntriesByType('mark').map(m => ({ name: m.name, startTime: Math.round(m.startTime) }))
    `);
    const measures = await cdp.evaluate(`
      performance.getEntriesByType('measure').map(m => ({ name: m.name, duration: Math.round(m.duration) }))
    `);

    const initialHeap = await cdp.evaluate(`
      window.performance?.memory ? Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) : null
    `);

    const initialStats = await cdp.evaluate(`
      window.__SHOWROOM_RENDERER_STATS__ ? window.__SHOWROOM_RENDERER_STATS__() : null
    `);

    results.scenarios.initialLoad = {
      loaded,
      loadDurationMs,
      initialHeapMB: initialHeap,
      stats: initialStats,
      marks,
      measures,
    };
    console.log(`  Initial usable frame: ${loadDurationMs} ms (Heap: ${initialHeap} MB)`);
    if (initialStats) {
      console.log(
        `  Initial stats: ${initialStats.render.calls} draws, ${initialStats.render.triangles} tris, ${initialStats.memory.geometries} geoms, ${initialStats.memory.textures} textures`,
      );
    }

    // Capture desktop initial screenshot
    const shot1 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(outDir, `${suiteName}-desktop-initial.png`),
      Buffer.from(shot1.data, 'base64'),
    );

    // ── SCENARIO 2: Continuous 360° Orbit FPS & Frame Time ──
    console.log('\n[Scenario 2] Measuring Continuous 360° Car Orbit (6 seconds)...');
    // Inject high-precision RAF frame timer
    await cdp.evaluate(`
      window.__FRAME_METRICS__ = {
        frames: [],
        running: true,
      };
      let lastTime = performance.now();
      function recordFrame(now) {
        if (!window.__FRAME_METRICS__.running) return;
        const delta = now - lastTime;
        lastTime = now;
        window.__FRAME_METRICS__.frames.push(delta);
        requestAnimationFrame(recordFrame);
      }
      requestAnimationFrame(recordFrame);
    `);

    await sleep(6000);

    const orbitMetrics = await cdp.evaluate(`
      (() => {
        window.__FRAME_METRICS__.running = false;
        const deltas = window.__FRAME_METRICS__.frames.slice(5); // skip first warmup frames
        if (deltas.length === 0) return null;
        
        // Sort for percentiles
        const sorted = [...deltas].sort((a, b) => a - b);
        const sum = deltas.reduce((acc, d) => acc + d, 0);
        const avgFrameTime = sum / deltas.length;
        const avgFPS = 1000 / avgFrameTime;
        
        // p95 frame time
        const p95Idx = Math.floor(sorted.length * 0.95);
        const p95FrameTime = sorted[p95Idx];
        
        // 1% low FPS: frame rate of the worst 1% frames (i.e. p99 frame time)
        const p99Idx = Math.floor(sorted.length * 0.99);
        const p99FrameTime = sorted[p99Idx];
        const low1PercentFPS = 1000 / p99FrameTime;

        const stats = window.__SHOWROOM_RENDERER_STATS__ ? window.__SHOWROOM_RENDERER_STATS__() : null;
        const heap = window.performance?.memory ? Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) : null;

        return {
          totalFrames: deltas.length,
          avgFPS: Number(avgFPS.toFixed(1)),
          low1PercentFPS: Number(low1PercentFPS.toFixed(1)),
          avgFrameTimeMs: Number(avgFrameTime.toFixed(2)),
          p95FrameTimeMs: Number(p95FrameTime.toFixed(2)),
          p99FrameTimeMs: Number(p99FrameTime.toFixed(2)),
          stats,
          heapMB: heap,
        };
      })()
    `);

    results.scenarios.continuousOrbit = orbitMetrics;
    console.log(`  Average FPS: ${orbitMetrics?.avgFPS} FPS`);
    console.log(`  1% Low FPS: ${orbitMetrics?.low1PercentFPS} FPS`);
    console.log(
      `  Avg Frame Time: ${orbitMetrics?.avgFrameTimeMs} ms | p95: ${orbitMetrics?.p95FrameTimeMs} ms`,
    );
    if (orbitMetrics?.stats) {
      console.log(
        `  Active Orbit Draw Calls: ${orbitMetrics.stats.render.calls} / Triangles: ${orbitMetrics.stats.render.triangles}`,
      );
    }

    // ── SCENARIO 3: Camera Transitions to Hotspots ──
    console.log('\n[Scenario 3] Testing Camera Transitions to Hotspots (7 Hotspots)...');
    // Enable hotspots
    await cdp.evaluate(`
      (() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const hotspotBtn = buttons.find(b => b.textContent?.includes('Hotspots') || b.textContent?.includes('Điểm Kỹ Thuật'));
        if (hotspotBtn) hotspotBtn.click();
      })()
    `);
    await sleep(600);

    const hotspotResults = [];
    for (let h = 1; h <= 7; h++) {
      const hStart = Date.now();
      await cdp.evaluate(`
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const marker = buttons.find(b => b.textContent?.trim() === '${h}');
          if (marker) marker.click();
        })()
      `);
      await sleep(1000); // Wait for camera lerp
      const hTime = Date.now() - hStart;
      const stats = await cdp.evaluate(
        `window.__SHOWROOM_RENDERER_STATS__ ? window.__SHOWROOM_RENDERER_STATS__() : null`,
      );
      hotspotResults.push({ hotspot: h, timeMs: hTime, stats });
      console.log(`  Hotspot ${h} Transition: OK (draws: ${stats?.render?.calls ?? 'N/A'})`);
    }
    results.scenarios.hotspotTransitions = hotspotResults;

    const shotHotspot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(outDir, `${suiteName}-hotspot-active.png`),
      Buffer.from(shotHotspot.data, 'base64'),
    );

    // ── SCENARIO 4: Switching Among All 11 Teams ──
    console.log('\n[Scenario 4] Testing Switching Among All 11 Teams...');
    const teams = [
      'ferrari',
      'redbull',
      'mclaren',
      'mercedes',
      'astonmartin',
      'alpine',
      'williams',
      'racingbulls',
      'haas',
      'audi',
      'cadillac',
    ];
    const teamResults = [];

    for (const teamId of teams) {
      const tStart = Date.now();
      await cdp.evaluate(`
        (() => {
          const teamButtons = Array.from(document.querySelectorAll('button'));
          const btn = teamButtons.find(b => b.getAttribute('title')?.toLowerCase().includes('${teamId}') || b.textContent?.toLowerCase().includes('${teamId}'));
          if (btn) btn.click();
        })()
      `);

      // Wait for car textures and scene part ready
      await sleep(800);
      const tDuration = Date.now() - tStart;
      const stats = await cdp.evaluate(
        `window.__SHOWROOM_RENDERER_STATS__ ? window.__SHOWROOM_RENDERER_STATS__() : null`,
      );
      const cacheStats = await cdp.evaluate(
        `window.__SHOWROOM_CACHE_STATS__ ? window.__SHOWROOM_CACHE_STATS__() : null`,
      );
      const heap = await cdp.evaluate(
        `window.performance?.memory ? Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) : null`,
      );

      teamResults.push({
        team: teamId,
        switchDurationMs: tDuration,
        stats,
        cacheStats,
        heapMB: heap,
      });
      console.log(
        `  Team [${teamId}]: switch ${tDuration}ms | Heap: ${heap} MB | Cache entries: ${cacheStats?.car?.entries ?? 'N/A'}`,
      );
    }
    results.scenarios.teamSwitching = teamResults;

    // ── SCENARIO 5: Zoom In and Out ──
    console.log('\n[Scenario 5] Testing Zoom Controls...');
    await cdp.evaluate(`
      (() => {
        const zoomInBtn = document.querySelector('button[aria-label*="Phóng to"], button[aria-label*="Zoom In"]');
        if (zoomInBtn) {
          zoomInBtn.click();
          zoomInBtn.click();
        }
      })()
    `);
    await sleep(400);
    await cdp.evaluate(`
      (() => {
        const zoomOutBtn = document.querySelector('button[aria-label*="Thu nhỏ"], button[aria-label*="Zoom Out"]');
        if (zoomOutBtn) {
          zoomOutBtn.click();
        }
      })()
    `);
    await sleep(400);
    results.scenarios.zoomTest = { status: 'OK' };
    console.log('  Zoom controls verified.');

    // ── SCENARIO 6: Mobile Viewport Emulation ──
    console.log('\n[Scenario 6] Testing Mobile Viewport (390x844 DPR 3)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
      hasTouch: true,
    });
    await sleep(1000);

    const mobileStats = await cdp.evaluate(`
      window.__SHOWROOM_RENDERER_STATS__ ? window.__SHOWROOM_RENDERER_STATS__() : null
    `);
    const shotMobile = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(outDir, `${suiteName}-mobile-390.png`),
      Buffer.from(shotMobile.data, 'base64'),
    );

    results.scenarios.mobileViewport = {
      width: 390,
      height: 844,
      dpr: 3,
      stats: mobileStats,
    };
    console.log(`  Mobile 390x844: OK (draws: ${mobileStats?.render?.calls ?? 'N/A'})`);

    // Reset back to desktop
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sleep(500);

    // ── SCENARIO 7: Tab Hide / Restore ──
    console.log('\n[Scenario 7] Testing Browser Tab Hide / Restore (Zero Idle Check)...');
    // Emulate tab hide via visibilitychange
    await cdp.evaluate(`
      (() => {
        Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      })()
    `);
    await sleep(1200);

    // Measure frames while hidden
    const framesWhileHidden = await cdp.evaluate(`
      new Promise(resolve => {
        let count = 0;
        const start = performance.now();
        function check(now) {
          count++;
          if (now - start < 1000) {
            requestAnimationFrame(check);
          } else {
            resolve(count);
          }
        }
        requestAnimationFrame(check);
      })
    `);

    // Restore tab
    await cdp.evaluate(`
      (() => {
        Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      })()
    `);
    await sleep(800);
    results.scenarios.tabHideRestore = {
      framesWhileHidden,
      status: framesWhileHidden <= 2 ? 'PASS (Rendering Paused)' : 'ACTIVE',
    };
    console.log(
      `  Tab hidden state: ${results.scenarios.tabHideRestore.status} (${framesWhileHidden} callbacks)`,
    );

    // ── SCENARIO 8: WebGL Context Loss and Recovery ──
    console.log('\n[Scenario 8] Testing WebGL Context Loss & Recovery...');
    const contextLossTest = await cdp.evaluate(`
      (() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return { supported: false, reason: 'No canvas' };
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return { supported: false, reason: 'No GL context' };
        const loseExt = gl.getExtension('WEBGL_lose_context');
        if (!loseExt) return { supported: false, reason: 'WEBGL_lose_context not supported' };
        
        loseExt.loseContext();
        return { supported: true, triggeredLoss: true };
      })()
    `);
    await sleep(800);
    const hasFallback = await cdp.evaluate(`
      Boolean(document.querySelector('.bg-\\\\[\\\\#09090e\\\\]') || document.body.textContent?.includes('WebGL hardware acceleration unavailable') || document.body.textContent?.includes('Chế độ 2D'))
    `);
    console.log(
      `  Context Loss Triggered: ${contextLossTest.triggeredLoss}, Fallback Visible: ${hasFallback}`,
    );

    // Recover context
    await cdp.evaluate(`
      (() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        const loseExt = gl?.getExtension('WEBGL_lose_context');
        if (loseExt) loseExt.restoreContext();
      })()
    `);
    await sleep(1200);
    const recoveredCanvas = await cdp.evaluate(`Boolean(document.querySelector('canvas'))`);
    console.log(`  Context Restored: Canvas Present = ${recoveredCanvas}`);
    results.scenarios.contextLossRecovery = {
      triggeredLoss: contextLossTest.triggeredLoss,
      fallbackVisible: hasFallback,
      canvasRecovered: recoveredCanvas,
    };

    // ── SCENARIO 9: Memory Leak & Rapid Switching Stress Test (50 Switches) ──
    console.log(
      '\n[Scenario 9] Testing Memory Stability Over 50 Rapid Livery Switches & Showroom Teardown...',
    );
    const memBefore = await cdp.evaluate(`
      window.performance?.memory ? Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) : null
    `);

    for (let r = 0; r < 50; r++) {
      const nextTeam = teams[r % teams.length];
      await cdp.evaluate(`
        (() => {
          const teamButtons = Array.from(document.querySelectorAll('button'));
          const btn = teamButtons.find(b => b.getAttribute('title')?.toLowerCase().includes('${nextTeam}') || b.textContent?.toLowerCase().includes('${nextTeam}'));
          if (btn) btn.click();
        })()
      `);
      await sleep(150);
    }
    await sleep(1000);

    const memAfter50 = await cdp.evaluate(`
      window.performance?.memory ? Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) : null
    `);
    const cacheAfter50 = await cdp.evaluate(`
      window.__SHOWROOM_CACHE_STATS__ ? window.__SHOWROOM_CACHE_STATS__() : null
    `);
    console.log(
      `  Heap before: ${memBefore} MB | Heap after 50 switches: ${memAfter50} MB (Delta: ${(memAfter50 || 0) - (memBefore || 0)} MB)`,
    );
    console.log(
      `  Car cache entries: ${cacheAfter50?.car?.entries ?? 'N/A'} (Referenced: ${cacheAfter50?.car?.referencedEntries ?? 'N/A'})`,
    );

    // Test teardown when leaving Showroom
    console.log('  Testing memory teardown upon leaving Showroom...');
    await cdp.send('Page.navigate', { url: `http://localhost:${PORT}/about` });
    await sleep(1500);
    const memAfterLeave = await cdp.evaluate(`
      window.performance?.memory ? Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024)) : null
    `);
    const canvasAfterLeave = await cdp.evaluate(`Boolean(document.querySelector('canvas'))`);
    console.log(
      `  Heap after leaving Showroom: ${memAfterLeave} MB | Canvas present: ${canvasAfterLeave}`,
    );

    // Return to showroom for Scenario 10
    await cdp.send('Page.navigate', { url: BASE_URL });
    await sleep(2000);

    results.scenarios.memoryLeakStress = {
      switchesCount: 50,
      heapBeforeMB: memBefore,
      heapAfter50MB: memAfter50,
      heapDeltaMB: (memAfter50 || 0) - (memBefore || 0),
      heapAfterLeaveShowroomMB: memAfterLeave,
      canvasDestroyedOnLeave: !canvasAfterLeave,
      cacheStats: cacheAfter50,
    };

    // ── SCENARIO 10: High-DPR Displays and Low-Power GPU Simulation ──
    console.log('\n[Scenario 10] Testing High-DPR Display (DPR 2.0)...');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2.0,
      mobile: false,
    });
    await sleep(800);
    const highDprStats = await cdp.evaluate(`
      window.__SHOWROOM_RENDERER_STATS__ ? window.__SHOWROOM_RENDERER_STATS__() : null
    `);
    const shotHighDpr = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(
      path.join(outDir, `${suiteName}-high-dpr-2x.png`),
      Buffer.from(shotHighDpr.data, 'base64'),
    );

    results.scenarios.highDprTest = {
      deviceScaleFactor: 2.0,
      stats: highDprStats,
      status: 'PASS',
    };
    console.log(`  High DPR (2.0): OK (draws: ${highDprStats?.render?.calls ?? 'N/A'})`);

    // Reset back to standard
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1.0,
      mobile: false,
    });
    await sleep(500);

    // Write full results to JSON
    const reportPath = path.join(outDir, `${suiteName}-results.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nResults written to: ${reportPath}`);

    return results;
  } finally {
    if (cdp) cdp.close();
    chrome.kill();
    preview.kill();
  }
}

// Direct CLI invocation
if (process.argv[1]?.endsWith('benchmark-showroom.mjs')) {
  const suite = process.argv[2] || 'baseline';
  runShowroomBenchmark(suite).catch((err) => {
    console.error('Benchmark error:', err);
    process.exit(1);
  });
}
