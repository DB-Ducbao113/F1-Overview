import fs from 'node:fs/promises';
import path from 'node:path';

const legacyNames = ['c42.v2.glb', 'wheel_base.webp'];
const candidates = [path.resolve('dist/models'), path.resolve('dist/textures')];

for (const directory of candidates) {
  for (const name of legacyNames) {
    const target = path.join(directory, name);
    await fs.rm(target, { force: true });
  }
}

const remaining = [];
for (const directory of candidates) {
  try {
    for (const name of await fs.readdir(directory)) {
      if (legacyNames.includes(name)) remaining.push(path.join(directory, name));
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

if (remaining.length > 0) {
  throw new Error(`Legacy commercial-release assets remain in dist: ${remaining.join(', ')}`);
}

console.log('Commercial artifact guard: legacy C42 geometry and branded wheel texture excluded.');
