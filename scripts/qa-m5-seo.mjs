import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { PNG } from 'pngjs';

const root = await mkdtemp(path.join(os.tmpdir(), 'podium-m5-seo-'));
const run = (args, output, context) => {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      VITE_SITE_URL: 'https://commercial.example',
      VITE_ALLOW_INDEXING: 'true',
      VITE_DEPLOYMENT_CONTEXT: context,
    },
    encoding: 'utf8',
  });
  if (result.status !== 0)
    throw new Error(`${args[0]} failed for ${context}: ${result.stderr || result.stdout}`);
  return output;
};
const count = (value, pattern) => (value.match(pattern) ?? []).length;

try {
  const productionDir = path.join(root, 'production');
  const previewDir = path.join(root, 'preview');
  for (const [output, context] of [
    [productionDir, 'production'],
    [previewDir, 'preview'],
  ]) {
    run(['scripts/generate-seo-artifacts.mjs', `--output=${output}`], output, context);
    run(
      [
        'scripts/prerender-engineering.mjs',
        `--output=${output}`,
        `--shell=${path.resolve('dist/index.html')}`,
      ],
      output,
      context,
    );
  }

  const sitemap = await readFile(path.join(productionDir, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urls.length !== 72) throw new Error(`Expected 72 sitemap routes, received ${urls.length}`);
  if (new Set(urls).size !== urls.length) throw new Error('Sitemap contains duplicate routes');
  for (const urlValue of urls) {
    const url = new URL(urlValue);
    if (url.origin !== 'https://commercial.example')
      throw new Error(`Unexpected sitemap origin ${urlValue}`);
    if (url.pathname !== '/' && url.pathname.endsWith('/'))
      throw new Error(`Trailing-slash duplicate risk ${urlValue}`);
    if (/\/\//.test(url.pathname)) throw new Error(`Invalid doubled path separator ${urlValue}`);
  }

  const articles = JSON.parse(await readFile('src/data/engineeringArticles.json', 'utf8'));
  for (const article of articles) {
    const route = `/engineering/${article.slug}`;
    if (!urls.includes(`https://commercial.example${route}`))
      throw new Error(`Missing sitemap route ${route}`);
    const html = await readFile(
      path.join(productionDir, 'engineering', article.slug, 'index.html'),
      'utf8',
    );
    if (!html.includes(article.title.en) || !html.includes(article.title.vi))
      throw new Error(`Missing bilingual prerender content ${route}`);
    if (!html.includes('application/ld+json') || !html.includes('TechArticle'))
      throw new Error(`Missing article JSON-LD ${route}`);
    if (!html.includes(`https://commercial.example${article.socialImage}`))
      throw new Error(`Missing absolute social card ${route}`);
    if (!html.includes(`<link rel="canonical" href="https://commercial.example${route}">`))
      throw new Error(`Invalid canonical ${route}`);
    if (!html.includes('<meta name="robots" content="index, follow">'))
      throw new Error(`Production prerender is not indexable ${route}`);
    if (count(html, /<meta property="og:title"/g) !== 1)
      throw new Error(`Duplicate or missing Open Graph title ${route}`);
    if (count(html, /<meta name="description"/g) !== 1)
      throw new Error(`Duplicate or missing description ${route}`);
    if (!html.includes('<meta property="og:locale" content="vi_VN">'))
      throw new Error(`Missing default Vietnamese locale ${route}`);

    const png = PNG.sync.read(await readFile(path.join('public', article.socialImage)));
    if (png.width !== 1200 || png.height !== 630)
      throw new Error(`Invalid social-card dimensions ${article.socialImage}`);
  }

  for (const expectedRoute of ['/teams/ferrari', '/drivers/hamilton', '/season/2024']) {
    if (!urls.includes(`https://commercial.example${expectedRoute}`))
      throw new Error(`Missing discovered application route ${expectedRoute}`);
  }
  const productionRobots = await readFile(path.join(productionDir, 'robots.txt'), 'utf8');
  if (
    !productionRobots.includes('Allow: /') ||
    !productionRobots.includes('https://commercial.example/sitemap.xml')
  )
    throw new Error('Indexable production robots output is invalid');

  const previewRobots = await readFile(path.join(previewDir, 'robots.txt'), 'utf8');
  const previewHtml = await readFile(
    path.join(previewDir, 'engineering', articles[0].slug, 'index.html'),
    'utf8',
  );
  if (!previewRobots.includes('Disallow: /'))
    throw new Error('Preview robots must disallow crawling');
  if (!previewHtml.includes('<meta name="robots" content="noindex, nofollow">'))
    throw new Error('Preview noindex is missing from initial HTML');

  const defaultRobots = await readFile(path.join('dist', 'robots.txt'), 'utf8');
  const defaultHtml = await readFile(
    path.join('dist', 'engineering', articles[0].slug, 'index.html'),
    'utf8',
  );
  if (!defaultRobots.includes('Disallow: /'))
    throw new Error('Unconfigured build must disallow crawling');
  if (!defaultHtml.includes('<meta name="robots" content="noindex, nofollow">'))
    throw new Error('Unconfigured build noindex is missing from initial HTML');

  console.log(
    `PASS M5 SEO: ${urls.length} unique valid routes, four bilingual prerenders, PNG social metadata, production canonicals and initial-HTML preview noindex verified.`,
  );
} finally {
  await rm(root, { recursive: true, force: true });
}
