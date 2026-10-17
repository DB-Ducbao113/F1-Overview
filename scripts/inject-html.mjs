import * as fs from 'fs';
import * as path from 'path';

const INJECT_SCRIPT = `
<script>
(() => {
  window.__bench = {
    workerCreated: false,
    workerScript: null,
    workerPatched: true,
    errors: [],
  };
  try {
    const orig = window.Worker;
    window.Worker = function(url, opts) {
      window.__bench.workerCreated = true;
      window.__bench.workerScript = String(url || '');
      return new orig(url, opts);
    };
  } catch (e) {
    window.__bench.workerPatchError = String(e);
  }
})();
</script>
`;

const files = [
  'dist-baseline/index.html',
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`SKIP: ${file} not found`);
    continue;
  }
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('window.__bench')) {
    console.log(`SKIP: ${file} already instrumented`);
    continue;
  }
  // Insert before </head>
  c = c.replace('</head>', INJECT_SCRIPT + '</head>');
  fs.writeFileSync(file, c);
  console.log(`INJECTED: ${file}`);
}