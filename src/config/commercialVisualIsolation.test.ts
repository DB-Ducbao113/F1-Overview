import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CIRCUIT_REVIEW_POINTS } from '../data/championship/circuitReviewPoints';

describe('commercial visual isolation', () => {
  it('routes every circuit checkpoint to an original local EDS visualization', () => {
    const points = Object.values(CIRCUIT_REVIEW_POINTS).flat();
    expect(points).toHaveLength(77);
    for (const point of points) {
      expect(point.imageUrl).toBe(`/images/eds/circuits/${point.circuitId}.svg`);
    }
  });

  it('keeps prohibited tile and remote-photo hosts out of active circuit source', () => {
    const mapSource = readFileSync('src/components/championship/CircuitRealWorldMap.tsx', 'utf8');
    const reviewSource = readFileSync('src/data/championship/circuitReviewPoints.ts', 'utf8');
    const combined = `${mapSource}\n${reviewSource}`;
    expect(combined).not.toContain('arcgisonline.com');
    expect(combined).not.toContain('tile.openstreetmap.org');
    expect(combined).not.toContain('images.unsplash.com');
    expect(combined).not.toContain('/images/circuits/');
  });

  it('keeps legacy livery and sponsor modules outside the production Showroom entry', () => {
    const showroomSource = readFileSync('src/components/showroom/ShowroomView.tsx', 'utf8');
    for (const forbidden of [
      "'./F1CarTextures'",
      "'./HotspotDetailsModal'",
      "'./LiverySelector'",
      "'./SchematicComparisonModal'",
      "'./StudioBackdropTexture'",
      "'./StudioW15Stage'",
      "'../../data/showroom/teamLiveries'",
      "'../../data/showroom/teamLogoSVGs'",
      "'../../data/showroom/teamSponsors'",
    ]) {
      expect(showroomSource).not.toContain(forbidden);
    }
  });
});
