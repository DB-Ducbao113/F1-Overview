import fs from 'node:fs/promises';
import path from 'node:path';

const target = path.resolve('src/data/championship/circuitReviewPoints.ts');
const source = await fs.readFile(target, 'utf8');
let circuitId = null;
let replacementCount = 0;

const output = source
  .split(/\r?\n/)
  .map((line) => {
    const circuitMatch = line.match(/^\s+circuitId: '([^']+)',/);
    if (circuitMatch) circuitId = circuitMatch[1];
    if (!/^\s+imageUrl:\s*['"]/.test(line)) return line;
    if (!circuitId) throw new Error('Encountered imageUrl before circuitId.');
    replacementCount += 1;
    const indentation = line.match(/^\s*/)?.[0] ?? '';
    return `${indentation}imageUrl: '/images/eds/circuits/${circuitId}.svg',`;
  })
  .join('\n');

if (replacementCount !== 77) {
  throw new Error(`Expected 77 circuit checkpoint images, replaced ${replacementCount}.`);
}

await fs.writeFile(target, `${output.replace(/\n*$/, '')}\n`, 'utf8');
console.log(`Replaced ${replacementCount} circuit image references with local EDS assets.`);
