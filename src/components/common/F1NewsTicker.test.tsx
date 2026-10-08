import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { F1NewsTicker } from './F1NewsTicker';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('F1NewsTicker Component', () => {
  it('renders F1 FEED badge and marquee ticker track', () => {
    const html = renderToStaticMarkup(<F1NewsTicker />);

    // Renders F1 FEED static label
    expect(html).toContain('F1 FEED');

    // Contains the animate-ticker-marquee class
    expect(html).toContain('animate-ticker-marquee');

    // Contains Singapore GP headline
    expect(html).toContain('SINGAPORE GP');

    // Contains Live Center headline
    expect(html).toContain('LIVE CENTER');
  });

  it('renders interactive play/pause button', () => {
    const html = renderToStaticMarkup(<F1NewsTicker />);

    // Pause button is rendered
    expect(html).toContain('aria-label="Pause feed"');
  });
});
