import fs from 'node:fs/promises';
import path from 'node:path';
import { EDS_G01_DESIGN, EDS_G01_PARTS } from './eds-g01-design.mjs';

const outputDir = path.resolve('public/images/showroom/eds-g01');
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const frame = (title, code, body, note) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-labelledby="title description">
  <title id="title">${escape(title)}</title><desc id="description">Original Podium EDS technical illustration generated from the EDS-G01 design specification.</desc>
  <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#05080d"/><stop offset="1" stop-color="#101b28"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
  <rect width="1600" height="900" fill="url(#bg)"/><g stroke="#173149" stroke-width="1" opacity=".42">${Array.from({ length: 17 }, (_, i) => `<path d="M${i * 100} 0V900"/>`).join('')}${Array.from({ length: 10 }, (_, i) => `<path d="M0 ${i * 100}H1600"/>`).join('')}</g>
  <path d="M50 72H1550M50 828H1550" stroke="#00e8ff" stroke-width="2" opacity=".55"/><text x="64" y="54" fill="#8fa9be" font-family="monospace" font-size="18" letter-spacing="4">PODIUM EDS // ORIGINAL ENGINEERING ASSET</text>
  <text x="64" y="114" fill="white" font-family="Arial,sans-serif" font-size="38" font-weight="700">${escape(title)}</text><text x="64" y="146" fill="#00e8ff" font-family="monospace" font-size="17">${escape(code)} · ${EDS_G01_DESIGN.revision}</text>
  ${body}
  <text x="64" y="866" fill="#8fa9be" font-family="monospace" font-size="16">${escape(note)}</text><text x="1535" y="866" fill="#00e8ff" font-family="monospace" font-size="16" text-anchor="end">SOURCE: EDS-G01 PROCEDURAL MASTER</text>
</svg>`;

const topCar = `<g transform="translate(800 470)" fill="none" stroke="#d7f8ff" stroke-width="6" stroke-linejoin="round">
  <path d="M-86-292L-210-220-270-75-220 195-112 292H112L220 195 270-75 210-220 86-292Z" fill="#0d2637"/>
  <path d="M-38-340L-78-210-65 220-25 330H25L65 220 78-210 38-340Z" fill="#122f44"/>
  <path d="M-330-320H330L290-275H-290Z M-270 310H270L245 365H-245Z" fill="#00e8ff" opacity=".6"/>
  <g fill="#080a0d"><rect x="-342" y="-245" width="72" height="128" rx="30"/><rect x="270" y="-245" width="72" height="128" rx="30"/><rect x="-330" y="180" width="78" height="138" rx="32"/><rect x="252" y="180" width="78" height="138" rx="32"/></g>
  <path d="M-70-80Q0-150 70-80V55Q0 125-70 55Z" fill="#05080d"/><path d="M-205-120Q-120-35-115 170M205-120Q120-35 115 170" stroke="#00e8ff" opacity=".7"/>
