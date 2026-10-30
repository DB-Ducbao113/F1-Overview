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
    function mockEnvironment({
      renderer,
      cores = 8,
      memory = 8,
      hasDebugInfo = true,
    }: {
      renderer?: string;
      cores?: number | undefined;
      memory?: number | undefined;
      hasDebugInfo?: boolean;
    }) {
      const mockDoc = {
        createElement: (tagName: string) => {
          if (tagName === 'canvas') {
            return {
              getContext: (type: string) => {
                if (type.includes('webgl')) {
                  return {
                    getExtension: (ext: string) =>
                      hasDebugInfo && ext === 'WEBGL_debug_renderer_info'
                        ? { UNMASKED_RENDERER_WEBGL: 0x9246 }
                        : null,
                    getParameter: (param: number) => (param === 0x9246 ? (renderer ?? '') : ''),
                  };
                }
                return null;
              },
            };
          }
          return {};
        },
      };

      vi.stubGlobal('window', {});
      vi.stubGlobal('document', mockDoc);
      vi.stubGlobal('navigator', {
        hardwareConcurrency: cores,
        deviceMemory: memory,
      });
    }

    it('returns average or performance for mobile by default', () => {
      const tier = detectInitialQualityTier(true);
      expect(['average', 'performance']).toContain(tier);
    });

    it('returns performance for Intel UHD 630', () => {
      mockEnvironment({
        renderer:
          'ANGLE (Intel, Intel(R) UHD Graphics 630 (0x00009BC4) Direct3D11 vs_5_0 ps_5_0, D3D11)',
        cores: 12,
        memory: 16,
      });
      expect(detectInitialQualityTier(false)).toBe('performance');
    });

    it('returns high for dedicated NVIDIA GTX 1650 Max-Q', () => {
      mockEnvironment({
        renderer: 'ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 with Max-Q Design Direct3D11)',
        cores: 12,
        memory: 16,
      });
      expect(detectInitialQualityTier(false)).toBe('high');
    });

    it('returns performance for Integrated AMD Radeon (Vega / Radeon Graphics)', () => {
      mockEnvironment({
        renderer: 'AMD Radeon(TM) Graphics',
        cores: 8,
        memory: 16,
      });
      expect(detectInitialQualityTier(false)).toBe('performance');

      mockEnvironment({
        renderer: 'AMD Radeon Vega 8 Graphics',
        cores: 8,
        memory: 16,
      });
      expect(detectInitialQualityTier(false)).toBe('performance');
    });

    it('returns high for dedicated AMD Radeon RX with adequate cores', () => {
      mockEnvironment({
        renderer: 'AMD Radeon RX 6700 XT',
        cores: 12,
        memory: 16,
      });
      expect(detectInitialQualityTier(false)).toBe('high');
    });

    it('does not blindly assign high to Apple GPU on mobile devices', () => {
      mockEnvironment({
        renderer: 'Apple GPU',
        cores: 6,
        memory: 4,
      });
      expect(detectInitialQualityTier(true)).toBe('performance');

      mockEnvironment({
        renderer: 'Apple GPU',
        cores: 6,
        memory: 6,
      });
      expect(detectInitialQualityTier(true)).toBe('average');
    });

    it('assigns high to Apple Silicon desktop Macs with adequate cores', () => {
      mockEnvironment({
        renderer: 'Apple M2 Pro',
        cores: 10,
        memory: 16,
      });
      expect(detectInitialQualityTier(false)).toBe('high');
    });

    it('handles hidden or unknown GPU renderer gracefully with safe average', () => {
      mockEnvironment({
        renderer: '',
        hasDebugInfo: false,
        cores: 8,
        memory: 16,
      });
      expect(detectInitialQualityTier(false)).toBe('average');
    });

    it('handles missing deviceMemory and hardwareConcurrency without crashing', () => {
      mockEnvironment({
        renderer: 'ANGLE (Intel, Intel(R) UHD Graphics 630)',
        cores: undefined,
        memory: undefined,
      });
      expect(detectInitialQualityTier(false)).toBe('performance');

      mockEnvironment({
        renderer: 'NVIDIA GeForce RTX 4070',
        cores: undefined,
        memory: undefined,
      });
      expect(detectInitialQualityTier(false)).toBe('high');

      mockEnvironment({
        renderer: '',
        hasDebugInfo: false,
        cores: undefined,
        memory: undefined,
      });
      expect(detectInitialQualityTier(false)).toBe('average');
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
