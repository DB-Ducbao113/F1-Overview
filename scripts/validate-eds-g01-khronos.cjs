const fs = require('node:fs');
const validator = require('gltf-validator');

const filename = process.argv[2] || 'public/models/eds-g01.glb';
const asset = new Uint8Array(fs.readFileSync(filename));

validator
  .validateBytes(asset, { uri: filename, maxIssues: 100 })
  .then((report) => {
    const result = {
      validatorVersion: report.validatorVersion,
      validatedAt: report.validatedAt,
      issues: report.issues,
      info: report.info,
    };
    console.log(JSON.stringify(result, null, 2));
    if (report.issues.numErrors > 0 || report.issues.numWarnings > 0) process.exitCode = 1;
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
