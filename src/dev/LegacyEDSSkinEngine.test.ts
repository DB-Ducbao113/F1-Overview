import { describe, expect, it } from 'vitest';
import { getLegacySkinArtDirection, getLegacySkinSlot } from './LegacyEDSSkinEngine';

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

  it('keeps Carbon Heritage and Studio Stealth materially distinct', () => {
    const heritage = getLegacySkinArtDirection('eds-carbon');
    const stealth = getLegacySkinArtDirection('eds-monochrome');
    expect(heritage.style).toBe('heritage');
    expect(stealth.style).toBe('stealth');
    expect(heritage.weaveStrength).toBeGreaterThan(stealth.weaveStrength);
    expect(heritage.paintClearcoat).toBeGreaterThan(stealth.paintClearcoat);
  });

  it('uses restrained accent proportions for the bright palettes', () => {
    for (const id of ['eds-aero', 'eds-crimson', 'eds-gold', 'eds-electric']) {
      expect(getLegacySkinArtDirection(id).accentOpacity).toBeLessThanOrEqual(0.7);
    }
  });
});
