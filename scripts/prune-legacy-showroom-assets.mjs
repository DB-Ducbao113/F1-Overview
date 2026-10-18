import fs from 'node:fs/promises';
import path from 'node:path';

const legacyTargets = [
  'dist/models/c42.v2.glb',
  'dist/textures/wheel_base.webp',
  'dist/images/showroom/closeups',
  'dist/images/showroom/schematics',
  'dist/images/showroom/wings_drs.webp',
  'dist/images/showroom/power_unit.webp',
  'dist/images/showroom/pirelli_tires.webp',
  'dist/images/showroom/halo_safety.webp',
  'dist/images/showroom/sidepods_cooling.webp',
];

for (const relativeTarget of legacyTargets) {
  const target = path.resolve(relativeTarget);
  const distRoot = `${path.resolve('dist')}${path.sep}`;
  if (!target.startsWith(distRoot)) throw new Error(`Refusing to prune outside dist: ${target}`);
  await fs.rm(target, { recursive: true, force: true });
}

const remaining = [];
for (const relativeTarget of legacyTargets) {
  try {
    await fs.access(path.resolve(relativeTarget));
    remaining.push(relativeTarget);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
if (remaining.length > 0)
  throw new Error(`Legacy commercial-release assets remain in dist: ${remaining.join(', ')}`);

await fs.access(path.resolve('dist/models/eds-g01.glb'));
await fs.access(path.resolve('dist/images/showroom/eds-g01/schematic.svg'));
console.log(
  `Commercial artifact guard: removed ${legacyTargets.length} legacy Showroom targets and verified original EDS assets.`,
);
