import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const outputDir = path.resolve('public/images/eds/engineering');
const checkOnly = process.argv.includes('--check');
const shell = (
  title,
  subtitle,
  body,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
<title id="title">${title}</title><desc id="desc">${subtitle}</desc>
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#080b12"/><stop offset="1" stop-color="#151923"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto"><path d="M0 0L8 3L0 6Z" fill="#52e5ff"/></marker></defs>
<rect width="1600" height="900" fill="url(#bg)"/><path d="M0 700H1600" stroke="#323947" stroke-width="3"/><g fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</g>
<text x="80" y="92" fill="#fff" font-family="Arial,sans-serif" font-size="42" font-weight="700">${title}</text><text x="82" y="130" fill="#8c98aa" font-family="Arial,sans-serif" font-size="19">PODIUM EDS · ORIGINAL ENGINEERING DIAGRAM · NOT CFD / NOT MEASURED DATA</text>
</svg>`;

const assets = {
  'ground-effect-flow.svg': shell(
    'GROUND EFFECT FLOW',
    'Conceptual EDS-G01 floor flow path',
    `
    <path d="M220 555Q380 430 580 450L1110 475Q1280 500 1400 610" stroke="#dce4ef" stroke-width="18"/>
    <path d="M260 650H1090Q1260 650 1390 590" stroke="#778294" stroke-width="12"/>
    <path d="M255 615C500 570 720 590 990 600C1180 606 1290 570 1410 510" stroke="#52e5ff" stroke-width="7" marker-end="url(#arrow)" filter="url(#glow)"/>
    <path d="M220 585C500 525 780 540 1050 555C1240 565 1320 525 1430 460" stroke="#52e5ff" stroke-width="3" marker-end="url(#arrow)" opacity=".55"/>
    <path d="M600 660V735M1030 645V735M1320 595V735" stroke="#f04b5c" stroke-width="3" stroke-dasharray="8 10"/>
    <g fill="#fff" stroke="none" font-family="Arial" font-size="24"><text x="525" y="780">FLOOR INLET</text><text x="965" y="780">THROAT</text><text x="1250" y="780">DIFFUSER</text></g>`,
  ),
  'active-aero-mechanism.svg': shell(
    'ACTIVE AERO MECHANICS',
    'Conceptual pivot, actuator and safe-state load path',
    `
    <path d="M280 590L1180 480L1350 520" stroke="#dce4ef" stroke-width="28"/><path d="M680 545L1180 350L1370 390" stroke="#596273" stroke-width="18" stroke-dasharray="12 14"/>
    <circle cx="1180" cy="480" r="28" stroke="#52e5ff" stroke-width="8" filter="url(#glow)"/><path d="M930 650L1180 480" stroke="#f04b5c" stroke-width="14"/><rect x="815" y="625" width="150" height="52" rx="18" stroke="#f04b5c" stroke-width="8"/>
    <path d="M1230 450Q1330 390 1420 300" stroke="#52e5ff" stroke-width="6" marker-end="url(#arrow)"/>
    <g fill="#fff" stroke="none" font-family="Arial" font-size="24"><text x="765" y="720">ACTUATOR</text><text x="1110" y="540">PIVOT</text><text x="1210" y="330">LOW-DRAG STATE</text><text x="1190" y="610">LOAD STATE</text></g>`,
  ),
  'hybrid-energy-loop.svg': shell(
    'HYBRID ENERGY LOOP',
    'Conceptual energy paths, not power measurements',
    `
    <g stroke-width="5"><rect x="110" y="330" width="300" height="180" rx="28" stroke="#f04b5c"/><rect x="650" y="210" width="300" height="160" rx="28" stroke="#52e5ff"/><rect x="650" y="540" width="300" height="160" rx="28" stroke="#52e5ff"/><circle cx="1300" cy="455" r="145" stroke="#dce4ef" stroke-width="20"/>
    <path d="M410 420H620" stroke="#f04b5c" marker-end="url(#arrow)"/><path d="M950 290Q1160 300 1240 390" stroke="#52e5ff" marker-end="url(#arrow)"/><path d="M1240 520Q1120 630 950 620" stroke="#52e5ff" marker-end="url(#arrow)"/><path d="M800 540V390" stroke="#52e5ff" marker-end="url(#arrow)"/></g>
    <g fill="#fff" stroke="none" font-family="Arial" font-size="27" text-anchor="middle"><text x="260" y="420">COMBUSTION</text><text x="260" y="458">ENGINE</text><text x="800" y="292">MOTOR / GENERATOR</text><text x="800" y="625">ENERGY STORE</text><text x="1300" y="462">REAR WHEELS</text></g>`,
  ),
  'suspension-load-path.svg': shell(
    'SUSPENSION LOAD PATH',
    'Conceptual front-view geometry and lateral load transfer',
    `
    <path d="M330 700V380M1270 700V380" stroke="#dce4ef" stroke-width="70"/><path d="M420 390L760 520M420 650L760 520M1180 390L840 520M1180 650L840 520" stroke="#52e5ff" stroke-width="16"/>
    <rect x="700" y="430" width="200" height="210" rx="35" stroke="#f04b5c" stroke-width="12"/><circle cx="800" cy="520" r="18" fill="#fff" stroke="none"/><path d="M800 515L1080 515" stroke="#f04b5c" stroke-width="8" marker-end="url(#arrow)"/><path d="M330 330V180M1270 330V110" stroke="#52e5ff" stroke-width="8" marker-end="url(#arrow)"/>
    <g fill="#fff" stroke="none" font-family="Arial" font-size="24" text-anchor="middle"><text x="800" y="690">CHASSIS</text><text x="800" y="485">ROLL CENTRE</text><text x="330" y="760">INSIDE TYRE</text><text x="1270" y="760">OUTSIDE TYRE</text><text x="990" y="490">LATERAL LOAD TRANSFER</text></g>`,
  ),
};

await mkdir(outputDir, { recursive: true });
let mismatch = false;
for (const [name, content] of Object.entries(assets)) {
  const filePath = path.join(outputDir, name);
  if (checkOnly) {
    const current = await readFile(filePath, 'utf8').catch(() => '');
    if (current !== content) {
      mismatch = true;
      console.error(`MISMATCH ${path.relative(process.cwd(), filePath)}`);
    }
  } else {
    await writeFile(filePath, content, 'utf8');
    console.log(`WROTE ${path.relative(process.cwd(), filePath)}`);
  }
}
if (mismatch) process.exitCode = 1;
