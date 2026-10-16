export const START_LIGHT_SESSION_KEY = 'podium-start-lights-seen';

let seenInMemory = false;

export function shouldShowStartLights(): boolean {
  if (seenInMemory) return false;
  if (typeof window === 'undefined') return true;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    return window.sessionStorage.getItem(START_LIGHT_SESSION_KEY) !== '1';
  } catch {
    return true;
  }
}

export function markStartLightsSeen(): void {
  seenInMemory = true;
  try {
    window.sessionStorage.setItem(START_LIGHT_SESSION_KEY, '1');
  } catch {
    // The in-memory gate still prevents replay when storage is unavailable.
  }
}
