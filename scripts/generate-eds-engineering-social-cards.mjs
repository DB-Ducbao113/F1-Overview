import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const executablePath = chromeCandidates.find((candidate) => existsSync(candidate));
const checkOnly = process.argv.includes('--check');
const articles = JSON.parse(await readFile('src/data/engineeringArticles.json', 'utf8'));
const outputDir = path.resolve('public/images/eds/engineering/social');
const temporaryDir = checkOnly
  ? await mkdtemp(path.join(os.tmpdir(), 'podium-social-cards-'))
  : outputDir;

if (!executablePath) throw new Error('Chrome/Chromium not found. Set CHROME_PATH.');
await mkdir(temporaryDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--disable-background-networking', '--disable-component-update', '--disable-sync'],
});

let mismatch = false;
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  for (const [index, article] of articles.entries()) {
    const svg = await readFile(path.join('public', article.heroImage), 'utf8');
    const image = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    const number = String(index + 1).padStart(2, '0');
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
      *{box-sizing:border-box}html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#07090e;color:#fff;font-family:Arial,sans-serif}
      main{position:relative;width:1200px;height:630px;overflow:hidden;background:radial-gradient(circle at 82% 12%,rgba(82,229,255,.20),transparent 38%),linear-gradient(135deg,#07090e 0%,#111723 100%)}
      main:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,9,14,.98) 0%,rgba(7,9,14,.91) 47%,rgba(7,9,14,.16) 76%,rgba(7,9,14,.5) 100%)}
      img{position:absolute;right:-118px;top:-7px;width:820px;height:645px;object-fit:cover;filter:saturate(.92) contrast(1.08)}
      .copy{position:absolute;z-index:2;left:68px;top:58px;width:625px;height:514px;display:flex;flex-direction:column}
      .brand{font-size:17px;font-weight:800;letter-spacing:.24em;color:#52e5ff}.rule{width:64px;height:4px;margin:27px 0 31px;background:#ef4053}
      .topic{font-size:16px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#aab5c5}
      h1{margin:17px 0 0;font-size:54px;line-height:1.02;letter-spacing:-.035em;text-transform:uppercase;max-width:610px}
      .footer{margin-top:auto;display:flex;align-items:center;gap:18px;font-size:16px;font-weight:700;letter-spacing:.08em;color:#c7d0dc}.number{font-size:25px;color:#ef4053}.dot{color:#526072}
    </style></head><body><main><img src="${image}" alt=""><div class="copy"><div class="brand">PODIUM EDS</div><div class="rule"></div><div class="topic">${article.topic.en}</div><h1>${article.title.en}</h1><div class="footer"><span class="number">${number}</span><span class="dot">/</span><span>ENGINEERING INSIGHTS</span><span class="dot">·</span><span>VI / EN</span></div></div></main></body></html>`);
    await page.waitForFunction(() => [...document.images].every((image) => image.complete));
    const fileName = `${article.slug}.png`;
    const generatedPath = path.join(temporaryDir, fileName);
    await page.screenshot({ path: generatedPath, type: 'png' });
    if (checkOnly) {
      const [expected, actual] = await Promise.all([
        readFile(path.join(outputDir, fileName)).catch(() => Buffer.alloc(0)),
        readFile(generatedPath),
      ]);
      if (!expected.equals(actual)) {
        mismatch = true;
        console.error(`MISMATCH ${path.relative(process.cwd(), path.join(outputDir, fileName))}`);
      }
    } else {
      console.log(`WROTE ${path.relative(process.cwd(), generatedPath)} (1200x630)`);
    }
  }
} finally {
  await browser.close();
  if (checkOnly) await rm(temporaryDir, { recursive: true, force: true });
}

if (mismatch) process.exitCode = 1;
