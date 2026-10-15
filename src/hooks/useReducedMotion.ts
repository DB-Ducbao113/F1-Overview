import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Subscribes to `prefers-reduced-motion` changes and returns an unsubscribe
 * function plus the current value. Extracted so the listener lifecycle is
 * unit-testable without a DOM or a React renderer.
 */
export const subscribeReducedMotion = (
  onChange: (matches: boolean) => void,
): { current: boolean; unsubscribe: () => void } | null => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }

  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  const listener = (event: MediaQueryListEvent) => onChange(event.matches);

  // `addEventListener` is the modern API; older Safari only exposes the
  // deprecated `addListener`, so fall back to it when needed.
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', listener);
    return {
      current: mediaQuery.matches,
      unsubscribe: () => mediaQuery.removeEventListener('change', listener),
    };
  }

  mediaQuery.addListener(listener);
  return {
    current: mediaQuery.matches,
    unsubscribe: () => mediaQuery.removeListener(listener),
  };
};

/**
 * Reads the current `prefers-reduced-motion` preference in a safe way.
 * Returns `false` during SSR or when `matchMedia` is unavailable so the
 * first client render stays deterministic with the server output.
 */
export const getReducedMotionPreference = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
};

/**
 * Tracks `prefers-reduced-motion: reduce` and re-renders when the user
 * changes the preference while the component stays mounted.
 *
 * SSR-safe: the server render uses `false`, then the first effect syncs to
 * the real media query value. Event listeners are only registered when the
 * media query API exists, and they are removed on unmount so no duplicate
 * listeners accumulate across route changes.
 */
export const useReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => getReducedMotionPreference());

  useEffect(() => {
    const subscription = subscribeReducedMotion(setReducedMotion);
    if (!subscription) return;

    // Re-sync in case the preference changed between render and effect.
    setReducedMotion(subscription.current);
    return subscription.unsubscribe;
  }, []);

  return reducedMotion;
};
