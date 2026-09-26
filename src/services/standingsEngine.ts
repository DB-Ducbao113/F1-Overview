import {
  DetailedRaceResult,
  DriverStanding,
  ConstructorStanding,
  SeasonYear,
  TeamId,
} from '../types';
import { TEAMS_DATA } from '../data/teams';

// Fallback driver metadata map
const DRIVER_METADATA: Record<string, { code: string; flag: string; teamId: TeamId; teamName: string }> = {
  verstappen: { code: 'VER', flag: '🇳🇱', teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  perez: { code: 'PER', flag: '🇲🇽', teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  leclerc: { code: 'LEC', flag: '🇲🇨', teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  sainz: { code: 'SAI', flag: '🇪🇸', teamId: 'williams', teamName: 'Williams Racing' },
  norris: { code: 'NOR', flag: '🇬🇧', teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
  piastri: { code: 'PIA', flag: '🇦🇺', teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
  hamilton: { code: 'HAM', flag: '🇬🇧', teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  russell: { code: 'RUS', flag: '🇬🇧', teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  antonelli: { code: 'ANT', flag: '🇮🇹', teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  alonso: { code: 'ALO', flag: '🇪🇸', teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  stroll: { code: 'STR', flag: '🇨🇦', teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  gasly: { code: 'GAS', flag: '🇫🇷', teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
  doohan: { code: 'DOO', flag: '🇦🇺', teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
  albon: { code: 'ALB', flag: '🇹🇭', teamId: 'williams', teamName: 'Williams Racing' },
  tsunoda: { code: 'TSU', flag: '🇯🇵', teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
  hadjar: { code: 'HAD', flag: '🇫🇷', teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
  hulkenberg: { code: 'HUL', flag: '🇩🇪', teamId: 'audi', teamName: 'Audi Formula 1 Team' },
  bortoleto: { code: 'BOR', flag: '🇧🇷', teamId: 'audi', teamName: 'Audi Formula 1 Team' },
  bearman: { code: 'BEA', flag: '🇬🇧', teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  ocon: { code: 'OCO', flag: '🇫🇷', teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  lawson: { code: 'LAW', flag: '🇳🇿', teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  colapinto: { code: 'COL', flag: '🇦🇷', teamId: 'williams', teamName: 'Williams Racing' },
  ricciardo: { code: 'RIC', flag: '🇦🇺', teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
  magnussen: { code: 'MAG', flag: '🇩🇰', teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  bottas: { code: 'BOT', flag: '🇫🇮', teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
  zhou: { code: 'ZHO', flag: '🇨🇳', teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
  sargeant: { code: 'SAR', flag: '🇺🇸', teamId: 'williams', teamName: 'Williams Racing' },
};

/**
 * Recalculates Driver and Constructor Championship standings dynamically
 * directly from raw race classification entries.
 */
export function recalculateStandingsFromRaces(
  season: SeasonYear,
  races: DetailedRaceResult[],
  baseDrivers: DriverStanding[] = [],
  baseConstructors: ConstructorStanding[] = []
): { drivers: DriverStanding[]; constructors: ConstructorStanding[] } {
  // If season is already completed (2024 or 2025), standings are official and final
  if (season !== 2026) {
    return {
      drivers: baseDrivers,
      constructors: baseConstructors,
    };
  }

  // For 2026 (ongoing season after 14 events):
  // Initialize with official baseline standings (reflecting events 1-14)
  const driverMap = new Map<string, {
    driverId: string;
    driverName: string;
    driverCode: string;
    teamId: TeamId;
    teamName: string;
    points: number;
    wins: number;
    podiums: number;
    countryFlag: string;
  }>();

  const constructorMap = new Map<string, {
    teamId: TeamId;
    teamName: string;
    points: number;
    wins: number;
    podiums: number;
    engine: string;
  }>();

  // Initialize driverMap with existing official baseline standings
  baseDrivers.forEach((d) => {
    driverMap.set(d.driverId, {
      driverId: d.driverId,
      driverName: d.driverName,
      driverCode: d.driverCode,
      teamId: d.teamId,
      teamName: d.teamName,
      points: d.points,
      wins: d.wins,
      podiums: d.podiums,
      countryFlag: d.countryFlag,
    });
  });

  // Initialize constructorMap with existing official baseline standings
  baseConstructors.forEach((c) => {
    constructorMap.set(c.teamId, {
      teamId: c.teamId,
      teamName: c.teamName,
      points: c.points,
      wins: c.wins,
      podiums: c.podiums,
      engine: c.engine,
    });
  });

  // Only newly added or simulated races beyond round 14 will contribute additional points
  // (Rounds 1-14 are already included in the official base points above)
  const additionalRaces = races.filter((r) => r.status === 'completed' && r.round > 14);

  additionalRaces.forEach((race) => {
    race.entries.forEach((entry) => {
      // Driver points increment
      const existingDriver = driverMap.get(entry.driverId);
      if (existingDriver) {
        existingDriver.points += entry.points || 0;
        if (entry.position === 1) existingDriver.wins += 1;
        if (entry.position >= 1 && entry.position <= 3) existingDriver.podiums += 1;
        existingDriver.teamId = entry.teamId;
        existingDriver.teamName = entry.teamName;
        driverMap.set(entry.driverId, existingDriver);
      } else {
        const dMeta = DRIVER_METADATA[entry.driverId] || {
          code: entry.driverCode || 'F1',
          flag: '🏁',
          teamId: entry.teamId,
          teamName: entry.teamName,
        };
        driverMap.set(entry.driverId, {
          driverId: entry.driverId,
          driverName: entry.driverName,
          driverCode: dMeta.code,
          teamId: entry.teamId,
          teamName: entry.teamName,
          points: entry.points || 0,
          wins: entry.position === 1 ? 1 : 0,
          podiums: entry.position <= 3 ? 1 : 0,
          countryFlag: dMeta.flag,
        });
      }

      // Constructor points increment
      const teamId = entry.teamId;
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
          podiums: entry.position <= 3 ? 1 : 0,
          engine: teamInfo?.powerUnit || 'Hybrid Turbo V6',
        });
      }
    });
  });

  // Sort and rank drivers: Points DESC -> Wins DESC -> Podiums DESC
  const rankedDrivers: DriverStanding[] = Array.from(driverMap.values())
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.podiums - a.podiums;
    })
    .map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

  // Sort and rank constructors: Points DESC -> Wins DESC -> Podiums DESC
  const rankedConstructors: ConstructorStanding[] = Array.from(constructorMap.values())
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.podiums - a.podiums;
    })
    .map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

  return {
    drivers: rankedDrivers,
    constructors: rankedConstructors,
  };
}
