import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const validatorRoot = process.env.EDS_G03_VALIDATOR_DIR;
if (!validatorRoot)
  throw new Error('Set EDS_G03_VALIDATOR_DIR to the isolated Khronos validator install');
const require = createRequire(import.meta.url);
const validator = require(path.join(validatorRoot, 'node_modules', 'gltf-validator'));
const output = path.resolve('docs/commercialization/r3/gdr/evidence');
const names = [
  'diffuser-rev4',
  'diffuser-A-profile',
  'diffuser-B-resection',
  'halo-rev4',
  'halo-A-fairing',
  'halo-B-welded',
];
const results = {};
for (const name of names) {
  const file = path.join(output, `${name}.glb`);
  const bytes = await fs.readFile(file);
  const report = await validator.validateBytes(new Uint8Array(bytes), {
    uri: `${name}.glb`,
    maxIssues: 0,
  });
  results[name] = {
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    version: report.validatorVersion,
    issues: report.issues,
  };
  if (report.issues.numErrors || report.issues.numWarnings) process.exitCode = 1;
}
await fs.writeFile(
  path.join(output, 'khronos-validation.json'),
  `${JSON.stringify(results, null, 2)}\n`,
);
console.log(JSON.stringify(results, null, 2));
