import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const chromePath =
  process.env.SHOWROOM_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const qaMode = process.env.SHOWROOM_QA_MODE === 'legacy' ? 'legacy' : 'eds';
const showroomUrl = process.env.SHOWROOM_QA_URL || 'http://127.0.0.1:5173/showroom';
const outputDirectory = path.resolve(
  process.env.SHOWROOM_QA_OUTPUT || 'docs/commercialization/m2/evidence',
);
const viewports = [
  { name: 'mobile-375x812', width: 375, height: 812, mobile: true },
  { name: 'tablet-768x1024', width: 768, height: 1024, mobile: false },
  { name: 'desktop-1440x900', width: 1440, height: 900, mobile: false },
];

await fs.mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: [
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-sync',
    '--enable-unsafe-swiftshader',
    '--js-flags=--expose-gc',
  ],
});
const context = await browser.newContext();
const page = await context.newPage();
const client = await context.newCDPSession(page);
console.log(`Chrome target: ${await page.title()} ${page.url()}`);

function send(method, params = {}) {
  return client.send(method, params);
}

function on(_sessionId, method, listener) {
  client.on(method, listener);
}

const sessionId = undefined;
await Promise.all([
  send('Page.enable', {}, sessionId),
  send('Runtime.enable', {}, sessionId),
  send('Network.enable', {}, sessionId),
  send('Performance.enable', {}, sessionId),
]);
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `globalThis.addEventListener('eds-renderer-stats', (event) => {
    globalThis.__edsRendererStats = event.detail;
  });`,
});

const consoleErrors = [];
const pageExceptions = [];
const failedRequests = [];
const requestUrls = new Map();
on(sessionId, 'Runtime.consoleAPICalled', (event) => {
  if (event.type === 'error') {
    consoleErrors.push(event.args.map((arg) => arg.value || arg.description || '').join(' '));
  }
});
on(sessionId, 'Runtime.exceptionThrown', (event) => {
  pageExceptions.push(event.exceptionDetails?.text || 'Unknown page exception');
});
on(sessionId, 'Network.requestWillBeSent', (event) => {
  requestUrls.set(event.requestId, event.request?.url || 'unknown URL');
});
on(sessionId, 'Network.loadingFailed', (event) => {
  if (!event.canceled)
    failedRequests.push(
      `${requestUrls.get(event.requestId) || 'unknown URL'}: ${event.errorText} (${event.type})`,
    );
});

