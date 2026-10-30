import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  detectInitialQualityTier,
  getSavedQualityMode,
  saveQualityMode,
  resolveQualityProfile,
  RollingFrameMetrics,
  QUALITY_STORAGE_KEY,
} from './showroomQuality';

describe('showroomQuality', () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => mockStorage[k] ?? null,
      setItem: (k: string, v: string) => {
        mockStorage[k] = v;
      },
      removeItem: (k: string) => {
        delete mockStorage[k];
      },
      clear: () => {
        Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
      },
    });
    vi.restoreAllMocks();
  });

  describe('detectInitialQualityTier', () => {
    it('returns average for mobile by default', () => {
      const tier = detectInitialQualityTier(true);
      expect(['average', 'performance']).toContain(tier);
    });

    it('returns high or average for desktop', () => {
      const tier = detectInitialQualityTier(false);
      expect(['high', 'average']).toContain(tier);
    });
  });

  describe('getSavedQualityMode & saveQualityMode', () => {
    it('defaults to auto when no storage exists', () => {
      expect(getSavedQualityMode()).toBe('auto');
    });

    it('saves and retrieves quality mode', () => {
      saveQualityMode('performance');
      expect(getSavedQualityMode()).toBe('performance');

      saveQualityMode('high');
      expect(getSavedQualityMode()).toBe('high');

      saveQualityMode('average');
      expect(getSavedQualityMode()).toBe('average');

      saveQualityMode('auto');
      expect(getSavedQualityMode()).toBe('auto');
    });

    it('ignores invalid values in localStorage', () => {
      localStorage.setItem(QUALITY_STORAGE_KEY, 'ultra_mega_max');
      expect(getSavedQualityMode()).toBe('auto');
    });
  });

  describe('resolveQualityProfile', () => {
    it('resolves desktop profiles correctly', () => {
      const highProfile = resolveQualityProfile('high', 'average', false);
      expect(highProfile.tier).toBe('high');
      expect(highProfile.mirrorFloor).toBe(true);
      expect(highProfile.shadows).toBe(true);
      expect(highProfile.materialQuality).toBe('physical');
      expect(highProfile.lightingMode).toBe('cinematic');
      expect(highProfile.simplifyWallMeshes).toBe(false);

      const perfProfile = resolveQualityProfile('performance', 'high', false);
      expect(perfProfile.tier).toBe('performance');
      expect(perfProfile.mirrorFloor).toBe(false);
      expect(perfProfile.shadows).toBe(false);
      expect(perfProfile.materialQuality).toBe('standard');
      expect(perfProfile.lightingMode).toBe('essential');
      expect(perfProfile.simplifyWallMeshes).toBe(true);
    });

    it('resolves auto mode to the current dynamic tier', () => {
      const autoAvg = resolveQualityProfile('auto', 'average', false);
      expect(autoAvg.tier).toBe('average');
      expect(autoAvg.materialQuality).toBe('standard');

      const autoHigh = resolveQualityProfile('auto', 'high', false);
      expect(autoHigh.tier).toBe('high');
      expect(autoHigh.mirrorFloor).toBe(true);
    });

    it('resolves mobile profiles with mobile constraints', () => {
      const mobileAvg = resolveQualityProfile('average', 'high', true);
      expect(mobileAvg.tier).toBe('average');
      expect(mobileAvg.mirrorFloor).toBe(false); // Mobile average disables reflector
      expect(mobileAvg.dpr).toEqual([0.85, 1.0]);
    });
  });

  describe('RollingFrameMetrics', () => {
    it('computes rolling average, p95, and 1% low', () => {
      const metrics = new RollingFrameMetrics(60);
      expect(metrics.count).toBe(0);

      // Add 55 frames of 16.66ms (~60fps) and 5 slow frames
      for (let i = 0; i < 55; i++) {
        metrics.add(16.66);
      }
      for (let i = 0; i < 5; i++) {
        metrics.add(33.33); // ~30fps
      }

      expect(metrics.count).toBe(60);
      expect(metrics.averageFrameTime).toBeGreaterThan(16.66);
      expect(metrics.averageFps).toBeLessThan(60);
      expect(metrics.getP95FrameTime()).toBeGreaterThan(16.66);
      expect(metrics.getLow1PercentFps()).toBeLessThan(60);
    });

    it('filters out negative or extreme non-render pause anomalies (>500ms)', () => {
      const metrics = new RollingFrameMetrics(10);
      metrics.add(-5);
      metrics.add(1000);
      metrics.add(16.6);

      expect(metrics.count).toBe(1);
      expect(metrics.averageFrameTime).toBeCloseTo(16.6, 1);
    });
  });
});
