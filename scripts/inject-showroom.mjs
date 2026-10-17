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
  'dist-worker/assets/index-Bpqcd1AQ.js',
  'dist-worker/assets/index-BB-pzTkF.js',
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
  // Insert before </head> for HTML files, or at the beginning for JS files
  if (file.endsWith('.html')) {
    c = c.replace('</head>', INJECT_SCRIPT + '</head>');
  } else {
    c = INJECT_SCRIPT + '\n' + c;
  }
  fs.writeFileSync(file, c);
  console.log(`INSTRUMENTED: ${file}`);
}