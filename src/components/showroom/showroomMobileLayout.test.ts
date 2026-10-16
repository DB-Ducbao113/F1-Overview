import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  resolveMobileLayout,
  subscribeMobileLayout,
  getDockDefaultExpanded,
  MIN_TOUCH_TARGET_PX,
  MOBILE_BREAKPOINT_PX,
} from './showroomMobileLayout';

describe('showroomMobileLayout', () => {
  it('treats viewports at or below 1023 px as mobile layout', () => {
    expect(resolveMobileLayout(320).isMobileLayout).toBe(true);
    expect(resolveMobileLayout(390).isMobileLayout).toBe(true);
    expect(resolveMobileLayout(768).isMobileLayout).toBe(true);
    expect(resolveMobileLayout(1023).isMobileLayout).toBe(true);
  });

  it('keeps desktop composition above the breakpoint', () => {
    expect(resolveMobileLayout(1024).isMobileLayout).toBe(false);
    expect(resolveMobileLayout(1280).isMobileLayout).toBe(false);
    expect(resolveMobileLayout(1920).isMobileLayout).toBe(false);
  });

  it('exposes the breakpoint constant', () => {
    expect(MOBILE_BREAKPOINT_PX).toBe(1023);
  });

  it('defaults the dock collapsed on mobile and expanded on desktop', () => {
    expect(getDockDefaultExpanded(true)).toBe(false);
    expect(getDockDefaultExpanded(false)).toBe(true);
  });

  it('defines a 44px minimum touch target', () => {
    expect(MIN_TOUCH_TARGET_PX).toBe(44);
  });
});

describe('subscribeMobileLayout', () => {
  let width: number;
  let listeners: Array<() => void>;
  let rafCbs: Array<() => void>;

  beforeEach(() => {
    listeners = [];
    rafCbs = [];
    vi.stubGlobal('window', {
      get innerWidth() {
        return width;
      },
      addEventListener: vi.fn((_: string, l: () => void) => listeners.push(l)),
      removeEventListener: vi.fn((_: string, l: () => void) => {
        listeners = listeners.filter((x) => x !== l);
      }),
      requestAnimationFrame: vi.fn((cb: () => void) => {
        rafCbs.push(cb);
        return rafCbs.length;
      }),
      cancelAnimationFrame: vi.fn(),
    });
    width = 390;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const flush = () => {
    const cbs = rafCbs;
    rafCbs = [];
    cbs.forEach((cb) => cb());
  };

  it('does not fire when resizes stay within the same mode', () => {
    const onChange = vi.fn();
    const unsub = subscribeMobileLayout(onChange);
    expect(onChange).not.toHaveBeenCalled();

    width = 800; // still mobile
    listeners.forEach((l) => l());
    flush();
    expect(onChange).not.toHaveBeenCalled();
    unsub?.();
  });

  it('fires once per crossing (rotation/resize both directions)', () => {
    const onChange = vi.fn();
    const unsub = subscribeMobileLayout(onChange);

    width = 1280;
    listeners.forEach((l) => l());
    flush();
    expect(onChange).toHaveBeenCalledWith(false);

    width = 390;
    listeners.forEach((l) => l());
    flush();
    expect(onChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(2);
    unsub?.();
  });

  it('coalesces bursts of resize events into a single evaluation', () => {
    const onChange = vi.fn();
    subscribeMobileLayout(onChange);
    width = 1280;
    listeners.forEach((l) => l());
    listeners.forEach((l) => l());
    listeners.forEach((l) => l());
    flush();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('removes the listener on unsubscribe (no leak across route mounts)', () => {
    const onChange = vi.fn();
    const unsub = subscribeMobileLayout(onChange);
    expect(listeners.length).toBe(1);
    unsub?.();
    expect(listeners.length).toBe(0);

    width = 1280;
    listeners.forEach((l) => l());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('returns null safely when window is unavailable (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(subscribeMobileLayout(vi.fn())).toBeNull();
    vi.unstubAllGlobals();
  });
});
