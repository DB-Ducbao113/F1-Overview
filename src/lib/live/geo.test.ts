import { describe, it, expect } from 'vitest';
import { computeBounds, toSvg } from './geo';

describe('geo - OpenF1 coordinate mapping to SVG', () => {
  it('computes bounding box correctly', () => {
    const points = [
      { x: 100, y: 200 },
      { x: -50, y: 300 },
      { x: 250, y: -100 },
    ];
    const bounds = computeBounds(points);
    expect(bounds.minX).toBe(-50);
    expect(bounds.maxX).toBe(250);
    expect(bounds.minY).toBe(-100);
    expect(bounds.maxY).toBe(300);
  });

  it('handles empty or degenerate points gracefully', () => {
    const bounds = computeBounds([]);
    expect(bounds.minX).toBeLessThan(bounds.maxX);
    expect(bounds.minY).toBeLessThan(bounds.maxY);
  });

  it('correctly maps world coordinates to SVG and flips Y axis', () => {
    const bounds = { minX: 0, maxX: 1000, minY: 0, maxY: 1000 };
    const viewBox = { w: 1000, h: 1000, pad: 0 };

    // Point at bottom-left in world (0, 0) -> should be at bottom of SVG (y = 1000)
    const p1 = toSvg(0, 0, bounds, viewBox);
    expect(p1.cx).toBe(0);
    expect(p1.cy).toBe(1000);

    // Point at top-right in world (1000, 1000) -> should be at top of SVG (y = 0)
    const p2 = toSvg(1000, 1000, bounds, viewBox);
    expect(p2.cx).toBe(1000);
    expect(p2.cy).toBe(0);

    // Center point (500, 500)
    const pCenter = toSvg(500, 500, bounds, viewBox);
    expect(pCenter.cx).toBe(500);
    expect(pCenter.cy).toBe(500);
  });
});
