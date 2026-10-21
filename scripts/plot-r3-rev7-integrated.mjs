import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs/commercialization/r3/evidence/r3-2-revision-7');
const prototypeRoot = path.resolve('docs/commercialization/r3/evidence/r3-2-revision-7-prototypes');
const baseline = JSON.parse(await fs.readFile(path.join(root, 'baseline-diffuser-topology.json')));
const candidate = JSON.parse(await fs.readFile(path.join(root, 'diffuser-topology.json')));
const prototype = JSON.parse(await fs.readFile(path.join(prototypeRoot, 'geometry.json'))).prototypes['diffuser-A-rounded'].exit;
const sections = [
  { name: 'Revision 6 baseline lower shell', points: baseline.exitSectionXY, color: '#a2b3bf', minimum: baseline.exitMinimumGroundClearanceMetres },
  { name: 'Selected Prototype A open passage', points: prototype.profileXY, color: '#f0bc5d', minimum: prototype.minimumYMetres },
  { name: 'Revision 7 integrated attempt', points: candidate.exitSectionXY, color: '#75c8e9', minimum: candidate.exitMinimumGroundClearanceMetres },
];
const panel = (item, index) => {
  const left = 55 + index * 545;
  const ground = 465;
  const x = (metres) => left + 258 + metres * 415;
  const y = (metres) => ground - metres * 720;
  const polyline = item.points.map(([px, py]) => `${x(px).toFixed(1)},${y(py).toFixed(1)}`).join(' ');
  const ticks = [0.1, 0.2, 0.3, 0.4].map((value) => `<path d="M${left} ${y(value)}h516" stroke="#314453" stroke-dasharray="4 5"/><text x="${left + 4}" y="${y(value) - 4}" fill="#9aaebb" font-size="12">${value.toFixed(2)}m</text>`).join('');
  return `<text x="${left}" y="73" fill="#fff" font-size="18">${item.name}</text><text x="${left}" y="97" fill="#b8c9d2" font-size="14">exit width 1.160m · sampled minimum Y ${item.minimum.toFixed(3)}m</text><rect x="${left}" y="120" width="516" height="345" fill="#0a1b27" stroke="#405567"/>${ticks}<polyline points="${polyline}" fill="none" stroke="${item.color}" stroke-width="2.5" stroke-linejoin="round"/>`;
};
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1700" height="525" viewBox="0 0 1700 525"><rect width="1700" height="525" fill="#071018"/><g font-family="Arial"><text x="55" y="36" fill="#fff" font-size="24">EDS-G03 rear outlet section at Z≈2.30m / +Y up</text>${sections.map(panel).join('')}<text x="55" y="503" fill="#a5bac8" font-size="13">Revision 6 and integrated candidate are closed BODY shell samples; Prototype A is an open-bottom review specimen. Lines are not equivalent watertight cross-sections.</text></g></svg>`;
await fs.writeFile(path.join(root, 'diffuser-cross-sections.svg'), svg);
console.log(path.join(root, 'diffuser-cross-sections.svg'));
