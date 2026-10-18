import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');
const shell = await readFile(path.join(distDir, 'index.html'), 'utf8');
const articles = JSON.parse(await readFile('src/data/engineeringArticles.json', 'utf8'));
const siteUrl = (() => {
  try {
    return process.env.VITE_SITE_URL ? new URL(process.env.VITE_SITE_URL).origin : null;
  } catch {
    return null;
  }
})();
const indexing = Boolean(siteUrl && process.env.VITE_ALLOW_INDEXING === 'true');
const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const replaceMeta = (html, { title, description, route, image, type = 'website', content }) => {
  const canonical = siteUrl ? `${siteUrl}${route}` : null;
  const imageUrl = siteUrl ? new URL(image, siteUrl).href : image;
  const head = `<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${indexing ? 'index, follow' : 'noindex, nofollow'}"><meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${esc(imageUrl)}">${canonical ? `<meta property="og:url" content="${esc(canonical)}"><link rel="canonical" href="${esc(canonical)}">` : ''}`;
  return html
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[\s\S]*?>/, '')
    .replace(/<meta name="robots"[\s\S]*?>/, '')
    .replace('</head>', `${head}</head>`)
    .replace('<div id="root"></div>', `<div id="root" data-prerendered="true">${content}</div>`);
};
const indexContent = `<main><h1>Engineering Insights</h1>${articles.map((a) => `<article><h2><a href="/engineering/${esc(a.slug)}">${esc(a.title.en)} / ${esc(a.title.vi)}</a></h2><p>${esc(a.description.en)}</p><p lang="vi">${esc(a.description.vi)}</p></article>`).join('')}</main>`;
const indexHtml = replaceMeta(shell, {
  title: 'Engineering Insights | Podium EDS',
  description: 'Bilingual race-engineering features using the original EDS-G01 prototype.',
  route: '/engineering',
  image: '/images/eds/engineering/ground-effect-flow.svg',
  content: indexContent,
});
await mkdir(path.join(distDir, 'engineering'), { recursive: true });
await writeFile(path.join(distDir, 'engineering', 'index.html'), indexHtml, 'utf8');
for (const article of articles) {
  const body = `<article><header><p>${esc(article.topic.en)} / ${esc(article.topic.vi)}</p><h1>${esc(article.title.en)}</h1><h2 lang="vi">${esc(article.title.vi)}</h2><p>${esc(article.standfirst.en)}</p><p lang="vi">${esc(article.standfirst.vi)}</p><img src="${esc(article.heroImage)}" alt="${esc(article.imageAlt.en)}"></header>${article.sections.map((section) => `<section id="${esc(section.id)}"><h2>${esc(section.heading.en)}</h2>${section.paragraphs.en.map((p) => `<p>${esc(p)}</p>`).join('')}<div lang="vi"><h2>${esc(section.heading.vi)}</h2>${section.paragraphs.vi.map((p) => `<p>${esc(p)}</p>`).join('')}</div></section>`).join('')}<h2>Sources</h2><ul>${article.sources.map((source) => `<li><a href="${esc(source.url)}">${esc(source.title)}</a></li>`).join('')}</ul></article>`;
  const schema = `<script id="route-structured-data" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'TechArticle', headline: article.title.en, description: article.description.en, image: siteUrl ? new URL(article.heroImage, siteUrl).href : article.heroImage, inLanguage: ['vi', 'en'], ...(siteUrl ? { mainEntityOfPage: `${siteUrl}/engineering/${article.slug}` } : {}), author: { '@type': 'Organization', name: 'Podium EDS Editorial' }, publisher: { '@type': 'Organization', name: 'Podium Effet De Sol' } }).replaceAll('<', '\\u003c')}</script>`;
  const html = replaceMeta(shell, {
    title: `${article.title.en} | Podium EDS`,
    description: article.description.en,
    route: `/engineering/${article.slug}`,
    image: article.heroImage,
    type: 'article',
    content: body,
  }).replace('</head>', `${schema}</head>`);
  const articleDir = path.join(distDir, 'engineering', article.slug);
  await mkdir(articleDir, { recursive: true });
  await writeFile(path.join(articleDir, 'index.html'), html, 'utf8');
}
console.log(`Prerendered Engineering Insights index and ${articles.length} articles.`);
