import { DetailedRaceResult, DetailedRaceResultEntry, SeasonYear, TeamId } from '../../types';
import { getRaceResults } from './results';
import { CALENDAR_2026 } from './calendar';

// Reference driver pool per season
interface GridDriver {
  driverId: string;
  driverName: string;
  driverCode: string;
  driverNumber: number;
  teamId: TeamId;
  teamName: string;
}

const DRIVER_GRID_2026: GridDriver[] = [
  { driverId: 'russell', driverName: 'George Russell', driverCode: 'RUS', driverNumber: 63, teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  { driverId: 'antonelli', driverName: 'Andrea Kimi Antonelli', driverCode: 'ANT', driverNumber: 12, teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  { driverId: 'verstappen', driverName: 'Max Verstappen', driverCode: 'VER', driverNumber: 3, teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  { driverId: 'hadjar', driverName: 'Isack Hadjar', driverCode: 'HAD', driverNumber: 6, teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  { driverId: 'leclerc', driverName: 'Charles Leclerc', driverCode: 'LEC', driverNumber: 16, teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  { driverId: 'hamilton', driverName: 'Lewis Hamilton', driverCode: 'HAM', driverNumber: 44, teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  { driverId: 'norris', driverName: 'Lando Norris', driverCode: 'NOR', driverNumber: 1, teamId: 'mclaren', teamName: 'McLaren Mastercard F1 Team' },
  { driverId: 'piastri', driverName: 'Oscar Piastri', driverCode: 'PIA', driverNumber: 81, teamId: 'mclaren', teamName: 'McLaren Mastercard F1 Team' },
  { driverId: 'sainz', driverName: 'Carlos Sainz', driverCode: 'SAI', driverNumber: 55, teamId: 'williams', teamName: 'Williams Racing' },
  { driverId: 'albon', driverName: 'Alexander Albon', driverCode: 'ALB', driverNumber: 23, teamId: 'williams', teamName: 'Williams Racing' },
  { driverId: 'alonso', driverName: 'Fernando Alonso', driverCode: 'ALO', driverNumber: 14, teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  { driverId: 'stroll', driverName: 'Lance Stroll', driverCode: 'STR', driverNumber: 18, teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  { driverId: 'lawson', driverName: 'Liam Lawson', driverCode: 'LAW', driverNumber: 30, teamId: 'racingbulls', teamName: 'Visa Cash App Racing Bulls' },
  { driverId: 'lindblad', driverName: 'Arvid Lindblad', driverCode: 'LIN', driverNumber: 41, teamId: 'racingbulls', teamName: 'Visa Cash App Racing Bulls' },
  { driverId: 'ocon', driverName: 'Esteban Ocon', driverCode: 'OCO', driverNumber: 31, teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  { driverId: 'bearman', driverName: 'Oliver Bearman', driverCode: 'BEA', driverNumber: 87, teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  { driverId: 'hulkenberg', driverName: 'Nico Hülkenberg', driverCode: 'HUL', driverNumber: 27, teamId: 'audi', teamName: 'Audi Revolut F1 Team' },
  { driverId: 'bortoleto', driverName: 'Gabriel Bortoleto', driverCode: 'BOR', driverNumber: 5, teamId: 'audi', teamName: 'Audi Revolut F1 Team' },
  { driverId: 'gasly', driverName: 'Pierre Gasly', driverCode: 'GAS', driverNumber: 10, teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
  { driverId: 'colapinto', driverName: 'Franco Colapinto', driverCode: 'COL', driverNumber: 43, teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
  { driverId: 'perez', driverName: 'Sergio Pérez', driverCode: 'PER', driverNumber: 11, teamId: 'cadillac', teamName: 'Cadillac Formula 1 Team' },
  { driverId: 'bottas', driverName: 'Valtteri Bottas', driverCode: 'BOT', driverNumber: 77, teamId: 'cadillac', teamName: 'Cadillac Formula 1 Team' },
];

const DRIVER_GRID_2025: GridDriver[] = [
  { driverId: 'norris', driverName: 'Lando Norris', driverCode: 'NOR', driverNumber: 4, teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
  { driverId: 'piastri', driverName: 'Oscar Piastri', driverCode: 'PIA', driverNumber: 81, teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
  { driverId: 'verstappen', driverName: 'Max Verstappen', driverCode: 'VER', driverNumber: 1, teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  { driverId: 'tsunoda', driverName: 'Yuki Tsunoda', driverCode: 'TSU', driverNumber: 22, teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  { driverId: 'leclerc', driverName: 'Charles Leclerc', driverCode: 'LEC', driverNumber: 16, teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  { driverId: 'hamilton', driverName: 'Lewis Hamilton', driverCode: 'HAM', driverNumber: 44, teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  { driverId: 'russell', driverName: 'George Russell', driverCode: 'RUS', driverNumber: 63, teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  { driverId: 'antonelli', driverName: 'Andrea Kimi Antonelli', driverCode: 'ANT', driverNumber: 12, teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  { driverId: 'sainz', driverName: 'Carlos Sainz', driverCode: 'SAI', driverNumber: 55, teamId: 'williams', teamName: 'Williams Racing' },
  { driverId: 'albon', driverName: 'Alexander Albon', driverCode: 'ALB', driverNumber: 23, teamId: 'williams', teamName: 'Williams Racing' },
  { driverId: 'alonso', driverName: 'Fernando Alonso', driverCode: 'ALO', driverNumber: 14, teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  { driverId: 'stroll', driverName: 'Lance Stroll', driverCode: 'STR', driverNumber: 18, teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  { driverId: 'hadjar', driverName: 'Isack Hadjar', driverCode: 'HAD', driverNumber: 6, teamId: 'racingbulls', teamName: 'Racing Bulls F1 Team' },
  { driverId: 'lawson', driverName: 'Liam Lawson', driverCode: 'LAW', driverNumber: 30, teamId: 'racingbulls', teamName: 'Racing Bulls F1 Team' },
  { driverId: 'hulkenberg', driverName: 'Nico Hülkenberg', driverCode: 'HUL', driverNumber: 27, teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
  { driverId: 'bortoleto', driverName: 'Gabriel Bortoleto', driverCode: 'BOR', driverNumber: 5, teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
  { driverId: 'bearman', driverName: 'Oliver Bearman', driverCode: 'BEA', driverNumber: 87, teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  { driverId: 'ocon', driverName: 'Esteban Ocon', driverCode: 'OCO', driverNumber: 31, teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  { driverId: 'gasly', driverName: 'Pierre Gasly', driverCode: 'GAS', driverNumber: 10, teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
  { driverId: 'colapinto', driverName: 'Franco Colapinto', driverCode: 'COL', driverNumber: 43, teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
];

const DRIVER_GRID_2024: GridDriver[] = [
  { driverId: 'verstappen', driverName: 'Max Verstappen', driverCode: 'VER', driverNumber: 1, teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  { driverId: 'norris', driverName: 'Lando Norris', driverCode: 'NOR', driverNumber: 4, teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
  { driverId: 'leclerc', driverName: 'Charles Leclerc', driverCode: 'LEC', driverNumber: 16, teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  { driverId: 'piastri', driverName: 'Oscar Piastri', driverCode: 'PIA', driverNumber: 81, teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
  { driverId: 'sainz', driverName: 'Carlos Sainz', driverCode: 'SAI', driverNumber: 55, teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  { driverId: 'russell', driverName: 'George Russell', driverCode: 'RUS', driverNumber: 63, teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  { driverId: 'hamilton', driverName: 'Lewis Hamilton', driverCode: 'HAM', driverNumber: 44, teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  { driverId: 'perez', driverName: 'Sergio Pérez', driverCode: 'PER', driverNumber: 11, teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  { driverId: 'alonso', driverName: 'Fernando Alonso', driverCode: 'ALO', driverNumber: 14, teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  { driverId: 'gasly', driverName: 'Pierre Gasly', driverCode: 'GAS', driverNumber: 10, teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
  { driverId: 'hulkenberg', driverName: 'Nico Hülkenberg', driverCode: 'HUL', driverNumber: 27, teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  { driverId: 'tsunoda', driverName: 'Yuki Tsunoda', driverCode: 'TSU', driverNumber: 22, teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
  { driverId: 'stroll', driverName: 'Lance Stroll', driverCode: 'STR', driverNumber: 18, teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  { driverId: 'ocon', driverName: 'Esteban Ocon', driverCode: 'OCO', driverNumber: 31, teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
  { driverId: 'magnussen', driverName: 'Kevin Magnussen', driverCode: 'MAG', driverNumber: 20, teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  { driverId: 'albon', driverName: 'Alexander Albon', driverCode: 'ALB', driverNumber: 23, teamId: 'williams', teamName: 'Williams Racing' },
  { driverId: 'colapinto', driverName: 'Franco Colapinto', driverCode: 'COL', driverNumber: 43, teamId: 'williams', teamName: 'Williams Racing' },
  { driverId: 'zhou', driverName: 'Zhou Guanyu', driverCode: 'ZHO', driverNumber: 24, teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
  { driverId: 'bottas', driverName: 'Valtteri Bottas', driverCode: 'BOT', driverNumber: 77, teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
  { driverId: 'ricciardo', driverName: 'Daniel Ricciardo', driverCode: 'RIC', driverNumber: 3, teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
];

const FIA_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

function normalizeDriverName(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

function findGridDriver(name: string, grid: GridDriver[]): GridDriver | undefined {
  const norm = normalizeDriverName(name);
  return grid.find((d) => {
    const dNorm = normalizeDriverName(d.driverName);
    return dNorm.includes(norm) || norm.includes(dNorm) || d.driverCode.toLowerCase() === norm;
  });
}

export function getCompleteRaceClassification(
  season: SeasonYear,
  round: number,
  detailedList?: DetailedRaceResult[]
): DetailedRaceResult | null {
  // 1. First check if detailedList has this race and it has substantial entries (>= 10)
  const existingDetailed = detailedList?.find((r) => r.round === round);
  if (existingDetailed && existingDetailed.entries && existingDetailed.entries.length >= 10) {
    return existingDetailed;
  }

  // 2. Fetch the summary for this race
  const summaryList = getRaceResults(season);
  const summary = summaryList.find((r) => r.round === round);
  if (!summary) return existingDetailed || null;

  const grid = season === 2026 ? DRIVER_GRID_2026 : season === 2025 ? DRIVER_GRID_2025 : DRIVER_GRID_2024;
  const calRound = CALENDAR_2026.find((c) => c.round === round);
  const lapsTotal = calRound?.laps || (summary.circuit.toLowerCase().includes('monaco') ? 78 : summary.circuit.toLowerCase().includes('spa') ? 44 : 57);

  // Match P1, P2, P3
  const p1Driver = findGridDriver(summary.podium.p1.driver, grid);
  const p2Driver = findGridDriver(summary.podium.p2.driver, grid);
  const p3Driver = findGridDriver(summary.podium.p3.driver, grid);

  const selectedDriverIds = new Set<string>();
  if (p1Driver) selectedDriverIds.add(p1Driver.driverId);
  if (p2Driver) selectedDriverIds.add(p2Driver.driverId);
  if (p3Driver) selectedDriverIds.add(p3Driver.driverId);

  const entries: DetailedRaceResultEntry[] = [];

  // P1
  entries.push({
    position: 1,
    driverId: p1Driver?.driverId || 'p1',
    driverName: summary.podium.p1.driver,
    driverCode: p1Driver?.driverCode || summary.podium.p1.driver.slice(0, 3).toUpperCase(),
    driverNumber: p1Driver?.driverNumber || 1,
    teamId: p1Driver?.teamId || 'ferrari',
    teamName: summary.podium.p1.team,
    laps: lapsTotal,
    status: 'Finished',
    timeOrGap: summary.podium.p1.time || '1:31:44.742',
    points: summary.podium.p1.points || 25,
    fastestLap: summary.fastestLap?.driver === summary.podium.p1.driver,
    fastestLapTime: summary.fastestLap?.driver === summary.podium.p1.driver ? summary.fastestLap.time : undefined,
  });

  // P2
  entries.push({
    position: 2,
    driverId: p2Driver?.driverId || 'p2',
    driverName: summary.podium.p2.driver,
    driverCode: p2Driver?.driverCode || summary.podium.p2.driver.slice(0, 3).toUpperCase(),
    driverNumber: p2Driver?.driverNumber || 16,
    teamId: p2Driver?.teamId || 'mclaren',
    teamName: summary.podium.p2.team,
    laps: lapsTotal,
    status: 'Finished',
    timeOrGap: summary.podium.p2.gap || '+3.415s',
    points: summary.podium.p2.points || 18,
    fastestLap: summary.fastestLap?.driver === summary.podium.p2.driver,
    fastestLapTime: summary.fastestLap?.driver === summary.podium.p2.driver ? summary.fastestLap.time : undefined,
  });

  // P3
  entries.push({
    position: 3,
    driverId: p3Driver?.driverId || 'p3',
    driverName: summary.podium.p3.driver,
    driverCode: p3Driver?.driverCode || summary.podium.p3.driver.slice(0, 3).toUpperCase(),
    driverNumber: p3Driver?.driverNumber || 4,
    teamId: p3Driver?.teamId || 'redbull',
    teamName: summary.podium.p3.team,
    laps: lapsTotal,
    status: 'Finished',
    timeOrGap: summary.podium.p3.gap || '+8.921s',
    points: summary.podium.p3.points || 15,
    fastestLap: summary.fastestLap?.driver === summary.podium.p3.driver,
    fastestLapTime: summary.fastestLap?.driver === summary.podium.p3.driver ? summary.fastestLap.time : undefined,
  });

  // Remaining drivers from grid
  const remaining = grid.filter((d) => !selectedDriverIds.has(d.driverId));

  // Determine fastest lap driver
  const flDriver = summary.fastestLap ? findGridDriver(summary.fastestLap.driver, grid) : undefined;

  remaining.forEach((driver, idx) => {
    const pos = idx + 4;
    const isPoints = pos <= 10;
    const basePts = isPoints ? FIA_POINTS[pos - 1] : 0;
    const isFl = flDriver?.driverId === driver.driverId;
    const pts = isPoints && isFl ? basePts + 1 : basePts;

    const gapSec = (12.5 + idx * 4.2).toFixed(3);
    const isDNF = pos >= 19;
    const laps = isDNF ? Math.max(12, lapsTotal - (pos === 20 ? 18 : 6)) : pos >= 15 ? lapsTotal - 1 : lapsTotal;

    entries.push({
      position: pos,
      driverId: driver.driverId,
      driverName: driver.driverName,
      driverCode: driver.driverCode,
      driverNumber: driver.driverNumber,
      teamId: driver.teamId,
      teamName: driver.teamName,
      laps,
      status: isDNF ? 'DNF' : pos >= 15 ? '+1 Lap' : 'Finished',
      timeOrGap: isDNF ? 'DNF' : pos >= 15 ? '+1 Lap' : `+${gapSec}s`,
      points: pts,
      fastestLap: isFl,
      fastestLapTime: isFl && summary.fastestLap ? summary.fastestLap.time : undefined,
    });
  });

  return {
    id: `race-${season}-r${round}`,
    season,
    round,
    grandPrix: summary.grandPrix,
    officialName: `FORMULA 1 ${summary.grandPrix.toUpperCase()} ${season}`,
    circuit: summary.circuit,
    location: calRound?.location,
    country: calRound?.country,
    date: summary.date,
    status: 'completed',
    lapsTotal,
    winner: {
      driver: summary.podium.p1.driver,
      team: summary.podium.p1.team,
      time: summary.podium.p1.time,
    },
    fastestLap: summary.fastestLap,
    entries,
  };
}
