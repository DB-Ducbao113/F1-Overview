import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { CircuitTrackMap } from './CircuitTrackMap';
import { CircuitDetailModal } from './CircuitDetailModal';
import { getCircuitByRound } from '../../data/championship/circuitsData';

describe('CircuitTrackMap Component', () => {
  it('renders thumbnail variant with mini SVG path for Round 1 (Albert Park)', () => {
    const html = renderToStaticMarkup(<CircuitTrackMap round={1} variant="thumbnail" />);
    expect(html).toContain('viewBox="0 0 500 360"');
    expect(html).toContain('<path');
    expect(html).toContain('<circle');
  });

  it('renders card variant with full telemetry, turns, and lap record', () => {
    const html = renderToStaticMarkup(<CircuitTrackMap round={1} variant="card" />);
    expect(html).toContain('Albert Park Grand Prix Circuit');
    expect(html).toContain('Melbourne, Australia');
    expect(html).toContain('5.278'); // Circuit length km
    expect(html).toContain('14'); // Total turns
    expect(html).toContain('1:19.813'); // Lap record
    expect(html).toContain('Charles Leclerc'); // Driver
  });

  it('renders card variant for Monaco (Round 6) with specific length and turns', () => {
    const html = renderToStaticMarkup(<CircuitTrackMap round={6} variant="card" />);
    expect(html).toContain('Circuit de Monaco');
    expect(html).toContain('Monte Carlo, Monaco');
    expect(html).toContain('3.337');
    expect(html).toContain('19');
    expect(html).toContain('1:12.909');
    expect(html).toContain('Lewis Hamilton');
  });

  it('returns null if round or circuit cannot be found', () => {
    const html = renderToStaticMarkup(<CircuitTrackMap round={999} variant="card" />);
    expect(html).toBe('');
  });
});

describe('CircuitDetailModal Component', () => {
  it('renders modal dialog with full circuit details and DRS zones', () => {
    const circuit = getCircuitByRound(1)!;
    expect(circuit).toBeDefined();

    const html = renderToStaticMarkup(<CircuitDetailModal circuit={circuit} onClose={() => {}} />);
    expect(html).toContain('role="dialog"');
    expect(html).toContain('Albert Park Grand Prix Circuit');
    expect(html).toContain('Melbourne, Australia');
    expect(html).toContain('1:19.813');
    expect(html).toContain('DRS 1');
    expect(html).toContain('DRS 2');
    expect(html).toContain('DRS 3');
    expect(html).toContain('DRS 4');
    expect(html).toContain('Live Radar');
    expect(html).toContain('Bản Đồ Thực Tế');
  });
});

describe('CircuitRealWorldMap Component', () => {
  it('renders satellite map container with GPS coordinates and Google Maps link', async () => {
    const { CircuitRealWorldMap, CIRCUIT_COORDINATES } = await import('./CircuitRealWorldMap');
    const circuit = getCircuitByRound(1)!;

    const html = renderToStaticMarkup(<CircuitRealWorldMap circuit={circuit} lang="en" />);
    expect(html).toContain('Satellite');
    expect(html).toContain('Street');
    expect(html).toContain('Google Maps');
    expect(CIRCUIT_COORDINATES['albert-park']).toBeDefined();
    expect(CIRCUIT_COORDINATES['albert-park'].lat).toBeCloseTo(-37.8497, 3);
  });
});

describe('CircuitLiveRadar Component', () => {
  it('renders radar HUD with drivers, speed gauge, and playback controls', async () => {
    const { CircuitLiveRadar, RADAR_DRIVERS } = await import('./CircuitLiveRadar');
    const circuit = getCircuitByRound(1)!;

    const html = renderToStaticMarkup(<CircuitLiveRadar circuit={circuit} lang="en" />);
    expect(html).toContain('LIVE RADAR');
    expect(html).toContain('Live Speed');
    expect(html).toContain('Gear');
    expect(html).toContain('DRS');
    expect(html).toContain('VER');
    expect(html).toContain('LEC');
    expect(html).toContain('NOR');
    expect(html).toContain('HAM');
    expect(html).toContain('RUS');
    expect(RADAR_DRIVERS).toHaveLength(5);
  });
});
