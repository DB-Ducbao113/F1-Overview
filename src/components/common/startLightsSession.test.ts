import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('start lights session', () => {
  it('does not replay after a hard navigation in the same tab', async () => {
    const values = new Map<string, string>();
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key: string) => values.get(key),
        setItem: (key: string, value: string) => values.set(key, value),
      },
    });
    const firstPage = await import('./startLightsSession');
    expect(firstPage.shouldShowStartLights()).toBe(true);
    firstPage.markStartLightsSeen();
    vi.resetModules();
    const nextPage = await import('./startLightsSession');
    expect(nextPage.shouldShowStartLights()).toBe(false);
  });

  it('does not replay on remount when storage is blocked', async () => {
    vi.stubGlobal('window', {
      get sessionStorage() {
        throw new Error('Blocked');
      },
    });
    const session = await import('./startLightsSession');
    expect(session.shouldShowStartLights()).toBe(true);
    session.markStartLightsSeen();
    expect(session.shouldShowStartLights()).toBe(false);
  });

  it('skips the intro when reduced motion is requested', async () => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
    const session = await import('./startLightsSession');
    expect(session.shouldShowStartLights()).toBe(false);
  });
});
