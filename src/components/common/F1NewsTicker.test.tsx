import { afterEach, describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { F1NewsTicker } from './F1NewsTicker';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('F1NewsTicker Component', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders F1 FEED badge and marquee ticker track', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-13T02:34:00.000Z'));
    const html = renderToStaticMarkup(<F1NewsTicker />);

    // Renders F1 FEED static label
    expect(html).toContain('F1 FEED');

    // Contains the animate-ticker-marquee class
    expect(html).toContain('animate-ticker-marquee');

    // Uses the next scheduled session after the completed Singapore weekend.
    expect(html).toContain('UNITED STATES GP');
    expect(html).toContain('FP1');
    expect(html).not.toContain('SINGAPORE FP1');
    expect(html).toContain('17 / 23 CHẶNG ĐÃ HOÀN THÀNH');
    expect(html).toContain('340 ĐIỂM');

    // Contains Singapore GP latest result headline.
    expect(html).toContain('SINGAPORE GP');

    // Retired Live Center must not be advertised.
    expect(html).not.toContain('LIVE CENTER');
    expect(html).not.toContain('/LIVE');
  });

  it('renders interactive play/pause button', () => {
    const html = renderToStaticMarkup(<F1NewsTicker />);

    // Pause button is rendered
    expect(html).toContain('aria-label="Pause feed"');
  });
});
