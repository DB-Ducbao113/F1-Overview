import { describe, expect, it, vi } from 'vitest';
import {
  MOTION_ACTIVE_STATES,
  getDefaultAutoRotate,
  getDampingTailMs,
  getFrameLoopMode,
  resolveMotionState,
  shouldRequestFrames,
  type MotionStateInput,
} from './showroomMotionState';
import { getReducedMotionPreference, subscribeReducedMotion } from '../../hooks/useReducedMotion';

const baseInput: MotionStateInput = {
  reducedMotion: false,
  isDocumentVisible: true,
  isStageVisible: true,
  isWebGLContextLost: false,
  isTransitioning: false,
  isInteracting: false,
  isDamping: false,
  autoRotate: false,
  hasActiveHotspot: false,
};

describe('showroom motion state', () => {
  it('resolves the settled scene to static with no frame requests', () => {
    const state = resolveMotionState(baseInput);
    expect(state).toBe('static');
    expect(shouldRequestFrames(state)).toBe(false);
  });

  it('keeps every active motion state requesting frames', () => {
    expect(shouldRequestFrames('initial')).toBe(true);
    expect(shouldRequestFrames('autoRotate')).toBe(true);
    expect(shouldRequestFrames('orbit')).toBe(true);
    expect(shouldRequestFrames('damping')).toBe(true);
    expect(shouldRequestFrames('preset')).toBe(true);
    expect(MOTION_ACTIVE_STATES.size).toBe(5);
  });

  it('pauses frames for hidden, off-screen and context-lost stages', () => {
    expect(resolveMotionState({ ...baseInput, isDocumentVisible: false })).toBe('hidden');
    expect(resolveMotionState({ ...baseInput, isStageVisible: false })).toBe('offscreen');
    expect(resolveMotionState({ ...baseInput, isWebGLContextLost: true })).toBe('contextLost');
  });

  it('prioritizes transitions, interaction and damping over auto-rotation', () => {
    expect(resolveMotionState({ ...baseInput, isTransitioning: true })).toBe('preset');
    expect(resolveMotionState({ ...baseInput, isInteracting: true })).toBe('orbit');
    expect(resolveMotionState({ ...baseInput, isDamping: true })).toBe('damping');
    expect(resolveMotionState({ ...baseInput, autoRotate: true, hasActiveHotspot: true })).toBe(
      'static',
    );
  });

  it('disables auto-rotation default and damping tails under reduced motion', () => {
    expect(getDefaultAutoRotate(true)).toBe(false);
    expect(getDefaultAutoRotate(false)).toBe(true);
    expect(getDampingTailMs(true)).toBe(0);
    expect(getDampingTailMs(false)).toBe(2000);
  });

  it('reports static while damping under reduced motion', () => {
    const state = resolveMotionState({
      ...baseInput,
      reducedMotion: true,
      isDamping: true,
      autoRotate: true,
    });
    expect(state).toBe('static');
    expect(shouldRequestFrames(state)).toBe(false);
  });

  it('keeps the demand loop whenever the canvas is active', () => {
    expect(getFrameLoopMode(true)).toBe('demand');
    expect(getFrameLoopMode(false)).toBe('never');
  });
});

type MediaQueryListener = (event: { matches: boolean }) => void;

class MockMediaQueryList {
  private listeners = new Set<MediaQueryListener>();
  constructor(private matches: boolean) {}
  addEventListener = (_: string, listener: MediaQueryListener) => {
    this.listeners.add(listener);
  };
  removeEventListener = (_: string, listener: MediaQueryListener) => {
    this.listeners.delete(listener);
  };
  emit(matches: boolean) {
    this.matches = matches;
    this.listeners.forEach((listener) => listener({ matches }));
  }
}

describe('reduced motion subscription', () => {
  it('reads the current preference and live-updates on media change', () => {
    const mediaQuery = new MockMediaQueryList(false);
    const matchMedia = vi.fn().mockReturnValue(mediaQuery);
    vi.stubGlobal('window', { matchMedia });

    const onChange = vi.fn();
    const subscription = subscribeReducedMotion(onChange);

    expect(subscription).not.toBeNull();
    expect(subscription?.current).toBe(false);
    expect(getReducedMotionPreference()).toBe(false);

    mediaQuery.emit(true);
    expect(onChange).toHaveBeenCalledWith(true);
    mediaQuery.emit(false);
    expect(onChange).toHaveBeenCalledWith(false);

    subscription?.unsubscribe();
    mediaQuery.emit(true);
    expect(onChange).toHaveBeenCalledTimes(2);

    vi.unstubAllGlobals();
  });

  it('returns null safely when matchMedia is unavailable', () => {
    vi.stubGlobal('window', {});
    expect(subscribeReducedMotion(vi.fn())).toBeNull();
    expect(getReducedMotionPreference()).toBe(false);
    vi.unstubAllGlobals();
  });
});
