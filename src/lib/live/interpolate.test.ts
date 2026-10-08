import { describe, it, expect } from 'vitest';
import { lerp, interpolateCar } from './interpolate';
import { LiveCarPosition } from './openf1-types';

describe('interpolate - Lerp and Fleet Interpolation', () => {
  it('lerps correctly at t=0, t=0.5, t=1', () => {
    expect(lerp(100, 200, 0)).toBe(100);
    expect(lerp(100, 200, 0.5)).toBe(150);
    expect(lerp(100, 200, 1)).toBe(200);
  });

  it('clamps t between 0 and 1', () => {
    expect(lerp(100, 200, -0.5)).toBe(100);
    expect(lerp(100, 200, 1.5)).toBe(200);
  });

  it('interpolates car position between two states', () => {
    const prev: LiveCarPosition = {
      driver_number: 1,
      x: 100,
      y: 200,
      date: '2024-03-24T04:00:00Z',
    };
    const target: LiveCarPosition = {
      driver_number: 1,
      x: 200,
      y: 400,
      date: '2024-03-24T04:00:02Z',
    };

    const halfway = interpolateCar(prev, target, 0.5);
    expect(halfway.driver_number).toBe(1);
    expect(halfway.x).toBe(150);
    expect(halfway.y).toBe(300);
  });

  it('falls back to target if prev is undefined', () => {
    const target: LiveCarPosition = {
      driver_number: 44,
      x: 500,
      y: 600,
      date: '2024-03-24T04:00:00Z',
    };
    const res = interpolateCar(undefined, target, 0.5);
    expect(res).toEqual(target);
  });
});
