import { describe, it, expect } from 'vitest';
import { TEAM_CLOSEUPS, getTeamComponentCloseUp, type ComponentCloseUp } from './teamCloseups';
import { TEAMS_DATA } from '../../../data/teams';
import type { TeamId } from '../../../types';

describe('teamCloseups data integrity & public API', () => {
  const ALL_TEAMS = Object.keys(TEAMS_DATA) as TeamId[];
  const CORE_HOTSPOTS = ['wings', 'drs', 'power_unit', 'halo', 'sidepods', 'tires'] as const;
  const ALL_HOTSPOTS = [...CORE_HOTSPOTS, 'floor'] as const;

  it('contains data for all 11 F1 teams', () => {
    expect(ALL_TEAMS).toHaveLength(11);
    ALL_TEAMS.forEach((teamId) => {
      expect(TEAM_CLOSEUPS[teamId], `Missing closeups for team: ${teamId}`).toBeDefined();
    });
  });

  it('contains all 6 primary hotspots with valid localized fields for every team', () => {
    ALL_TEAMS.forEach((teamId) => {
      const teamMap = TEAM_CLOSEUPS[teamId];
      CORE_HOTSPOTS.forEach((hotspotId) => {
        const item: ComponentCloseUp = teamMap[hotspotId];
        expect(item, `Missing hotspot ${hotspotId} for team ${teamId}`).toBeDefined();

        // Localized titles & concepts
        expect(item.titleVi).toBeTruthy();
        expect(item.titleEn).toBeTruthy();
        expect(item.conceptVi).toBeTruthy();
        expect(item.conceptEn).toBeTruthy();

        // Part code & image URL
        expect(item.partCode).toBeTruthy();
        expect(item.imageUrl).toMatch(/^\/images\/showroom\/closeups\/[a-z0-9_]+\.webp$/);

        // Highlights in VI & EN
        expect(Array.isArray(item.highlightsVi)).toBe(true);
        expect(item.highlightsVi.length).toBeGreaterThanOrEqual(3);
        expect(Array.isArray(item.highlightsEn)).toBe(true);
        expect(item.highlightsEn.length).toBeGreaterThanOrEqual(3);

        // Technical specs
        expect(Array.isArray(item.specs)).toBe(true);
        expect(item.specs.length).toBeGreaterThanOrEqual(3);
        item.specs.forEach((spec) => {
          expect(spec.labelVi).toBeTruthy();
          expect(spec.labelEn).toBeTruthy();
          expect(spec.value).toBeTruthy();
        });
      });
    });
  });

  it('correctly serves all 11 teams x 7 hotspots via getTeamComponentCloseUp', () => {
    ALL_TEAMS.forEach((teamId) => {
      ALL_HOTSPOTS.forEach((hotspotId) => {
        const closeUp = getTeamComponentCloseUp(teamId, hotspotId);
        expect(closeUp, `Failed closeUp for ${teamId} -> ${hotspotId}`).toBeDefined();
        expect(closeUp.titleVi).toBeTruthy();
        expect(closeUp.titleEn).toBeTruthy();
        expect(closeUp.partCode).toBeTruthy();
        expect(closeUp.imageUrl).toBeTruthy();
      });
    });
  });

  it('synthesizes Venturi Floor & Diffuser close-up with zero new images (reuses sidepods image)', () => {
    ALL_TEAMS.forEach((teamId) => {
      const floorCloseUp = getTeamComponentCloseUp(teamId, 'floor');
      const sidepodsCloseUp = TEAM_CLOSEUPS[teamId].sidepods;

      expect(floorCloseUp.partCode).toBe(`${teamId.toUpperCase()}-FLOOR-DIFF`);
      expect(floorCloseUp.imageUrl).toBe(sidepodsCloseUp.imageUrl);
      expect(floorCloseUp.titleVi).toContain('Sàn Venturi & Diffuser Cận Cảnh');
      expect(floorCloseUp.titleEn).toContain('Venturi Floor & Diffuser Close-up');
      expect(floorCloseUp.conceptVi).toContain('Jabroc 10mm');
      expect(floorCloseUp.conceptEn).toContain('Jabroc reference plank');
      expect(floorCloseUp.specs.some((s) => s.value.includes('Jabroc'))).toBe(true);
    });
  });

  it('safely falls back for unknown teams and unknown hotspots', () => {
    const unknownTeamCloseUp = getTeamComponentCloseUp('unknown_team' as TeamId, 'wings');
    expect(unknownTeamCloseUp).toEqual(TEAM_CLOSEUPS.ferrari.wings);

    const unknownHotspotCloseUp = getTeamComponentCloseUp('mercedes', 'non_existent_part');
    expect(unknownHotspotCloseUp).toEqual(TEAM_CLOSEUPS.mercedes.wings);
  });
});
