/**
 * M3B.2 — Showroom motion lifecycle.
 *
 * The renderer only requests frames while the current motion state actually
 * needs them. These helpers keep that decision in one place so the Canvas,
 * the camera controller and the UI controls cannot drift apart, and so the
 * reduced-motion policy stays testable without a WebGL context.
 */

/**
 * Renderer activity states. Exactly one applies at a time for the "should a
 * frame be requested" decision:
 *
 * - `initial`  — first paint of the scene and the first readiness frame.
 * - `autoRotate` — continuous 360° rotation while the stage is active.
 * - `orbit`    — the user is actively dragging / scrolling the controls.
 * - `damping`  — the inertial tail after a user interaction ends.
 * - `preset`   — a programmatic camera / hotspot transition is interpolating.
 * - `static`   — everything has settled; no frame should be requested.
 * - `hidden`   — document not visible.
 * - `offscreen`— stage not intersecting the viewport.
 * - `contextLost` — WebGL context lost; frames are intentionally frozen.
 */
export type MotionState =
  | 'initial'
  | 'autoRotate'
  | 'orbit'
  | 'damping'
  | 'preset'
  | 'static'
  | 'hidden'
  | 'offscreen'
  | 'contextLost';

/** States that require the renderer to keep requesting frames. */
export const MOTION_ACTIVE_STATES: ReadonlySet<MotionState> = new Set<MotionState>([
  'initial',
  'autoRotate',
  'orbit',
  'damping',
  'preset',
]);

/**
 * Canvas frame-loop mode derived from the visibility/context gates only.
 * Motion states are handled through explicit `invalidate()` calls so a settled
 * scene stays at zero recurring draws in both normal and reduced motion.
 */
export const getFrameLoopMode = (isCanvasActive: boolean): 'demand' | 'never' =>
  isCanvasActive ? 'demand' : 'never';

/** Auto-rotation is on by default, but never for reduced-motion users. */
export const getDefaultAutoRotate = (reducedMotion: boolean): boolean => !reducedMotion;

/**
 * Visible damping tail after a user interaction ends. Reduced motion keeps the
 * interaction usable but settles immediately so no trailing frames run.
 */
export const getDampingTailMs = (reducedMotion: boolean): number => (reducedMotion ? 0 : 2000);

export interface MotionStateInput {
  reducedMotion: boolean;
  isDocumentVisible: boolean;
  isStageVisible: boolean;
  isWebGLContextLost: boolean;
  isTransitioning: boolean;
  isInteracting: boolean;
  isDamping: boolean;
  autoRotate: boolean;
  hasActiveHotspot: boolean;
}

/** Resolve the single motion state that currently owns frame requests. */
export const resolveMotionState = (input: MotionStateInput): MotionState => {
  if (!input.isDocumentVisible) return 'hidden';
  if (!input.isStageVisible) return 'offscreen';
  if (input.isWebGLContextLost) return 'contextLost';
  if (input.isTransitioning) return 'preset';
  if (input.isInteracting) return 'orbit';
  if (input.isDamping && !input.reducedMotion) return 'damping';
  if (input.autoRotate && !input.hasActiveHotspot && !input.reducedMotion) return 'autoRotate';
  return 'static';
};

/** True when the resolved state must keep a demand frame loop alive. */
export const shouldRequestFrames = (state: MotionState): boolean => MOTION_ACTIVE_STATES.has(state);
