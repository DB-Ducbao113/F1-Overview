/**
 * Showroom 3D Adaptive Graphics Quality System
 *
 * Implements 4 quality modes:
 * - Auto (default): Device-aware initial selection with rolling FPS/frame-time monitoring,
 *   gradual tier adjustments, hysteresis, cooldown, and spike filtering.
 * - High: Maximum visual fidelity (higher DPR, full MeshPhysicalMaterial with clearcoat,
 *   high-res directional shadow maps, polished luxury mirror reflector floor).
 * - Average: Balanced performance (balanced DPR, lower shadow map resolution,
 *   lightened reflector floor resolution, preserved team livery fidelity).
 * - Performance: High frame-rate mode for low-end GPUs / mobile (lower DPR,
 *   MeshStandardMaterial without clearcoat, disabled shadow maps, static satin floor
 *   eliminating the expensive offscreen mirror render pass).
 */

export type GraphicsQualityMode = 'auto' | 'high' | 'average' | 'performance';
export type QualityTier = 'high' | 'average' | 'performance';
export type StageLightingMode = 'cinematic' | 'balanced' | 'essential';

export interface QualityProfile {
  tier: QualityTier;
  dpr: number | [number, number];
  shadows: boolean;
  shadowMapSize: number;
  contactShadows: boolean;
  contactShadowResolution: number;
  contactShadowBlur: number;
  mirrorFloor: boolean;
  mirrorFloorResolution: number;
  mirrorFloorBlur: [number, number];
  materialQuality: 'physical' | 'standard';
  maxAnisotropy: number;
  lightingMode: StageLightingMode;
  simplifyWallMeshes: boolean;
}

export const QUALITY_STORAGE_KEY = 'f1_showroom_graphics_quality';

/** Cooldown duration (in ms) after an automatic quality shift before another adjustment is permitted */
export const ADAPTIVE_DOWNGRADE_COOLDOWN_MS = 4000;
export const ADAPTIVE_UPGRADE_COOLDOWN_MS = 6000;

/** Startup & scene loading grace period (in ms) during which frame drops (shader compile, textures) are ignored */
export const STARTUP_GRACE_PERIOD_MS = 3000;

/** Frame thresholds for adaptive auto mode */
export const ADAPTIVE_THRESHOLDS = {
  // Sustained frame time > 23.5 ms (~ <42.5 FPS) triggers downgrade
  downgradeFrameTimeMs: 23.5,
  downgradeMinSamples: 45, // at ~40fps, 45 frames ≈ 1.1s of sustained sluggishness
  // Sustained frame time < 17.5 ms (~ >57 FPS) over longer period triggers upgrade
  upgradeFrameTimeMs: 17.5,
  upgradeMinSamples: 150, // at ~60fps, 150 frames ≈ 2.5s of sustained smooth rendering
};

/**
 * Mobile-specific quality profiles
 */
export const MOBILE_QUALITY_PROFILES: Record<QualityTier, QualityProfile> = {
  high: {
    tier: 'high',
    dpr: [1, 1.25],
    shadows: true,
    shadowMapSize: 512,
    contactShadows: true,
    contactShadowResolution: 256,
    contactShadowBlur: 2.0,
    mirrorFloor: true,
    mirrorFloorResolution: 256,
    mirrorFloorBlur: [200, 80],
    materialQuality: 'physical',
    maxAnisotropy: 8,
    lightingMode: 'balanced',
    simplifyWallMeshes: false,
  },
  average: {
    tier: 'average',
    dpr: [0.85, 1.0],
    shadows: false,
    shadowMapSize: 256,
    contactShadows: true,
    contactShadowResolution: 128,
    contactShadowBlur: 1.5,
    mirrorFloor: false, // On mobile, average disables mirror floor to protect battery & fillrate
    mirrorFloorResolution: 128,
    mirrorFloorBlur: [100, 40],
    materialQuality: 'standard',
    maxAnisotropy: 4,
    lightingMode: 'balanced',
    simplifyWallMeshes: true,
  },
  performance: {
    tier: 'performance',
    dpr: 0.75,
    shadows: false,
    shadowMapSize: 256,
    contactShadows: false,
    contactShadowResolution: 128,
    contactShadowBlur: 1.0,
    mirrorFloor: false,
    mirrorFloorResolution: 128,
    mirrorFloorBlur: [100, 40],
    materialQuality: 'standard',
    maxAnisotropy: 2,
    lightingMode: 'essential',
    simplifyWallMeshes: true,
  },
};

