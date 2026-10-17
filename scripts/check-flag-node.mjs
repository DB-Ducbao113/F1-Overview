/**
 * Check the compiled EXPERIMENTAL_WORKER_GLTF flag value in a built asset.
 */
import * as fs from 'fs';
import * as path from 'path';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node check-flag-node.mjs <path-to-js-file>');
  process.exit(1);
}

const c = fs.readFileSync(filePath, 'utf8');

// Check if import.meta.env.VITE_EXPERIMENTAL_WORKER_GLTF is present (not substituted)
if (c.includes("import.meta.env.VITE_EXPERIMENTAL_WORKER_GLTF")) {
  console.log('NOT_SUBSTITUTED: import.meta.env.VITE_EXPERIMENTAL_WORKER_GLTF still present');
  process.exit(0);
}

// Check for boolean literal
if (c.match(/==='true'/)) {
  console.log('FLAG: TRUE');
} else if (c.match(/==='false'/)) {
  console.log('FLAG: FALSE');
} else if (c.match(/==\s*true/)) {
  console.log('FLAG: TRUE (== true)');
} else if (c.match(/==\s*false/)) {
  console.log('FLAG: FALSE (== false)');
} else {
  // Search for the variable name to see how it's used
  const idx = c.indexOf('EXPERIMENTAL_WORKER_GLTF');
  if (idx >= 0) {
    console.log(`FOUND_EXPERIMENTAL_WORKER_GLTF at index ${idx}`);
    console.log(`  Context: ...${c.substring(Math.max(0, idx - 50), idx + 100)}...`);
  } else {
    console.log('FLAG_NOT_FOUND: EXPERIMENTAL_WORKER_GLTF not found in file');
  }
}