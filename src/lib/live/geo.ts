import { CircuitBounds } from './openf1-types';

export interface Point2D {
  x: number;
  y: number;
}

export interface ViewBoxConfig {
  w: number;
  h: number;
  pad?: number;
}

/**
 * Compute bounding box from a collection of points
 */
export function computeBounds(points: Point2D[]): CircuitBounds {
  if (!points || points.length === 0) {
    return { minX: -1000, maxX: 1000, minY: -1000, maxY: 1000 };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    if (typeof p.x === 'number' && !isNaN(p.x)) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
    }
    if (typeof p.y === 'number' && !isNaN(p.y)) {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
  }

  // Fallback if points were degenerate
  if (!isFinite(minX) || !isFinite(maxX) || minX === maxX) {
    minX = -1000;
    maxX = 1000;
  }
  if (!isFinite(minY) || !isFinite(maxY) || minY === maxY) {
    minY = -1000;
    maxY = 1000;
  }

  return { minX, maxX, minY, maxY };
}

/**
 * Transform OpenF1 world meters (x, y) into SVG viewport coordinates (cx, cy).
 * Features:
 * - Flips Y axis (OpenF1 Y points north/up, SVG Y points down)
 * - Preserves aspect ratio so circuit is never distorted
 * - Centers the circuit inside the viewBox with specified padding
 */
export function toSvg(
  x: number,
  y: number,
  bounds: CircuitBounds,
  viewBox: ViewBoxConfig,
): { cx: number; cy: number } {
  const pad = viewBox.pad ?? 40;
  const availW = Math.max(viewBox.w - pad * 2, 10);
  const availH = Math.max(viewBox.h - pad * 2, 10);

  const spanX = Math.max(bounds.maxX - bounds.minX, 1);
  const spanY = Math.max(bounds.maxY - bounds.minY, 1);

  // Equal scaling to avoid distortion
  const scale = Math.min(availW / spanX, availH / spanY);

  const circuitW = spanX * scale;
  const circuitH = spanY * scale;

  // Center inside viewport
  const offsetX = pad + (availW - circuitW) / 2;
  const offsetY = pad + (availH - circuitH) / 2;

  let normX = x;
  let normY = y;

  if (bounds.mirrorX) {
    normX = bounds.maxX - (normX - bounds.minX);
  }
  if (bounds.mirrorY) {
    normY = bounds.maxY - (normY - bounds.minY);
  }

  const cx = offsetX + (normX - bounds.minX) * scale;
  // Flip Y: maxY is at the top of the SVG (offsetY), minY is at the bottom (offsetY + circuitH)
  const cy = offsetY + (bounds.maxY - normY) * scale;

  return {
    cx: Math.round(cx * 10) / 10,
    cy: Math.round(cy * 10) / 10,
  };
}
