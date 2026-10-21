import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const validatorRoot = process.env.EDS_G03_VALIDATOR_DIR;
if (!validatorRoot)
  throw new Error('Set EDS_G03_VALIDATOR_DIR to the isolated Khronos validator install');
const require = createRequire(import.meta.url);
const validator = require(path.join(validatorRoot, 'node_modules', 'gltf-validator'));
const file = path.resolve(process.argv[2] || 'public/models/eds-g03-preview.glb');
const output = path.resolve(
  process.argv[3] || 'docs/commercialization/r3/evidence/r3-2-revision-5/khronos-validation.json',
);
const bytes = await fs.readFile(file);
const report = await validator.validateBytes(new Uint8Array(bytes), {
  uri: path.basename(file),
  maxIssues: 0,
});
const result = {
  file: path.relative(process.cwd(), file).replaceAll('\\', '/'),
  sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  bytes: bytes.length,
  validatorVersion: report.validatorVersion,
  issues: report.issues,
};
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (report.issues.numErrors || report.issues.numWarnings) process.exitCode = 1;
