import * as fs from 'fs';
const r = JSON.parse(fs.readFileSync('bench-results-mobile/raw-results.json', 'utf8'));
for (const item of r.results) {
  if (!item.failed) {
    console.log(`${item.variant.padEnd(8)} run ${(item.runIndex + 1).toString().padStart(2)}: workerCreated=${item.workerCreated}, workerScript=${item.workerScript || 'null'}, fuf=${item.firstUsableFrameMs}, compile=${item.compileMs}`);
  }
}