/**
 * M3C — Mobile Showroom layout helpers.
 *
 * The mobile composition keeps every control reachable while making the 3D
 * car the visual focus:
 * - The Control Dock starts collapsed on mobile and opens as a full-width
 *   bottom sheet instead of a floating top-right panel, so the car bodywork
 *   stays visible.
 * - The team badge collapses to a single compact line on mobile.
 * - Quick HUD gains safe-area padding for modern phones (notch/home bar).
 *
 * Detection is width-based (CSS media-query compatible, works identically in
 * headless captures and real devices). Desktop composition is untouched:
 * viewports above the breakpoint keep the existing floating dock and badge.
 */

export const MOBILE_BREAKPOINT_PX = 1023;

export interface MobileLayoutState {
  isMobileLayout: boolean;
}

export const resolveMobileLayout = (viewportWidth: number): MobileLayoutState => {
  return {
    isMobileLayout: viewportWidth <= MOBILE_BREAKPOINT_PX,
  };
};

/**
 * Subscribes to viewport-width crossing of the mobile breakpoint and returns
 * an unsubscribe handle. Fires only when the boolean actually flips, so
 * crossing the threshold (rotation, window resize) is reactive while normal
 * resizes within one mode do not re-render the Showroom.
 */
export const subscribeMobileLayout = (
  onChange: (isMobileLayout: boolean) => void,
): (() => void) | null => {
  if (typeof window === 'undefined') return null;

  let current = window.innerWidth <= MOBILE_BREAKPOINT_PX;
  let raf = 0;
  const handle = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      const next = window.innerWidth <= MOBILE_BREAKPOINT_PX;
      if (next !== current) {
        current = next;
        onChange(next);
      }
    });
  };
  window.addEventListener('resize', handle, { passive: true });

  return () => {
    window.removeEventListener('resize', handle);
    if (raf) window.cancelAnimationFrame(raf);
  };
};

/** Accessible tap-target floor for mobile controls (WCAG 2.5.5 / Material 48px). */
export const MIN_TOUCH_TARGET_PX = 44;

export const getDockDefaultExpanded = (isMobileLayout: boolean): boolean => !isMobileLayout;

/** Safe-area CSS for bottom-fixed controls on phones with home indicators. */
export const BOTTOM_SAFE_AREA_CLASS = 'pb-[env(safe-area-inset-bottom)]';
