/**
 * Motion contract for the authored R4.5 Blender assembly.
 *
 * Authoring manifest: +X forward, +Y left, +Z up.
 * GLB after export:   +X forward, +Y up,   -Z left.
 *
 * All functions are pure: the same progress always yields the same pose.
 * Never add deltas to an object's current transform.
 */
export type Vec3 = readonly [number, number, number];
export type MotionPart = {
  node: string;
  offset: Vec3;
  animationOrder?: number;
};

export const clamp01 = (progress: number): number =>
  Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;

export function smoothstep(progress: number): number {
  const t = clamp01(progress);
  return t * t * (3 - 2 * t);
}

export function sourceToGltf([x, y, z]: Vec3): Vec3 {
  return [x, z, -y];
}

/** Global exploded-view envelope. At 0 all meshes MUST be at original position. */
export function assemblyWeight(progress: number, order: number, total: number): number {
  const stagger = total > 1 ? (order / (total - 1)) * 0.22 : 0;
  return smoothstep((clamp01(progress) - stagger) / 0.76);
}

/** Component disassembly happens after its parent assembly has opened. */
export function componentWeight(progress: number, animationOrder: number, focused: boolean): number {
  if (!focused) return 0;
  const start = 0.32 + Math.max(0, animationOrder) * 0.065;
  return smoothstep((clamp01(progress) - start) / 0.27);
}

export function poseFromOrigin(origin: Vec3, authoredOffset: Vec3, weight: number): Vec3 {
  const [dx, dy, dz] = sourceToGltf(authoredOffset);
  const t = clamp01(weight);
  return [origin[0] + dx * t, origin[1] + dy * t, origin[2] + dz * t];
}

export function isMotionPart(value: unknown): value is MotionPart {
  if (!value || typeof value !== 'object') return false;
  const part = value as { node?: unknown; offset?: unknown };
  return (
    typeof part.node === 'string' &&
    part.node.length > 0 &&
    Array.isArray(part.offset) &&
    part.offset.length === 3 &&
    part.offset.every((v: unknown) => typeof v === 'number' && Number.isFinite(v))
  );
}
