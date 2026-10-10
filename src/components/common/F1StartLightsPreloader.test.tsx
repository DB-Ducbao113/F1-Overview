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
    [999, 'awakening', 0],
    [1000, 'pressure', 1],
    [1499, 'pressure', 1],
    [1500, 'pressure', 2],
    [2000, 'pressure', 3],
    [2500, 'pressure', 4],
    [2999, 'pressure', 4],
    [3000, 'hold', 5],
    [3999, 'hold', 5],
    [4000, 'lights-out', 0],
    [4399, 'lights-out', 0],
    [4400, 'launch', 0],
    [4999, 'launch', 0],
    [5000, 'launch', 0],
    [5600, 'launch', 0],
    [6199, 'launch', 0],
    [6200, 'complete', 0],
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
