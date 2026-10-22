import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = path.resolve(
  'docs/commercialization/r3/blender-authoring/evidence/visual-design-reset',
);
const previous = path.resolve(
  'docs/commercialization/r3/blender-authoring/evidence/refinement-revision-2/blender',
);
const chrome =
  process.env.R3_REVIEW_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const concepts = [
  ['aero-predator', 'A — AERO PREDATOR'],
  ['eds-hyper-aero', 'B — EDS HYPER AERO'],
  ['precision-machine', 'C — PRECISION MACHINE'],
];
const views = ['front', 'side', 'top', 'front-three-quarter', 'rear-three-quarter', 'rear'];
const modes = ['clay', 'reflective'];

async function dataUrl(file) {
  return `data:image/png;base64,${(await fs.readFile(file)).toString('base64')}`;
}

function html(title, panels, columns) {
  const cards = panels
    .map(({ label, src }) => `<figure><figcaption>${label}</figcaption><img src="${src}"></figure>`)
    .join('');
  return `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;padding:14px;background:#071018;color:#eef4f7;font:15px Arial,sans-serif}
h1{height:28px;margin:0 0 12px;font-size:19px;letter-spacing:.08em;text-transform:uppercase}
main{display:grid;grid-template-columns:repeat(${columns},960px);gap:10px}
figure{margin:0;border:1px solid #486070;background:#111a21}figcaption{height:34px;padding:8px 10px;font-weight:700;letter-spacing:.06em}
img{display:block;width:960px;height:640px;object-fit:contain;background:#05080a}
</style><h1>${title}</h1><main>${cards}</main>`;
}

await fs.mkdir(path.join(root, 'contact-sheets'), { recursive: true });
await fs.mkdir(path.join(root, 'previous-r2-comparison'), { recursive: true });
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const report = { viewportPerPanel: [960, 640], views, modes, sheets: [], errors: [] };

try {
  for (const view of views) {
    for (const mode of modes) {
      const panels = [];
      for (const [slug, label] of concepts) {
        panels.push({ label, src: await dataUrl(path.join(root, slug, `${view}-${mode}.png`)) });
      }
      const page = await browser.newPage({ viewport: { width: 2928, height: 724 } });
      await page.setContent(
        html(`EDS-G03 silhouette reset / ${view} / ${mode} / matched Blender camera`, panels, 3),
        { waitUntil: 'load' },
      );
      const target = path.join(root, 'contact-sheets', `${view}-${mode}.png`);
      await page.screenshot({ path: target, fullPage: true });
      await page.close();
      report.sheets.push(path.relative(root, target));

      const previousFile = path.join(previous, `${view}-${mode}.png`);
      const comparePanels = [
        { label: 'PREVIOUS REVISION 2 — OWNER REJECTED', src: await dataUrl(previousFile) },
        ...panels,
      ];
      const compare = await browser.newPage({ viewport: { width: 3898, height: 724 } });
      await compare.setContent(
        html(`Previous Revision 2 vs silhouette reset / ${view} / ${mode}`, comparePanels, 4),
        { waitUntil: 'load' },
      );
      const compareTarget = path.join(root, 'previous-r2-comparison', `${view}-${mode}.png`);
      await compare.screenshot({ path: compareTarget, fullPage: true });
      await compare.close();
      report.sheets.push(path.relative(root, compareTarget));
    }
  }
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
