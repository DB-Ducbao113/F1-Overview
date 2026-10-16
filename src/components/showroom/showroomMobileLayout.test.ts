import { describe, expect, it } from 'vitest';
import {
  resolveMobileLayout,
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