/**
 * Desktop-specific quality profiles
 */
export const DESKTOP_QUALITY_PROFILES: Record<QualityTier, QualityProfile> = {
  high: {
    tier: 'high',
    dpr: [1, 1.5],
    shadows: true,
    shadowMapSize: 1024,
    contactShadows: true,
    contactShadowResolution: 256,
    contactShadowBlur: 2.0,
    mirrorFloor: true,
    mirrorFloorResolution: 512,
    mirrorFloorBlur: [300, 100],
    materialQuality: 'physical',
    maxAnisotropy: 16,
    lightingMode: 'cinematic',
    simplifyWallMeshes: false,
  },
  average: {
    tier: 'average',
    dpr: [1, 1.15],
    shadows: true,
    shadowMapSize: 512,
    contactShadows: true,
    contactShadowResolution: 128,
    contactShadowBlur: 1.5,
    mirrorFloor: true,
    mirrorFloorResolution: 256,
    mirrorFloorBlur: [180, 60],
    materialQuality: 'standard',
    maxAnisotropy: 8,
    lightingMode: 'balanced',
    simplifyWallMeshes: false,
  },
  performance: {
    tier: 'performance',
    dpr: 0.85,
    shadows: false,
    shadowMapSize: 256,
    contactShadows: false,
    contactShadowResolution: 128,
    contactShadowBlur: 1.0,
    mirrorFloor: false, // Disables offscreen reflection pass entirely
    mirrorFloorResolution: 128,
    mirrorFloorBlur: [100, 40],
    materialQuality: 'standard',
    maxAnisotropy: 4,
    lightingMode: 'essential',
    simplifyWallMeshes: true,
  },
};

/**
 * Inspect client environment to select an initial device-aware quality tier
 */
export function detectInitialQualityTier(isMobile: boolean): QualityTier {
  if (typeof window === 'undefined') return 'average';

  const rawMemory = (navigator as any).deviceMemory;
  const rawCores = navigator.hardwareConcurrency;
  const hasLowMemory = typeof rawMemory === 'number' && rawMemory <= 4;
  const hasLowCores = typeof rawCores === 'number' && rawCores <= 4;

  // 1. Mobile layout heuristics: never auto-assign 'high' to mobile devices to protect battery & thermals
  if (isMobile) {
    if (hasLowMemory || hasLowCores) return 'performance';
    return 'average';
  }

  // 2. Desktop hardware heuristics: low-spec desktop hardware starts conservatively
  if (hasLowMemory || hasLowCores) {
    return 'performance';
  }

  // 3. WebGL GPU renderer probe (unmasked renderer)
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer =
          (gl as WebGLRenderingContext)
            .getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            ?.toLowerCase() || '';

        // Integrated, software-emulated or low-power GPU architectures
        // Distinguish integrated AMD Radeon APUs (Vega, Radeon Graphics, R2-R5, 600M series)
        const isIntegratedRadeon =
          renderer.includes('radeon') &&
          (renderer.includes('graphics') ||
            renderer.includes('vega') ||
            renderer.includes('r2') ||
            renderer.includes('r3') ||
            renderer.includes('r4') ||
            renderer.includes('r5') ||
            renderer.includes('610m') ||
            renderer.includes('660m') ||
            renderer.includes('740m'));

        if (
          renderer.includes('intel') ||
          renderer.includes('uhd') ||
          renderer.includes('hd graphics') ||
          renderer.includes('mali') ||
          renderer.includes('adreno') ||
          renderer.includes('powervr') ||
          renderer.includes('llvmpipe') ||
          renderer.includes('swiftshader') ||
          renderer.includes('basic render') ||
          isIntegratedRadeon
        ) {
          return 'performance';
        }

        // Dedicated high-performance GPUs (NVIDIA RTX/GTX, discrete AMD Radeon RX/Pro)
        const isDedicatedNvidia =
          renderer.includes('nvidia') ||
          renderer.includes('geforce') ||
          renderer.includes('rtx') ||
          renderer.includes('gtx');

        const isDedicatedRadeon =
          renderer.includes('radeon rx') ||
          renderer.includes('radeon pro') ||
          renderer.includes('rdna');

        // Apple Silicon desktop Macs (M-series with adequate cores)
        const isDesktopAppleSilicon =
          renderer.includes('apple') &&
          (renderer.includes('m1') ||
            renderer.includes('m2') ||
            renderer.includes('m3') ||
            renderer.includes('m4') ||
            (typeof rawCores === 'number' && rawCores >= 8));

        if (isDedicatedNvidia || isDedicatedRadeon || isDesktopAppleSilicon) {
          return 'high';
        }
      }
    }
  } catch {
    // Canvas context probe blocked or failed — fallback to safe average
    return 'average';
  }

  // Safe fallback for unmasked / unclassified desktop devices with adequate hardware
  return 'average';
}

