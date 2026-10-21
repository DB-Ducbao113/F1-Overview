import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs/commercialization/r3/evidence/r3-2-revision-7-prototypes');
const source = JSON.parse(await fs.readFile(path.join(root, 'geometry.json')));
const specs = [
  ['A · rounded parallel tunnels', source.prototypes['diffuser-A-rounded'].exit, 60],
  ['B · flared bevelled Venturi', source.prototypes['diffuser-B-flared'].exit, 830],
];
const charts = specs.map(([name, exit, left]) => {
  const points = exit.profileXY.map(([x, y]) => `${left + 300 + x * 460},${410 - (y - 0.08) * 1000}`).join(' ');
  const ticks = [0.1, 0.2, 0.3].map((y) => `<path d="M${left} ${410 - (y - 0.08) * 1000}h600" stroke="#32495a" stroke-dasharray="5 6"/><text x="${left + 8}" y="${404 - (y - 0.08) * 1000}" fill="#b6c6d1" font-size="12">Y ${y.toFixed(2)}</text>`).join('');
  return `<text x="${left}" y="85" fill="#f1f7fb" font-size="21">${name}</text><text x="${left}" y="111" fill="#abc6d4" font-size="15">exit width ${exit.widthMetres.toFixed(3)} m · lower lip ${exit.minimumYMetres.toFixed(3)} m</text><rect x="${left}" y="130" width="600" height="280" fill="#0b1b27" stroke="#536d7e"/>${ticks}<polyline points="${points}" fill="none" stroke="#f2bc5a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M${left} 440h600" stroke="#6f8fa2"/><text x="${left + 240}" y="465" fill="#abc6d4" font-size="14">X / metres</text>`;
}).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="510" viewBox="0 0 1500 510"><rect width="1500" height="510" fill="#071018"/><g font-family="Arial"><text x="60" y="42" fill="#fff" font-size="25">EDS-G03 R3.2 Revision 7 / authored diffuser exit profiles (Z = +2.30 m)</text>${charts}</g></svg>`;
await fs.writeFile(path.join(root, 'diffuser-exit-profiles.svg'), svg);
console.log(path.join(root, 'diffuser-exit-profiles.svg'));
