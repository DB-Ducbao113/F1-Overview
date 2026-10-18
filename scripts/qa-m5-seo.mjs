import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const tempDir = await mkdtemp(path.join(os.tmpdir(), 'podium-m5-seo-'));
try {
  const generated = spawnSync(
    process.execPath,
    ['scripts/generate-seo-artifacts.mjs', `--output=${tempDir}`],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        VITE_SITE_URL: 'https://commercial.example',
        VITE_ALLOW_INDEXING: 'true',
      },
      encoding: 'utf8',
    },
  );
  if (generated.status !== 0) throw new Error(generated.stderr || 'SEO generator failed');
  const sitemap = await readFile(path.join(tempDir, 'sitemap.xml'), 'utf8');
  const robots = await readFile(path.join(tempDir, 'robots.txt'), 'utf8');
  const articles = JSON.parse(await readFile('src/data/engineeringArticles.json', 'utf8'));
  for (const article of articles) {
    const route = `/engineering/${article.slug}`;
    if (!sitemap.includes(`https://commercial.example${route}`))
      throw new Error(`Missing sitemap route ${route}`);
    const html = await readFile(
      path.join('dist', 'engineering', article.slug, 'index.html'),
      'utf8',
    );
    if (!html.includes(article.title.en) || !html.includes(article.title.vi))
      throw new Error(`Missing bilingual prerender content ${route}`);
    if (!html.includes('application/ld+json')) throw new Error(`Missing article JSON-LD ${route}`);
  }
  for (const expectedRoute of ['/teams/ferrari', '/drivers/hamilton', '/season/2024']) {
    if (!sitemap.includes(`https://commercial.example${expectedRoute}`))
      throw new Error(`Missing discovered application route ${expectedRoute}`);
  }
  if (!robots.includes('Allow: /') || !robots.includes('https://commercial.example/sitemap.xml'))
    throw new Error('Indexable robots output is invalid');
  const defaultRobots = await readFile(path.join('dist', 'robots.txt'), 'utf8');
  if (!process.env.VITE_SITE_URL && !defaultRobots.includes('Disallow: /'))
    throw new Error('Unconfigured build must remain noindex');
  console.log(
    `PASS M5 SEO: ${articles.length} prerendered bilingual articles; configurable sitemap and preview noindex verified.`,
  );
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
