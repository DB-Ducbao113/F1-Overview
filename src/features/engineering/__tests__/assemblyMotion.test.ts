import { describe, expect, it } from 'vitest';
import { R45_COMPONENTS } from '../data/r45Components';
import {
  assemblyWeight,
  clamp01,
  componentWeight,
  isMotionPart,
  poseFromOrigin,
  sourceToGltf,
} from '../domain/assemblyMotion';

describe('R4.5 assembly motion contract', () => {
  it('converts Blender Z-up vectors to GLB Y-up exactly', () => {
    expect(sourceToGltf([0.1, 0.72, 0.08])).toEqual([0.1, 0.08, -0.72]);
    expect(sourceToGltf([0.1, -0.72, 0.08])).toEqual([0.1, 0.08, 0.72]);
    expect(sourceToGltf([0, 0, -0.54])).toEqual([0, -0.54, -0]);
  });

  it('is fully assembled at zero for all global assembly phases', () => {
    for (let index = 0; index < 10; index++) {
      expect(assemblyWeight(0, index, 10)).toBe(0);
    }
  });

  it('is fully exploded at the last timeline frame', () => {
    for (let index = 0; index < 10; index++) {
      expect(assemblyWeight(1, index, 10)).toBe(1);
    }
  });

  it('produces identical poses after forward, backward and direct seeks', () => {
    const origin: [number, number, number] = [1.25, 0.37, -0.83];
    const offset: [number, number, number] = [0.1, 0.72, 0.08];
    const initial = poseFromOrigin(origin, offset, assemblyWeight(0, 0, 10));
    const final = poseFromOrigin(origin, offset, assemblyWeight(1, 0, 10));
    const back = poseFromOrigin(origin, offset, assemblyWeight(0, 0, 10));
    expect(initial).toEqual(origin);
    expect(back).toEqual(initial);
    expect(final[0]).toBeCloseTo(1.35, 10);
    expect(final[1]).toBeCloseTo(0.45, 10);
    expect(final[2]).toBeCloseTo(-1.55, 10);
    expect(poseFromOrigin(origin, offset, assemblyWeight(0.5, 0, 10))).toEqual(
      poseFromOrigin(origin, offset, assemblyWeight(0.5, 0, 10)),
    );
  });

  it('never separates unselected component interiors', () => {
    expect(componentWeight(1, 0, false)).toBe(0);
    expect(componentWeight(0, 0, true)).toBe(0);
    expect(componentWeight(1, 0, true)).toBe(1);
    expect(componentWeight(1, 6, true)).toBe(1);
  });

  it('clamps invalid and out-of-range timeline values', () => {
    expect(clamp01(Number.NaN)).toBe(0);
    expect(clamp01(Number.POSITIVE_INFINITY)).toBe(0);
    expect(clamp01(-100)).toBe(0);
    expect(clamp01(200)).toBe(1);
  });

  it('keeps all 65 unique source-authored component paths in the V2 contract', () => {
    expect(R45_COMPONENTS).toHaveLength(65);
    const nodes = R45_COMPONENTS.map(([name]) => name);
    expect(new Set(nodes).size).toBe(65);
    expect(R45_COMPONENTS.filter(([, assembly]) => assembly === 'POWERTRAIN')).toHaveLength(5);
    expect(R45_COMPONENTS.filter(([, assembly]) => assembly === 'FRONT_LEFT_WHEEL')).toHaveLength(7);
  });

  it('rejects malformed part metadata before animation', () => {
    expect(isMotionPart({ node: 'PEDS_FRONT_WING', offset: [0.92, 0, 0.14] })).toBe(true);
    expect(isMotionPart({ node: 'bad', offset: [0, NaN, 0] })).toBe(false);
    expect(isMotionPart({ node: '', offset: [0, 1, 0] })).toBe(false);
    expect(isMotionPart(null)).toBe(false);
  });
});
