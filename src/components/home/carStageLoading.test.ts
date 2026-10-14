import { describe, expect, it } from 'vitest';
import { getNearbyCarIndexes, INITIAL_CAR_INDEX } from './carStageLoading';

describe('car stage image loading', () => {
  it('loads only the initial car and its two wrapped neighbours', () => {
    expect(getNearbyCarIndexes(INITIAL_CAR_INDEX, 11)).toEqual([10, 0, 1]);
  });

  it('moves the three-image window with carousel navigation', () => {
    expect(getNearbyCarIndexes(5, 11)).toEqual([4, 5, 6]);
    expect(getNearbyCarIndexes(10, 11)).toEqual([9, 10, 0]);
  });

  it('handles empty and short carousels without duplicate entries', () => {
    expect(getNearbyCarIndexes(0, 0)).toEqual([]);
    expect(getNearbyCarIndexes(0, 1)).toEqual([0]);
    expect(getNearbyCarIndexes(0, 2)).toEqual([1, 0]);
  });
});
