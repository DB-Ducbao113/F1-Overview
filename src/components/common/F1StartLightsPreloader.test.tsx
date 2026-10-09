import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { F1StartLightsPreloader } from './F1StartLightsPreloader';
import { START_LIGHT_TIMING } from './startLightsTiming';

describe('F1StartLightsPreloader', () => {
  it('renders immediately on every fresh App mount without a storage gate', () => {
    const html = renderToStaticMarkup(<F1StartLightsPreloader />);
    expect(html).toContain('F1 Start Lights Preloader');
    expect(html).toContain('PREPARING GRID...');
    expect(html.match(/data-testid="start-light"/g)).toHaveLength(10);
  });

  it('completes the normal sequence at exactly five seconds', () => {
    expect(START_LIGHT_TIMING.lightIntervalMs * 5).toBe(2500);
    expect(START_LIGHT_TIMING.lightsOutMs).toBe(4000);
    expect(START_LIGHT_TIMING.fadeStartMs + START_LIGHT_TIMING.fadeDurationMs).toBe(5000);
    expect(START_LIGHT_TIMING.totalMs).toBe(5000);
  });
});
