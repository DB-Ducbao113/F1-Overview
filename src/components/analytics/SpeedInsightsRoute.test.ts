import { describe, expect, it } from 'vitest';
import { stripQueryAndHash } from './speedInsightsRouteUtils';

describe('Speed Insights route normalization', () => {
  it('removes query strings and fragments without losing the pathname', () => {
    expect(stripQueryAndHash('https://podiumeds.vercel.app/season/2026?tab=results#round-7')).toBe(
      'https://podiumeds.vercel.app/season/2026',
    );
  });

  it('keeps an already normalized URL unchanged', () => {
    expect(stripQueryAndHash('https://podiumeds.vercel.app/teams')).toBe(
      'https://podiumeds.vercel.app/teams',
    );
  });
});
