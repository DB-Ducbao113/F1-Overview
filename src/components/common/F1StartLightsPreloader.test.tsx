import { describe, expect, it } from 'vitest';
import { getStartLightsFrame, START_LIGHT_TIMING } from './startLightsTiming';

describe('start lights timing', () => {
  it('completes the complete light sequence within 1.5 seconds', () => {
    expect(START_LIGHT_TIMING.totalMs).toBeLessThanOrEqual(1500);
  });

  it.each([
    [0, 'awakening', 0],
    [119, 'awakening', 0],
    [120, 'pressure', 1],
    [300, 'pressure', 2],
    [840, 'pressure', 5],
    [1079, 'pressure', 5],
    [1080, 'hold', 5],
    [1259, 'hold', 5],
    [1260, 'lights-out', 0],
    [1359, 'lights-out', 0],
    [1360, 'launch', 0],
    [1499, 'launch', 0],
    [1500, 'complete', 0],
  ])('at %d ms shows %s with %d red columns', (time, phase, litColumns) => {
    expect(getStartLightsFrame(time)).toEqual({ phase, litColumns });
  });
});