/**
 * Retrieve saved user quality mode from localStorage (defaults to 'auto')
 */
export function getSavedQualityMode(): GraphicsQualityMode {
  if (typeof localStorage === 'undefined') return 'auto';
  try {
    const saved = localStorage.getItem(QUALITY_STORAGE_KEY) as GraphicsQualityMode | null;
    if (saved && ['auto', 'high', 'average', 'performance'].includes(saved)) {
      return saved;
    }
  } catch {
    // localStorage restricted (incognito/sandbox)
  }
  return 'auto';
}

/**
 * Persist user quality mode choice
 */
export function saveQualityMode(mode: GraphicsQualityMode): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(QUALITY_STORAGE_KEY, mode);
  } catch {
    // localStorage restricted
  }
}

/**
 * Resolve effective QualityProfile based on mode, tier, and viewport
 */
export function resolveQualityProfile(
  mode: GraphicsQualityMode,
  currentTier: QualityTier,
  isMobile: boolean,
): QualityProfile {
  const effectiveTier: QualityTier = mode === 'auto' ? currentTier : mode;
  const profileTable = isMobile ? MOBILE_QUALITY_PROFILES : DESKTOP_QUALITY_PROFILES;
  return profileTable[effectiveTier];
}

/**
 * Rolling frame-time metrics buffer
 */
export class RollingFrameMetrics {
  private samples: number[] = [];
  private capacity: number;
  private sum = 0;

  constructor(capacity = 90) {
    this.capacity = capacity;
  }

  add(frameDurationMs: number): void {
    if (frameDurationMs <= 0 || frameDurationMs > 500) return; // filter non-render or pause anomalies

    this.samples.push(frameDurationMs);
    this.sum += frameDurationMs;

    if (this.samples.length > this.capacity) {
      const removed = this.samples.shift();
      if (removed !== undefined) this.sum -= removed;
    }
  }

  clear(): void {
    this.samples = [];
    this.sum = 0;
  }

  get count(): number {
    return this.samples.length;
  }

  get averageFrameTime(): number {
    return this.samples.length > 0 ? this.sum / this.samples.length : 16.6;
  }

  get averageFps(): number {
    const avg = this.averageFrameTime;
    return avg > 0 ? 1000 / avg : 60;
  }

  getP95FrameTime(): number {
    if (this.samples.length === 0) return 16.6;
    const sorted = [...this.samples].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[Math.min(index, sorted.length - 1)];
  }

  getLow1PercentFps(): number {
    if (this.samples.length === 0) return 60;
    const sorted = [...this.samples].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.99);
    const p99 = sorted[Math.min(index, sorted.length - 1)];
    return p99 > 0 ? 1000 / p99 : 60;
  }
}