</g>`;

const schematic = frame(
  'EDS-G01 MASTER AERODYNAMIC SCHEMATIC',
  'EDS-CAD-MASTER-01',
  `${topCar}
  <g fill="#b8d1df" font-family="monospace" font-size="18"><text x="170" y="315">01 · FOUR-PLANE FRONT WING</text><path d="M450 310H590L660 220" stroke="#00e8ff" fill="none"/><text x="1180" y="360">02 · SPLIT-KEEL NOSE</text><path d="M1170 355H1010L850 165" stroke="#00e8ff" fill="none"/><text x="120" y="575">03 · DELTA VENTURI FLOOR</text><path d="M450 570H610L680 520" stroke="#00e8ff" fill="none"/><text x="1160" y="615">04 · BRIDGE REAR WING</text><path d="M1150 610H990L860 790" stroke="#00e8ff" fill="none"/></g>`,
  `${EDS_G01_DESIGN.length} M LENGTH · ${EDS_G01_DESIGN.wheelbase} M WHEELBASE · 14 ASSEMBLIES`,
);

const drawings = {
  wings: `<g transform="translate(800 475)" fill="none" stroke="#d7f8ff" stroke-width="8"><path d="M-520 145Q0 45 520 145L470 205Q0 118-470 205Z" fill="#0d2637"/><path d="M-470 55Q0-30 470 55M-415-25Q0-95 415-25M-350-100Q0-150 350-100"/><path d="M-540-75V230M540-75V230" stroke="#00e8ff"/><path d="M-80-145L0-245 80-145" stroke="#00e8ff"/></g>`,
  drs: `<g transform="translate(800 470)" fill="none" stroke="#d7f8ff" stroke-width="9"><path d="M-430 120H430L380 220H-380Z" fill="#0d2637"/><path d="M-390-60H390L345 40H-345Z" fill="#00e8ff" opacity=".35"/><path d="M-430-100V255M430-100V255M-230 120L-95 320M230 120L95 320"/><circle cx="0" cy="90" r="45" stroke="#00e8ff"/><path d="M0 45V-40" stroke="#00e8ff"/></g>`,
  power_unit: `<g transform="translate(800 480)" fill="none" stroke="#d7f8ff" stroke-width="8"><path d="M-420 90L-260-165H260L420 90 265 240H-265Z" fill="#0d2637"/><circle cx="-185" cy="25" r="110"/><circle cx="185" cy="25" r="110"/><path d="M-185-85L0 175 185-85M0-170V175" stroke="#00e8ff"/><rect x="-105" y="-245" width="210" height="85" rx="25" fill="#00e8ff" opacity=".32"/></g>`,
  halo: `<g transform="translate(800 520)" fill="none" stroke="#d7f8ff" stroke-width="22" stroke-linecap="round"><path d="M-330 180Q-350-250 0-290Q350-250 330 180"/><path d="M0-290V210" stroke="#00e8ff"/><path d="M-330 180L-250 265M330 180L250 265"/><path d="M-240 220Q0 330 240 220" stroke="#35586c" stroke-width="8"/></g>`,
  sidepods: `<g transform="translate(800 500)" fill="none" stroke="#d7f8ff" stroke-width="8"><path d="M-500-80Q-310-250-80-90L0 210-260 270-500 110Z" fill="#0d2637"/><path d="M500-80Q310-250 80-90L0 210 260 270 500 110Z" fill="#0d2637"/><path d="M-430-75Q-290-170-155-70M430-75Q290-170 155-70" stroke="#00e8ff" stroke-width="18"/><path d="M-460 45Q-280 0-95 160M460 45Q280 0 95 160" stroke="#00e8ff"/></g>`,
  tires: `<g transform="translate(800 500)" fill="none"><circle r="285" stroke="#d7f8ff" stroke-width="74"/><circle r="175" stroke="#00e8ff" stroke-width="16"/><circle r="100" fill="#0d2637" stroke="#d7f8ff" stroke-width="8"/><g stroke="#d7f8ff" stroke-width="14">${Array.from({ length: 12 }, (_, i) => `<path d="M0-160V-104" transform="rotate(${i * 30})"/>`).join('')}</g><circle r="28" fill="#00e8ff"/></g>`,
  floor: `<g transform="translate(800 490)" fill="none" stroke="#d7f8ff" stroke-width="8"><path d="M-230-310L-470-175-500 155-330 300H330L500 155 470-175 230-310Z" fill="#0d2637"/><path d="M-315-220Q-180 0-250 255M315-220Q180 0 250 255" stroke="#00e8ff" stroke-width="22"/><path d="M-120-285V270M120-285V270" stroke="#35586c"/><path d="M-330 300L-470 390M-165 300L-225 410M0 300V420M165 300L225 410M330 300L470 390" stroke="#00e8ff"/></g>`,
};

const titles = {
  wings: 'FOUR-PLANE FRONT WING',
  drs: 'BRIDGE REAR WING & ACTIVE FLAP',
  power_unit: 'HYBRID ENERGY MODULE',
  halo: 'SWEPT TITANIUM SAFETY CELL',
  sidepods: 'TEARDROP SIDEPODS & COOLING',
  tires: 'UNBRANDED 18-INCH WHEEL SYSTEM',
  floor: 'TWIN VENTURI FLOOR & DIFFUSER',
};

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, 'schematic.svg'), schematic);
for (const [id, drawing] of Object.entries(drawings)) {
  const part = EDS_G01_PARTS[id];
  await fs.writeFile(
    path.join(outputDir, `${id}.svg`),
    frame(
      titles[id],
      part.code,
      drawing,
      `FOCUS ${part.focus.join(' / ')} M · ORIGINAL VECTOR PROJECTION`,
    ),
  );
}
console.log(
  `Generated ${Object.keys(drawings).length + 1} original EDS-G01 SVG assets in ${path.relative(process.cwd(), outputDir)}`,
);
