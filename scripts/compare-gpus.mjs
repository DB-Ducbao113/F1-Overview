import fs from 'fs';
import path from 'path';

const SUITES = [
  { id: 'baseline', label: 'Baseline (Pre-Opt Intel UHD)', gpu: 'Intel UHD 630', mode: 'Baseline' },
  { id: 'high-intel', label: 'High (Intel UHD)', gpu: 'Intel UHD 630', mode: 'High' },
  { id: 'average-intel', label: 'Average (Intel UHD)', gpu: 'Intel UHD 630', mode: 'Average' },
  {
    id: 'performance-intel',
    label: 'Performance (Intel UHD)',
    gpu: 'Intel UHD 630',
    mode: 'Performance',
  },
  { id: 'auto-intel', label: 'Auto (Intel UHD)', gpu: 'Intel UHD 630', mode: 'Auto' },
  {
    id: 'high-nvidia',
    label: 'High (NVIDIA GTX 1650)',
    gpu: 'NVIDIA GTX 1650 Max-Q',
    mode: 'High',
  },
  {
    id: 'average-nvidia',
    label: 'Average (NVIDIA GTX 1650)',
    gpu: 'NVIDIA GTX 1650 Max-Q',
    mode: 'Average',
  },
  {
    id: 'performance-nvidia',
    label: 'Performance (NVIDIA GTX 1650)',
    gpu: 'NVIDIA GTX 1650 Max-Q',
    mode: 'Performance',
  },
  {
    id: 'auto-nvidia',
    label: 'Auto (NVIDIA GTX 1650)',
    gpu: 'NVIDIA GTX 1650 Max-Q',
    mode: 'Auto',
  },
];

export function generateComparisonTable() {
  const tableData = [];

  for (const s of SUITES) {
    const jsonPath = path.resolve('benchmark-artifacts', s.id, `${s.id}-results.json`);
    if (!fs.existsSync(jsonPath)) {
      continue;
    }

    try {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const sc = data.scenarios || {};
      const load = sc.initialLoad || {};
      const orbit = sc.continuousOrbit || {};
      const stats = orbit.stats?.render || {};
      const memStress = sc.memoryLeakStress || {};

      tableData.push({
        suite: s.label,
        gpu: s.gpu,
        mode: s.mode,
        initialLoadMs: load.loadDurationMs ?? 'N/A',
        avgFPS: orbit.avgFPS ?? 'N/A',
        low1FPS: orbit.low1PercentFPS ?? 'N/A',
        avgFrameTimeMs: orbit.avgFrameTimeMs ?? 'N/A',
        p95FrameTimeMs: orbit.p95FrameTimeMs ?? 'N/A',
        drawCalls: stats.calls ?? 'N/A',
        triangles: stats.triangles ?? 'N/A',
        heapMB: orbit.heapMB ?? 'N/A',
        heapDeltaMB: memStress.heapDeltaMB ?? 'N/A',
      });
    } catch (err) {
      console.error(`Error reading ${s.id}:`, err.message);
    }
  }

  return tableData;
}

if (process.argv[1]?.endsWith('compare-gpus.mjs')) {
  const table = generateComparisonTable();
  console.log(
    '\n========================================================================================',
  );
  console.log(' SHOWROOM 3D GPU ARCHITECTURE & PERFORMANCE COMPARISON MATRIX');
  console.log(
    ' Reference Hardware: Intel Core i7-10750H / NVIDIA GeForce GTX 1650 with Max-Q Design',
  );
  console.log(
    '========================================================================================\n',
  );
  console.table(table);
}
