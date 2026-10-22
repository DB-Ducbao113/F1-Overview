import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const root = path.resolve(
  'docs/commercialization/r3/blender-authoring/evidence/cockpit-nose-redesign',
);
const chrome =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const concepts = [
  ['baseline-precision-machine', 'BASELINE — PRECISION MACHINE'],
  ['n30', 'N30 — 30:70'],
  ['n20', 'N20 — 20:80'],
];
const views = [
  'top-orthographic',
  'side-orthographic',
  'front-three-quarter',
  'rear-three-quarter',
  'cockpit-halo-close-up',
  'nose-monocoque-close-up',
  'cockpit-sidepod-shoulder',
  'front-suspension-nose',
];
const modes = ['clay', 'reflective'];

async function dataUrl(file) {
  return `data:image/png;base64,${(await fs.readFile(file)).toString('base64')}`;
}

function pageHtml(title, panels) {
  return `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;padding:16px;background:#071018;color:#eef4f7;font:15px Arial,sans-serif}
h1{height:30px;margin:0 0 12px;font-size:20px;letter-spacing:.07em;text-transform:uppercase}
main{display:grid;grid-template-columns:repeat(${panels.length},960px);gap:10px}
figure{margin:0;border:1px solid #486070;background:#111a21}figcaption{height:36px;padding:9px 11px;font-weight:700;letter-spacing:.05em}
img{display:block;width:960px;height:640px;object-fit:contain;background:#05080a}
</style><h1>${title}</h1><main>${panels
    .map(({ label, src }) => `<figure><figcaption>${label}</figcaption><img src="${src}"></figure>`)
    .join('')}</main>`;
}

await fs.mkdir(path.join(root, 'contact-sheets'), { recursive: true });
await fs.mkdir(path.join(root, 'comparisons'), { recursive: true });
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const report = { views, modes, sheets: [], errors: [] };

async function capture(target, title, panels) {
  const page = await browser.newPage({
    viewport: { width: panels.length * 970 + 12, height: 728 },
  });
  await page.setContent(pageHtml(title, panels), { waitUntil: 'load' });
  await page.screenshot({ path: target, fullPage: true });
  await page.close();
  report.sheets.push(path.relative(root, target).replaceAll('\\', '/'));
}

try {
  for (const view of views) {
    for (const mode of modes) {
      const panels = await Promise.all(
        concepts.map(async ([slug, label]) => ({
          label,
          src: await dataUrl(path.join(root, slug, `${view}-${mode}.png`)),
        })),
      );
      await capture(
        path.join(root, 'contact-sheets', `${view}-${mode}.png`),
        `EDS-G03 cockpit and nose reset / ${view} / ${mode} / matched Blender camera`,
        panels,
      );
    }
  }

  for (const [slug, label] of concepts.slice(1)) {
    for (const view of ['top-orthographic', 'side-orthographic', 'cockpit-halo-close-up']) {
      const panels = await Promise.all(
        [
          ['baseline-precision-machine', 'BASELINE — PRECISION MACHINE'],
          [slug, label],
        ].map(async ([panelSlug, panelLabel]) => ({
          label: panelLabel,
          src: await dataUrl(path.join(root, panelSlug, `${view}-clay.png`)),
        })),
      );
      await capture(
        path.join(root, 'comparisons', `baseline-vs-${slug}-${view}-clay.png`),
        `Before / after — ${view}`,
        panels,
      );
    }
  }

  for (const view of ['top-orthographic', 'side-orthographic', 'cockpit-halo-close-up']) {
    const panels = await Promise.all(
      concepts.slice(1).map(async ([slug, label]) => ({
        label,
        src: await dataUrl(path.join(root, slug, `${view}-clay.png`)),
      })),
    );
    await capture(
      path.join(root, 'comparisons', `n30-vs-n20-${view}-clay.png`),
      `N30 versus N20 — ${view}`,
      panels,
    );
  }

  const ratioPage = await browser.newPage({ viewport: { width: 1800, height: 720 } });
  await ratioPage.goto(
    pathToFileURL(path.join(root, 'comparisons', 'cockpit-ratio-diagram.svg')).href,
    { waitUntil: 'load' },
  );
  const ratioTarget = path.join(root, 'comparisons', 'cockpit-ratio-diagram.png');
  await ratioPage.screenshot({ path: ratioTarget });
  await ratioPage.close();
  report.sheets.push(path.relative(root, ratioTarget).replaceAll('\\', '/'));
} catch (error) {
  report.errors.push(error.stack || String(error));
  process.exitCode = 1;
} finally {
  await browser.close();
  await fs.writeFile(
    path.join(root, 'contact-sheet-report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
}

console.log(JSON.stringify({ sheets: report.sheets.length, errors: report.errors }, null, 2));
