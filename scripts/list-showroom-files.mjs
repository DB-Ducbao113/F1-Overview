import * as fs from 'fs';
import * as path from 'path';

const dir = process.argv[2] || 'dist-baseline/assets';
const files = fs.readdirSync(dir);
const showroomFiles = files.filter(f => f.toLowerCase().includes('showroom'));
console.log(`Files containing "Showroom" in ${dir}:`);
for (const f of showroomFiles) {
  console.log(`  ${f}`);
}