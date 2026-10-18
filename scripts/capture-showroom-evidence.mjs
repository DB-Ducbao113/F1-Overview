import { spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDirectory = path.resolve('docs/commercialization/m2/evidence');
const profileDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'eds-showroom-chrome-'));
const viewports = [
  { name: 'mobile-375x812', width: 375, height: 812, mobile: true },
  { name: 'tablet-768x1024', width: 768, height: 1024, mobile: false },
  { name: 'desktop-1440x900', width: 1440, height: 900, mobile: false },
];

await fs.mkdir(outputDirectory, { recursive: true });

const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--remote-debugging-port=0',
    `--user-data-dir=${profileDirectory}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-sync',
    '--enable-unsafe-swiftshader',
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true },
);

const websocketUrl = await new Promise((resolve, reject) => {
  let stderr = '';
  const timer = setTimeout(() => reject(new Error(`Chrome DevTools timeout. ${stderr}`)), 15_000);
  chrome.stderr.setEncoding('utf8');
  chrome.stderr.on('data', (chunk) => {
    stderr += chunk;
    const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
    if (match) {
      clearTimeout(timer);
      resolve(match[1]);
    }
  });
  chrome.once('error', reject);
  chrome.once('exit', (code) =>
    reject(new Error(`Chrome exited before DevTools was ready (${code}).`)),
  );
});

const socket = new WebSocket(websocketUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let commandId = 0;
const pending = new Map();
const listeners = new Map();

socket.addEventListener('message', ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }
  const key = `${message.sessionId || 'browser'}:${message.method}`;
  for (const listener of listeners.get(key) || []) listener(message.params || {});
});

function send(method, params = {}, sessionId) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

function on(sessionId, method, listener) {
  const key = `${sessionId}:${method}`;
  const values = listeners.get(key) || [];
  values.push(listener);
  listeners.set(key, values);
}

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await Promise.all([
  send('Page.enable', {}, sessionId),
  send('Runtime.enable', {}, sessionId),
  send('Network.enable', {}, sessionId),
  send('Performance.enable', {}, sessionId),
]);

const consoleErrors = [];
const pageExceptions = [];
const failedRequests = [];
on(sessionId, 'Runtime.consoleAPICalled', (event) => {
  if (event.type === 'error') {
    consoleErrors.push(event.args.map((arg) => arg.value || arg.description || '').join(' '));
  }
});
on(sessionId, 'Runtime.exceptionThrown', (event) => {
  pageExceptions.push(event.exceptionDetails?.text || 'Unknown page exception');
});
on(sessionId, 'Network.loadingFailed', (event) => {
  if (!event.canceled) failedRequests.push(`${event.errorText} (${event.type})`);
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
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/showroom' }, sessionId);
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
          expression: `Boolean(document.querySelector('canvas') && document.querySelectorAll('[data-eds-livery]').length === 6)`,
          returnByValue: true,
        },
        sessionId,
      );
      ready = readiness.result.value;
      if (!ready) await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!ready) throw new Error(`Showroom did not become ready at ${viewport.name}.`);

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

    const { result } = await send(
      'Runtime.evaluate',
      {
        expression: `(async () => {
          const liveryButtons = [...document.querySelectorAll('[data-eds-livery]')];
          const canvas = document.querySelector('canvas');
          const gl = canvas?.getContext('webgl2') || canvas?.getContext('webgl');
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
            frameSample,
          };
        })()`,
        returnByValue: true,
        awaitPromise: true,
      },
      sessionId,
    );

    const screenshot = await send(
      'Page.captureScreenshot',
      { format: 'png', fromSurface: true, captureBeyondViewport: false },
      sessionId,
    );
    const screenshotPath = path.join(outputDirectory, `${viewport.name}.png`);
    await fs.writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));
    results.push({
      viewport,
      screenshot: path.relative(process.cwd(), screenshotPath),
      ...result.value,
    });
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
    url: 'http://127.0.0.1:5173/showroom',
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
  socket.close();
  chrome.kill();
  await Promise.race([once(chrome, 'exit'), new Promise((resolve) => setTimeout(resolve, 3_000))]);
  try {
    await fs.rm(profileDirectory, { recursive: true, force: true, maxRetries: 4, retryDelay: 250 });
  } catch (error) {
    console.warn(`Temporary Chrome profile cleanup deferred: ${error.message}`);
  }
}
