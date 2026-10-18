import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright-core';

const baseUrl = process.env.M3_QA_URL || 'http://127.0.0.1:4173';
const chromePath =
  process.env.M3_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDirectory = path.resolve(
  process.env.M3_QA_OUTPUT || 'docs/commercialization/m3/evidence/phase-2-comparison',
);

const comparisons = [
  {
    name: 'homepage-hero-before-after',
    title: 'Homepage hero replacement',
    before: '/images/podium-diffuser-hero-v2.webp',
    after: '/images/eds/editorial/eds-g01-hero.svg',
  },
  {
    name: 'circuit-visual-before-after',
    title: 'Circuit visual replacement',
    before: '/images/circuits/albert_park_pit_straight.webp',
    after: '/images/eds/circuits/albert-park.svg',
  },
];

await fs.mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--disable-background-networking', '--disable-component-update', '--disable-sync'],
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 720 } });
  for (const comparison of comparisons) {
    await page.setContent(`<!doctype html><html><head><style>
      *{box-sizing:border-box} body{margin:0;background:#07090f;color:#f4f7fa;font-family:Arial,sans-serif}
      header{height:88px;padding:24px 36px;border-bottom:1px solid #263041;font-size:26px;font-weight:800;letter-spacing:.04em}
      main{display:grid;grid-template-columns:1fr 1fr;gap:18px;padding:18px;height:632px}
      figure{margin:0;position:relative;overflow:hidden;border:1px solid #263041;border-radius:16px;background:#0c111b}
      img{width:100%;height:100%;object-fit:contain;display:block}
      figcaption{position:absolute;left:16px;top:16px;padding:8px 12px;border-radius:999px;background:rgba(2,4,8,.85);font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
      .after figcaption{background:rgba(0,240,255,.88);color:#031014}
    </style></head><body><header>${comparison.title}</header><main>
      <figure><img src="${baseUrl}${comparison.before}" alt="Before"><figcaption>Before / unverified</figcaption></figure>
      <figure class="after"><img src="${baseUrl}${comparison.after}" alt="After"><figcaption>After / EDS original</figcaption></figure>
    </main></body></html>`);
    await page.waitForFunction(() => [...document.images].every((image) => image.complete));
    const broken = await page.evaluate(() =>
      [...document.images].filter((image) => image.naturalWidth === 0).map((image) => image.src),
    );
    if (broken.length > 0) throw new Error(`Comparison images failed: ${broken.join(', ')}`);
    await page.screenshot({ path: path.join(outputDirectory, `${comparison.name}.png`) });
  }
} finally {
  await browser.close();
}

console.log(`Captured ${comparisons.length} M3 Phase 2 before/after comparisons.`);
