import {
  DetailedRaceResult,
  DriverStanding,
  ConstructorStanding,
  SeasonYear,
  TeamId,
  UNKNOWN_TEAM_ID,
} from '../../../types';
import { TEAMS_DATA } from '../../../data/teams';
import { BASELINE_CUTOFF_BY_SEASON } from '../../../data/championship/baselineCutoff';
import { LOCKED_DRIVERS, DRIVER_METADATA } from './driverMapping';
import { buildCountbackHistograms, compareCountback, zerosHistogram } from './countbackComparator';
import { IStandingsCalculator, SeasonStandingsEntity } from './contracts/domainContracts';

/**
 * PURE DOMAIN: STANDINGS CALCULATOR ENGINE
 *
 * Recalculates Driver and Constructor Championship standings dynamically
 * directly from raw race classification entries and baseline standings.
 *
 * Enforces:
 * - Season cutoff data integrity (2024/2025 locked; 2026 cutoff = 17).
 * - Exact single-counting of sprint points.
 * - Defensive recovery of podium totals if unpopulated in baseline.
 * - FIA countback order (Points -> Wins -> P2..P10 -> Podiums).
 *
 * Pure TypeScript — zero dependencies on React, Zustand, DOM, fetch or localStorage.
 */

export function recalculateStandingsFromRaces(
  season: SeasonYear,
  races: DetailedRaceResult[],
  baseDrivers: DriverStanding[] = [],
  baseConstructors: ConstructorStanding[] = [],
): { drivers: DriverStanding[]; constructors: ConstructorStanding[] } {
  // If season is already completed (2024 or 2025), standings are official and final
  if (season !== 2026) {
    return {
      drivers: baseDrivers,
      constructors: baseConstructors,
    };
  }

  // For 2026 (ongoing season after 17 events):
  // Initialize with official baseline standings (reflecting events 1-17)
  const driverMap = new Map<
    string,
    {
      driverId: string;
      driverName: string;
      driverCode: string;
      teamId: TeamId;
      teamName: string;
      points: number;
      wins: number;
      podiums: number;
      countryFlag: string;
    }
  >();

  const constructorMap = new Map<
    string,
    {
      teamId: TeamId;
      teamName: string;
      points: number;
      wins: number;
      podiums: number;
      engine: string;
    }
  >();

  // Ignore sentinel unknowns so unmatched race records never invent phantom
  // driver/team standings or points.
  const canonicalBaseDrivers = baseDrivers.filter((d) => d?.driverId && d.driverId !== 'unknown');
  const canonicalBaseConstructors = baseConstructors.filter(
    (c) => c?.teamId && c.teamId !== UNKNOWN_TEAM_ID,
  );

  // Initialize driverMap with existing official baseline standings
  canonicalBaseDrivers.forEach((d) => {
    const locked = LOCKED_DRIVERS[d.driverId];
    driverMap.set(d.driverId, {
      driverId: d.driverId,
      driverName: d.driverName,
      driverCode: d.driverCode,
      teamId: locked?.teamId || d.teamId,
      teamName: locked?.teamName || d.teamName,
      points: d.points,
      wins: d.wins,
      podiums: d.podiums,
      countryFlag: d.countryFlag,
    });
  });

  // Initialize constructorMap with existing official baseline standings
  canonicalBaseConstructors.forEach((c) => {
    constructorMap.set(c.teamId, {
      teamId: c.teamId,
      teamName: c.teamName,
      points: c.points,
      wins: c.wins,
      podiums: c.podiums,
      engine: c.engine,
    });
  });

  // Defensive guard: if baseline drivers have 0 recorded podiums (e.g. from an unpopulated source/cache),
  // recover podium totals by tallying top-3 finishes across all available completed races.
  const hasBasePodiums = baseDrivers.some((d) => (d.podiums || 0) > 0);
  if (!hasBasePodiums && Array.isArray(races) && races.length > 0) {
    const racePodiumsByDriver = new Map<string, number>();
    const racePodiumsByTeam = new Map<string, number>();
    races
      .filter((r) => r && r.status === 'completed')
      .forEach((r) => {
        (r.entries || []).forEach((e) => {
          if (!e || e.position < 1 || e.position > 3) return;
          if (e.driverId && e.driverId !== 'unknown') {
            racePodiumsByDriver.set(e.driverId, (racePodiumsByDriver.get(e.driverId) || 0) + 1);
          }
          if (e.teamId && e.teamId !== UNKNOWN_TEAM_ID) {
            racePodiumsByTeam.set(e.teamId, (racePodiumsByTeam.get(e.teamId) || 0) + 1);
          }
        });
      });
    driverMap.forEach((driver, id) => {
      const p = racePodiumsByDriver.get(id);
      if (p !== undefined) driver.podiums = p;
    });
    constructorMap.forEach((team, id) => {
      const p = racePodiumsByTeam.get(id);
      if (p !== undefined) team.podiums = p;
    });
  }

  // Rounds at or below the baseline cutoff are already included in the official
  // baseline standings (see BASELINE_CUTOFF_BY_SEASON). Sprint points are added
  // exactly once, in the sprint loop below — never in the race loop.
  const cutoff = BASELINE_CUTOFF_BY_SEASON[season]?.completedRounds ?? 16;
  const additionalRaces = (Array.isArray(races) ? races : []).filter(
    (r) => r && !r.isSynthesized && r.round > cutoff,
  );

  additionalRaces.forEach((race) => {
    const entries = race.status === 'completed' && Array.isArray(race.entries) ? race.entries : [];
    entries.forEach((entry) => {
      if (!entry) return;
      if (!entry.driverId || entry.driverId === 'unknown') return;

      // Driver points increment
      const existingDriver = driverMap.get(entry.driverId);
      const locked = LOCKED_DRIVERS[entry.driverId];
      if (existingDriver) {
        existingDriver.points += entry.points || 0;
        if (entry.position === 1) existingDriver.wins += 1;
        if (entry.position >= 1 && entry.position <= 3) existingDriver.podiums += 1;
        existingDriver.teamId = locked?.teamId || entry.teamId;
        existingDriver.teamName = locked?.teamName || entry.teamName;
        driverMap.set(entry.driverId, existingDriver);
      } else {
        const dMeta = DRIVER_METADATA[entry.driverId] || {
          code: entry.driverCode || 'F1',
          flag: '🏁',
          teamId: locked?.teamId || entry.teamId,
          teamName: locked?.teamName || entry.teamName,
        };
        driverMap.set(entry.driverId, {
          driverId: entry.driverId,
          driverName: entry.driverName,
          driverCode: dMeta.code,
          teamId: locked?.teamId || entry.teamId,
          teamName: locked?.teamName || entry.teamName,
          points: entry.points || 0,
          wins: entry.position === 1 ? 1 : 0,
          podiums: entry.position >= 1 && entry.position <= 3 ? 1 : 0,
          countryFlag: dMeta.flag,
        });
      }

      // Constructor points increment (race points only; sprint is added once below)
      const teamId = entry.teamId;
      if (teamId && teamId !== UNKNOWN_TEAM_ID) {
        const existingTeam = constructorMap.get(teamId);
        if (existingTeam) {
          existingTeam.points += entry.points || 0;
          if (entry.position === 1) existingTeam.wins += 1;
          if (entry.position >= 1 && entry.position <= 3) existingTeam.podiums += 1;
          constructorMap.set(teamId, existingTeam);
        } else {
          const teamInfo = TEAMS_DATA[teamId];
          constructorMap.set(teamId, {
            teamId,
            teamName: teamInfo?.name || entry.teamName,
            points: entry.points || 0,
            wins: entry.position === 1 ? 1 : 0,
            podiums: entry.position >= 1 && entry.position <= 3 ? 1 : 0,
            engine: teamInfo?.powerUnit || 'Hybrid Turbo V6',
          });
        }
      }
    });

    // Sprint points are counted exactly once: explicit sprintEntries win when
    // present, otherwise legacy per-entry sprintPoints are derived. Never both.
    const explicitSprint = Array.isArray(race.sprintEntries) ? race.sprintEntries : [];
    const legacySprint =
      explicitSprint.length === 0
        ? entries
            .filter((entry) => entry && entry.sprintPoints)
            .map((entry) => ({
              ...entry,
              points: entry.sprintPoints || 0,
            }))
        : [];
    const sprintEntries = [...explicitSprint, ...legacySprint];
    sprintEntries.forEach((entry) => {
      if (!entry) return;
      if (!entry.driverId || entry.driverId === 'unknown') return;
      const points = entry.points || 0;
      const locked = LOCKED_DRIVERS[entry.driverId];
      const existingDriver = driverMap.get(entry.driverId);
      if (existingDriver) {
        existingDriver.points += points;
      } else {
        const dMeta = DRIVER_METADATA[entry.driverId] || {
          code: entry.driverCode || 'F1',
          flag: '🏁',
          teamId: locked?.teamId || entry.teamId,
          teamName: locked?.teamName || entry.teamName,
        };
        driverMap.set(entry.driverId, {
          driverId: entry.driverId,
          driverName: entry.driverName,
          driverCode: dMeta.code,
          teamId: locked?.teamId || entry.teamId,
          teamName: locked?.teamName || entry.teamName,
          points,
          wins: 0,
          podiums: 0,
          countryFlag: dMeta.flag,
        });
      }

      if (entry.teamId && entry.teamId !== UNKNOWN_TEAM_ID) {
        const existingTeam = constructorMap.get(entry.teamId);
        if (existingTeam) {
          existingTeam.points += points;
        } else {
          const teamInfo = TEAMS_DATA[entry.teamId];
          constructorMap.set(entry.teamId, {
            teamId: entry.teamId,
            teamName: teamInfo?.name || entry.teamName,
            points,
            wins: 0,
            podiums: 0,
            engine: teamInfo?.powerUnit || 'Hybrid Turbo V6',
          });
        }
      }
    });
  });

  // FIA countback support: finishing-position histograms over the full Grand
  // Prix history available in the input.
  const { driverHistograms, teamHistograms } = buildCountbackHistograms(races);

  // Sort and rank drivers: Points DESC -> Wins DESC -> P2..P10 DESC -> Podiums DESC
  const rankedDrivers: DriverStanding[] = Array.from(driverMap.values())
    .sort((a, b) =>
      compareCountback(
        a,
        b,
        driverHistograms.get(a.driverId) || zerosHistogram(),
        driverHistograms.get(b.driverId) || zerosHistogram(),
      ),
    )
    .map((item, idx) => {
      const locked = LOCKED_DRIVERS[item.driverId];
      return {
        ...item,
        teamId: locked?.teamId || item.teamId,
        teamName: locked?.teamName || item.teamName,
        rank: idx + 1,
      };
    });

  // Sort and rank constructors: Points DESC -> Wins DESC -> P2..P10 DESC -> Podiums DESC
  const rankedConstructors: ConstructorStanding[] = Array.from(constructorMap.values())
    .sort((a, b) =>
      compareCountback(
        a,
        b,
        teamHistograms.get(a.teamId) || zerosHistogram(),
        teamHistograms.get(b.teamId) || zerosHistogram(),
      ),
    )
    .map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

  return {
    drivers: rankedDrivers,
    constructors: rankedConstructors,
  };
}

/**
 * Pure Domain Calculator implementing IStandingsCalculator contract.
 */
export const standingsCalculator: IStandingsCalculator = {
  calculate(
    season: SeasonYear,
    races: readonly any[],
    baseDrivers: readonly any[] = [],
    baseConstructors: readonly any[] = [],
  ): SeasonStandingsEntity {
    const res = recalculateStandingsFromRaces(
      season,
      races as DetailedRaceResult[],
      baseDrivers as DriverStanding[],
      baseConstructors as ConstructorStanding[],
    );
    return {
      season,
      drivers: res.drivers,
      constructors: res.constructors,
      isFinal: season !== 2026,
      calculatedAt: new Date().toISOString(),
    };
  },
};
