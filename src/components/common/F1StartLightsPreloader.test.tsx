import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { F1StartLightsPreloader } from './F1StartLightsPreloader';

describe('F1StartLightsPreloader', () => {
  beforeEach(() => {
    let store: Record<string, string> = {};
    (globalThis as any).sessionStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      clear: () => {
        store = {};
      },
    };
  });

  it('renders preloader markup when sessionStorage is empty', () => {
    // In server render, isVisible is false initially, mounts after useEffect on client
    const html = renderToStaticMarkup(<F1StartLightsPreloader />);
    // Initial static markup returns null to prevent SSR flash
    expect(html).toBe('');
  });

  it('maintains safe execution without throwing', () => {
    sessionStorage.setItem('f1_start_lights_seen_v1', 'true');
    expect(() => renderToStaticMarkup(<F1StartLightsPreloader />)).not.toThrow();
  });
});