const results = [];
try {
  for (const viewport of viewports) {
    await send(
      'Emulation.setDeviceMetricsOverride',
      {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
        screenWidth: viewport.width,
        screenHeight: viewport.height,
      },
      sessionId,
    );

    const loaded = new Promise((resolve) => on(sessionId, 'Page.loadEventFired', resolve));
    await send('Page.navigate', { url: showroomUrl }, sessionId);
    await Promise.race([loaded, new Promise((resolve) => setTimeout(resolve, 10_000))]);
    await new Promise((resolve) => setTimeout(resolve, 750));
    await send(
      'Runtime.evaluate',
      { expression: `document.querySelector('.podium-intro__skip')?.click()` },
      sessionId,
    );
    let ready = false;
    for (let attempt = 0; attempt < 30 && !ready; attempt += 1) {
      const readiness = await send(
        'Runtime.evaluate',
        {
          expression: `Boolean(document.querySelector('canvas') && (${JSON.stringify(qaMode)} === 'legacy' || document.querySelectorAll('[data-eds-livery]').length === 6))`,
          returnByValue: true,
        },
        sessionId,
      );
      ready = readiness.result.value;
      if (!ready) await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!ready) throw new Error(`Showroom did not become ready at ${viewport.name}.`);

    if (process.env.SHOWROOM_QA_SCROLL_STAGE === '1') {
      await send('Runtime.evaluate', {
        expression: `document.getElementById('showroom')?.scrollIntoView({ block: 'center' })`,
      });
      await new Promise((resolve) => setTimeout(resolve, 550));
    }

    await send(
      'Runtime.evaluate',
      {
        expression: `(() => {
          const buttons = [...document.querySelectorAll('button')];
          const cyber = document.querySelector('[data-eds-livery="eds-electric"]');
          if (cyber) cyber.click();
          const overview = buttons.find((button) => button.textContent?.includes('Toàn Cảnh'));
          if (overview) overview.click();
        })()`,
      },
      sessionId,
    );
    await new Promise((resolve) => setTimeout(resolve, 2_500));

    const evaluation = await send(
      'Runtime.evaluate',
      {
        expression: `(async () => {
          const liveryButtons = [...document.querySelectorAll('[data-eds-livery]')];
          const canvas = document.querySelector('canvas');
          const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
          const rendererInfo = gl ? {
            renderer: gl.getParameter(gl.RENDERER),
            vendor: gl.getParameter(gl.VENDOR),
            unmaskedRenderer: gl.getExtension('WEBGL_debug_renderer_info')
              ? gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL)
              : null,
          } : null;
          const rendererStats = canvas ? {
            devicePixelRatio: window.devicePixelRatio,
            cssWidth: canvas.clientWidth,
            cssHeight: canvas.clientHeight,
            bufferWidth: canvas.width,
            bufferHeight: canvas.height,
            ...(globalThis.__edsRendererStats || {}),
          } : null;
          const navigation = performance.getEntriesByType('navigation')[0];
          const modelResources = performance.getEntriesByType('resource').filter(
            (entry) => entry.name.includes('/eds-g01.glb') || entry.name.includes('/eds-g02.glb') || entry.name.includes('/c42.v2.glb'),
          );
          const requestedModel = new URL(location.href).searchParams.get('model');
          const modelResource = modelResources.find((entry) => entry.name.includes(requestedModel === 'eds-g02' ? '/eds-g02.glb' : '/eds-g01.glb')) ?? modelResources[0];
          const liverySwitchLatencyMs = [];
          for (const button of ${JSON.stringify(qaMode)} === 'eds' ? liveryButtons : []) {
            const started = performance.now();
            button.click();
            await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            liverySwitchLatencyMs.push(Number((performance.now() - started).toFixed(2)));
          }
          if (globalThis.gc) globalThis.gc();
          await new Promise((resolve) => setTimeout(resolve, 100));
          const heapBeforeSwitches = performance.memory?.usedJSHeapSize ?? null;
          for (let index = 0; index < (${JSON.stringify(qaMode)} === 'eds' ? 50 : 0); index += 1) {
            liveryButtons[index % liveryButtons.length].click();
            await new Promise((resolve) => requestAnimationFrame(resolve));
          }
          if (globalThis.gc) globalThis.gc();
          await new Promise((resolve) => setTimeout(resolve, 250));
          const heapAfterSwitches = performance.memory?.usedJSHeapSize ?? null;
          const hotspotChecks = [];
          for (const button of ${JSON.stringify(qaMode)} === 'eds' ? document.querySelectorAll('[data-eds-hotspot]') : []) {
            button.click();
            await new Promise((resolve) => setTimeout(resolve, 80));
            const dialog = document.querySelector('[role="dialog"]');
            const image = dialog?.querySelector('img');
            hotspotChecks.push({
              id: button.getAttribute('data-eds-hotspot'),
              dialogVisible: Boolean(dialog),
              imageLoaded: Boolean(image?.complete && image?.naturalWidth > 0),
            });
            dialog?.querySelector('button[aria-label="Đóng"],button[aria-label="Close"]')?.click();
          }
          let schematicCheck = null;
          if (${JSON.stringify(qaMode)} === 'eds') {
            document.querySelector('[data-eds-schematic-open]')?.click();
            await new Promise((resolve) => setTimeout(resolve, 120));
            const dialog = document.querySelector('[role="dialog"]');
            const image = dialog?.querySelector('img[src*="/eds-g01/schematic.svg"]');
            schematicCheck = {
              dialogVisible: Boolean(dialog),
              imageLoaded: Boolean(image?.complete && image?.naturalWidth > 0),
            };
            dialog?.querySelector('button[aria-label="Đóng"],button[aria-label="Close"]')?.click();
          }
          const frameSample = await new Promise((resolve) => {
            let frames = 0;
            const started = performance.now();
            const tick = (now) => {
              frames += 1;
              if (now - started >= 1500) {
                resolve({
                  frames,
                  durationMs: now - started,
                  fps: (frames * 1000) / (now - started),
                });
              } else {
                requestAnimationFrame(tick);
              }
            };
            requestAnimationFrame(tick);
          });
          return {
            title: document.title,
            heading: document.querySelector('h1')?.textContent?.trim(),
            liveryButtons: liveryButtons.length,
            canvasPresent: Boolean(canvas),
            webglContext: Boolean(gl),
            bodyScrollWidth: document.body.scrollWidth,
            viewportWidth: document.documentElement.clientWidth,
            horizontalOverflow: document.body.scrollWidth > document.documentElement.clientWidth,
            selectedLiveryVisible:
              document.body.textContent?.toLowerCase().includes('cyber kinetic') || false,
            rendererInfo,
            rendererStats,
            navigationTiming: navigation ? {
              domContentLoadedMs: Number(navigation.domContentLoadedEventEnd.toFixed(2)),
              loadEventMs: Number(navigation.loadEventEnd.toFixed(2)),
            } : null,
            modelLoad: modelResource ? {
              asset: modelResource.name.split('/').pop(),
              durationMs: Number(modelResource.duration.toFixed(2)),
              transferSize: modelResource.transferSize,
              decodedBodySize: modelResource.decodedBodySize,
            } : null,
            liverySwitchLatencyMs,
            liverySwitchMedianMs: liverySwitchLatencyMs.length
              ? [...liverySwitchLatencyMs].sort((a, b) => a - b)[Math.floor(liverySwitchLatencyMs.length / 2)]
              : null,
            fiftySwitchHeapDeltaBytes:
              heapBeforeSwitches === null || heapAfterSwitches === null
                ? null
                : heapAfterSwitches - heapBeforeSwitches,
            hotspotChecks,
            schematicCheck,
            frameSample,
          };
        })()`,
        returnByValue: true,
        awaitPromise: true,
      },
      sessionId,
    );
    if (evaluation.exceptionDetails) {
      throw new Error(`Browser evaluation failed: ${evaluation.exceptionDetails.text}`);
    }
    const { result } = evaluation;

    const screenshot = await send(
      'Page.captureScreenshot',
      { format: 'png', fromSurface: true, captureBeyondViewport: false },
      sessionId,
    );
    const screenshotPath = path.join(outputDirectory, `${viewport.name}.png`);
    await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    const viewportResult = {
      viewport,
      screenshot: path.relative(process.cwd(), screenshotPath),
      ...result.value,
    };

    if (qaMode === 'eds' && viewport.name === 'desktop-1440x900') {
      await send(
        'Runtime.evaluate',
        { expression: `document.querySelector('[data-camera-category="car"]')?.click()` },
        sessionId,
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
      viewportResult.silhouetteScreenshots = [];
      for (const preset of ['front', 'side', 'cockpit', 'rear', 'top']) {
        await send(
          'Runtime.evaluate',
          { expression: `document.querySelector('[data-camera-preset="${preset}"]')?.click()` },
          sessionId,
        );
        await new Promise((resolve) => setTimeout(resolve, 1_200));
        const view = await send(
          'Page.captureScreenshot',
          { format: 'png', fromSurface: true, captureBeyondViewport: false },
          sessionId,
        );
        const viewPath = path.join(outputDirectory, `silhouette-${preset}.png`);
        await fs.writeFile(viewPath, Buffer.from(view.data, 'base64'));
        viewportResult.silhouetteScreenshots.push(path.relative(process.cwd(), viewPath));
      }
      const recovery = await send(
        'Runtime.evaluate',
        {
          expression: `(async () => {
            const canvas = document.querySelector('canvas');
            const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
            const extension = gl?.getExtension('WEBGL_lose_context');
            if (!extension) return { supported: false, recovered: false };
            extension.loseContext();
            await new Promise((resolve) => setTimeout(resolve, 350));
            const lostObserved = gl.isContextLost();
            extension.restoreContext();
            await new Promise((resolve) => setTimeout(resolve, 1200));
            const restored = !gl.isContextLost() && Boolean(document.querySelector('canvas'));
            return { supported: true, lostObserved, recovered: restored };
          })()`,
          returnByValue: true,
          awaitPromise: true,
        },
        sessionId,
      );
      viewportResult.contextRecovery = recovery.result.value;
    }
    results.push(viewportResult);
  }

  const performance = await send('Performance.getMetrics', {}, sessionId);
  const metrics = Object.fromEntries(
    performance.metrics
      .filter((entry) =>
        ['JSHeapUsedSize', 'JSHeapTotalSize', 'Nodes', 'LayoutCount'].includes(entry.name),
      )
      .map((entry) => [entry.name, entry.value]),
  );
  const report = {
    generatedAt: new Date().toISOString(),
    mode: qaMode,
    url: showroomUrl,
    results,
    consoleErrors: [...new Set(consoleErrors)],
    pageExceptions: [...new Set(pageExceptions)],
    failedRequests: [...new Set(failedRequests)],
    performanceMetrics: metrics,
  };
  await fs.writeFile(
    path.join(outputDirectory, 'browser-report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
