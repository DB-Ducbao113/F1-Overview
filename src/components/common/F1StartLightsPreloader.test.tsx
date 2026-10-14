import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { F1StartLightsPreloader } from './F1StartLightsPreloader';
import { getStartLightsFrame, START_LIGHT_CUE, START_LIGHT_TIMING } from './startLightsTiming';

describe('F1StartLightsPreloader', () => {
  it('renders immediately on every fresh App mount without a storage gate', () => {
    const html = renderToStaticMarkup(<F1StartLightsPreloader />);
    expect(html).toContain('F1 Start Lights Preloader');
    expect(html).toContain('PREPARING GRID...');
    expect(html.match(/data-testid="start-light"/g)).toHaveLength(10);
  });

  it.each([
    [0, 'awakening', 0],
    [119, 'awakening', 0],
    [120, 'pressure', 1],
    [339, 'pressure', 1],
    [340, 'pressure', 2],
    [560, 'pressure', 3],
    [780, 'pressure', 4],
    [999, 'pressure', 4],
    [1000, 'hold', 5],
    [1399, 'hold', 5],
    [1400, 'lights-out', 0],
    [1699, 'lights-out', 0],
    [1700, 'launch', 0],
    [2099, 'launch', 0],
    [2100, 'launch', 0],
    [2499, 'launch', 0],
    [2500, 'complete', 0],
    [60000, 'complete', 0],
  ])('at %d ms shows %s with %d red columns', (time, phase, litColumns) => {
    expect(getStartLightsFrame(time)).toEqual({ phase, litColumns });
  });

  it('keeps the complete start call', () => {
    expect(START_LIGHT_CUE).toBe("IT'S LIGHTS OUT AND AWAY WE GO!");
  });

  it('keeps the overlay mounted through the logo hold and entire reveal', () => {
    const revealEnds =
      START_LIGHT_TIMING.launchMs +
      START_LIGHT_TIMING.logoHoldMs +
      START_LIGHT_TIMING.revealDurationMs;
    expect(revealEnds).toBe(START_LIGHT_TIMING.totalMs);
    expect(getStartLightsFrame(revealEnds - 1).phase).toBe('launch');
    expect(getStartLightsFrame(revealEnds).phase).toBe('complete');
  });
});
