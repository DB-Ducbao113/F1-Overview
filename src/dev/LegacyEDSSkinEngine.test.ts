import { describe, expect, it } from 'vitest';
import { getLegacySkinSlot } from './LegacyEDSSkinEngine';

describe('legacy EDS skin material routing', () => {
  it.each([
    ['Default_OBJ.001', 'floor'],
    ['Default_OBJ.002', 'cockpit'],
    ['Default_OBJ.003', 'suspension'],
    ['Default_OBJ.004', 'bodywork'],
    ['Default_OBJ.005', 'wings'],
    ['Default_OBJ.006', 'wheels'],
    ['Default_OBJ.007', 'nose'],
    ['Default_OBJ.008', 'halo'],
    ['Default_OBJ.009', 'diffuser'],
  ])('maps %s to %s', (material, expected) => {
    expect(getLegacySkinSlot(material)).toBe(expected);
  });

  it('falls back unknown surfaces to bodywork paint', () => {
    expect(getLegacySkinSlot('unknown')).toBe('bodywork');
  });
});
