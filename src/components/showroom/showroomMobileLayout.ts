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

/** Accessible tap-target floor for mobile controls (WCAG 2.5.5 / Material 48px). */
export const MIN_TOUCH_TARGET_PX = 44;

export const getDockDefaultExpanded = (isMobileLayout: boolean): boolean => !isMobileLayout;

/** Safe-area CSS for bottom-fixed controls on phones with home indicators. */
export const BOTTOM_SAFE_AREA_CLASS = 'pb-[env(safe-area-inset-bottom)]';
