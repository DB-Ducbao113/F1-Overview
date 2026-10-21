import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('docs/commercialization/r3/evidence/r3-2-revision-6');
const before = JSON.parse(await fs.readFile(path.join(root, 'diffuser-rev5-topology.json')));
const after = JSON.parse(await fs.readFile(path.join(root, 'integrated-diffuser-topology.json')));
const reduce = (points, increment) => {
  const bins = new Map();
  for (const [axis, y] of points) {
    const key = Math.round(axis / increment) * increment;
    bins.set(key, Math.min(bins.get(key) ?? Infinity, y));
  }
  return [...bins].sort((a, b) => a[0] - b[0]);
};
const section = [reduce(before.exitSectionXY, 0.02), reduce(after.exitSectionXY, 0.02)];
const longitudinal = [
  reduce(before.channelLongitudinalZY, 0.03),
  reduce(after.channelLongitudinalZY, 0.03),
];
function chart(x, y, width, height, domainX, domainY, sets, title, xLabel) {
  const sx = (value) => x + ((value - domainX[0]) / (domainX[1] - domainX[0])) * width;
  const sy = (value) => y + height - ((value - domainY[0]) / (domainY[1] - domainY[0])) * height;
  const colors = ['#8ca2b1', '#f2b84b'];
  const lines = sets.map((points, index) => `<polyline fill="none" stroke="${colors[index]}" stroke-width="2.5" points="${points.map(([a, b]) => `${sx(a).toFixed(1)},${sy(b).toFixed(1)}`).join(' ')}"/>`).join('');
  return `<text x="${x}" y="${y - 22}" fill="#edf4f8" font-size="20">${title}</text><rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#0d1822" stroke="#496071"/><path d="M${x} ${sy(0.1)}H${x + width} M${x} ${sy(0.2)}H${x + width} M${x} ${sy(0.3)}H${x + width}" stroke="#31414e" stroke-dasharray="4 5"/>${lines}<text x="${x}" y="${y + height + 27}" fill="#b7c7d2">${xLabel} / metres</text><text x="${x + width - 90}" y="${y + 20}" fill="#b7c7d2">Y / metres</text>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="560" viewBox="0 0 1500 560"><rect width="1500" height="560" fill="#071018"/><text x="42" y="43" fill="#fff" font-family="Arial" font-size="25">EDS-G03 R3.2 Rev5 vs Rev6 / diffuser geometry</text><g font-family="Arial">${chart(45, 105, 665, 350, [-0.6, 0.6], [0.08, 0.44], section, 'Lower trailing-edge cross-section, Z = 2.30 m', 'X')}${chart(785, 105, 665, 350, [1.5, 2.3], [0.08, 0.44], longitudinal, 'Channel longitudinal lower profile, |X| ~ 0.30 m', 'Z')}<path d="M50 510H90" stroke="#8ca2b1" stroke-width="3"/><text x="100" y="516" fill="#e6eef3">Revision 5 baseline</text><path d="M320 510H360" stroke="#f2b84b" stroke-width="3"/><text x="370" y="516" fill="#e6eef3">Revision 6 candidate</text></g></svg>`;
await fs.writeFile(path.join(root, 'diffuser-cross-sections.svg'), svg);
console.log(path.join(root, 'diffuser-cross-sections.svg'));
