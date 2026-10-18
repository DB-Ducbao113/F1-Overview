import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const circuitSourcePath = path.join(projectRoot, 'src/data/championship/circuitsData.ts');
const circuitOutputDir = path.join(projectRoot, 'public/images/eds/circuits');
const editorialOutputDir = path.join(projectRoot, 'public/images/eds/editorial');

const escapeXml = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const source = await fs.readFile(circuitSourcePath, 'utf8');
const circuitPattern =
  /^  (?:'[^']+'|[a-z][\w-]*): \{\r?\n    id: '([^']+)',\r?\n    round: (\d+),\r?\n    circuitName: '([^']+)',[\s\S]*?    viewBox: '([^']+)',[\s\S]*?    svgPath:\r?\n      '([^']+)'/gm;
const circuits = [...source.matchAll(circuitPattern)].map((match) => ({
  id: match[1],
  round: Number(match[2]),
  name: match[3],
  viewBox: match[4],
  svgPath: match[5],
}));

if (circuits.length !== 24) {
  throw new Error(`Expected 24 circuit geometry records, found ${circuits.length}.`);
}

await fs.mkdir(circuitOutputDir, { recursive: true });
await fs.mkdir(editorialOutputDir, { recursive: true });

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" role="img" aria-labelledby="title description">
  <title id="title">Podium EDS-G01 ground-effect study</title>
  <desc id="description">Original technical illustration of the EDS-G01 prototype over a dark wind-tunnel grid.</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#05060a"/><stop offset="0.55" stop-color="#0b1018"/><stop offset="1" stop-color="#020204"/></linearGradient>
    <radialGradient id="halo"><stop stop-color="#00f0ff" stop-opacity=".32"/><stop offset="1" stop-color="#00f0ff" stop-opacity="0"/></radialGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2=".35"><stop stop-color="#e8edf4"/><stop offset=".28" stop-color="#617083"/><stop offset=".58" stop-color="#151b25"/><stop offset="1" stop-color="#05070b"/></linearGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#a9bfd0" stroke-opacity=".08"/></pattern>
    <filter id="glow"><feGaussianBlur stdDeviation="16"/></filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#background)"/>
  <rect width="1920" height="1080" fill="url(#grid)"/>
  <ellipse cx="1030" cy="635" rx="760" ry="430" fill="url(#halo)"/>
  <path d="M180 760 Q520 690 870 710 T1740 735" fill="none" stroke="#00f0ff" stroke-opacity=".18" stroke-width="2"/>
  <g transform="translate(225 328)">
    <ellipse cx="770" cy="430" rx="635" ry="52" fill="#000" opacity=".72" filter="url(#glow)"/>
    <path d="M84 405 L185 365 L445 343 L632 248 L902 238 L1115 310 L1328 342 L1455 391 L1398 426 L1130 418 L1010 395 L433 403 L220 431 Z" fill="url(#body)" stroke="#dfe7ef" stroke-opacity=".42" stroke-width="3"/>
    <path d="M452 344 L610 217 L858 208 L954 243 L735 286 Z" fill="#0a0f17" stroke="#00f0ff" stroke-opacity=".7" stroke-width="4"/>
    <path d="M645 244 Q730 123 836 232" fill="none" stroke="#e8edf4" stroke-width="18" stroke-linecap="round"/>
    <path d="M170 353 L42 325 L36 286 L306 304 L407 347 Z" fill="#0b111a" stroke="#00f0ff" stroke-width="6"/>
    <path d="M1170 315 L1392 261 L1452 275 L1458 366 L1310 356 Z" fill="#0b111a" stroke="#00f0ff" stroke-width="6"/>
    <path d="M398 398 L1087 391 L1215 438 L330 444 Z" fill="#05070a" stroke="#00f0ff" stroke-opacity=".55" stroke-width="3"/>
    <g fill="#040506" stroke="#75869a" stroke-width="7"><ellipse cx="338" cy="405" rx="105" ry="128"/><ellipse cx="1198" cy="405" rx="113" ry="138"/></g>
    <g fill="#121923" stroke="#00f0ff" stroke-opacity=".5" stroke-width="4"><ellipse cx="338" cy="405" rx="52" ry="72"/><ellipse cx="1198" cy="405" rx="56" ry="78"/></g>
    <path d="M510 353 L625 308 L1045 305 L1138 360 L1014 388 L620 385 Z" fill="#132637" stroke="#00f0ff" stroke-opacity=".4" stroke-width="3"/>
    <path d="M645 358 Q784 320 984 355" fill="none" stroke="#ff3028" stroke-width="7"/>
  </g>
</svg>\n`;

await fs.writeFile(path.join(editorialOutputDir, 'eds-g01-hero.svg'), heroSvg, 'utf8');

const circuitOutputs = [];
for (const circuit of circuits) {
  const safeName = escapeXml(circuit.name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-labelledby="title description">
  <title id="title">${safeName} engineering visualization</title>
  <desc id="description">Original Podium EDS circuit visualization generated from the repository circuit path.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07090f"/><stop offset="1" stop-color="#111927"/></linearGradient>
    <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#9db2c8" stroke-opacity=".08"/></pattern>
    <filter id="glow"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <rect width="1200" height="675" fill="url(#grid)"/>
  <path d="M0 545 L1200 390 V675 H0Z" fill="#05070b" opacity=".76"/>
  <g transform="translate(345 126) scale(1.02)">
    <path d="${circuit.svgPath}" fill="none" stroke="#00f0ff" stroke-opacity=".24" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
    <path d="${circuit.svgPath}" fill="none" stroke="#e8eef5" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${circuit.svgPath}" fill="none" stroke="#121925" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${circuit.svgPath}" fill="none" stroke="#ff3028" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g font-family="Inter,Arial,sans-serif"><text x="64" y="76" fill="#ff3028" font-size="17" font-weight="800" letter-spacing="5">EDS CIRCUIT LAB // ROUND ${String(circuit.round).padStart(2, '0')}</text><text x="64" y="116" fill="#f4f7fa" font-size="28" font-weight="800">${safeName}</text><text x="64" y="145" fill="#8293a8" font-size="14" letter-spacing="3">OFFLINE VECTOR STUDY · NO REMOTE IMAGERY</text></g>
  <g transform="translate(64 590)" font-family="Inter,Arial,sans-serif"><rect width="390" height="2" fill="#00f0ff"/><text y="38" fill="#aab8c7" font-size="13" font-weight="700" letter-spacing="4">TRACK GEOMETRY / TELEMETRY CONTEXT</text></g>
</svg>\n`;
  const outputPath = path.join(circuitOutputDir, `${circuit.id}.svg`);
  await fs.writeFile(outputPath, svg, 'utf8');
  circuitOutputs.push(outputPath);
}

const outputs = [path.join(editorialOutputDir, 'eds-g01-hero.svg'), ...circuitOutputs];
const digest = crypto.createHash('sha256');
for (const output of outputs.sort()) {
  digest.update(path.relative(projectRoot, output).replaceAll('\\', '/'));
  digest.update(await fs.readFile(output));
}

console.log(
  `Generated 1 EDS-G01 hero and ${circuitOutputs.length} circuit visualizations. Asset-set SHA-256: ${digest.digest('hex').toUpperCase()}`,
);
