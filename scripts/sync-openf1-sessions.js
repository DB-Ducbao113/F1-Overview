/**
 * Persist completed OpenF1 session classifications in the repository.
 * The script only writes when a complete 22-driver classification changes,
 * so GitHub Actions and Vercel build only for new or corrected results.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(
  __dirname,
  '..',
  'src',
  'data',
  'championship',
  'openF1SessionResults2026.json',
);
const API_BASE = 'https://api.openf1.org/v1';
const EXPECTED_GRID_SIZE = 22;

const DRIVER_FALLBACK = {
  1: ['norris', 'Lando Norris', 'NOR', 'mclaren', 'McLaren F1 Team'],
  3: ['verstappen', 'Max Verstappen', 'VER', 'redbull', 'Oracle Red Bull Racing'],
  5: ['bortoleto', 'Gabriel Bortoleto', 'BOR', 'audi', 'Audi F1 Team'],
  6: ['hadjar', 'Isack Hadjar', 'HAD', 'redbull', 'Oracle Red Bull Racing'],
  10: ['gasly', 'Pierre Gasly', 'GAS', 'alpine', 'BWT Alpine F1 Team'],
  11: ['perez', 'Sergio Pérez', 'PER', 'cadillac', 'Cadillac Formula 1 Team'],
  12: ['antonelli', 'Andrea Kimi Antonelli', 'ANT', 'mercedes', 'Mercedes-AMG PETRONAS F1 Team'],
  14: ['alonso', 'Fernando Alonso', 'ALO', 'astonmartin', 'Aston Martin Aramco F1 Team'],
  16: ['leclerc', 'Charles Leclerc', 'LEC', 'ferrari', 'Scuderia Ferrari HP'],
  18: ['stroll', 'Lance Stroll', 'STR', 'astonmartin', 'Aston Martin Aramco F1 Team'],
  23: ['albon', 'Alexander Albon', 'ALB', 'williams', 'Williams Racing'],
  27: ['hulkenberg', 'Nico Hülkenberg', 'HUL', 'audi', 'Audi F1 Team'],
  30: ['lawson', 'Liam Lawson', 'LAW', 'racingbulls', 'Visa Cash App Racing Bulls'],
  31: ['ocon', 'Esteban Ocon', 'OCO', 'haas', 'MoneyGram Haas F1 Team'],
  41: ['lindblad', 'Arvid Lindblad', 'LIN', 'racingbulls', 'Visa Cash App Racing Bulls'],
  43: ['colapinto', 'Franco Colapinto', 'COL', 'alpine', 'BWT Alpine F1 Team'],
  44: ['hamilton', 'Lewis Hamilton', 'HAM', 'ferrari', 'Scuderia Ferrari HP'],
  55: ['sainz', 'Carlos Sainz', 'SAI', 'williams', 'Williams Racing'],
  63: ['russell', 'George Russell', 'RUS', 'mercedes', 'Mercedes-AMG PETRONAS F1 Team'],
  77: ['bottas', 'Valtteri Bottas', 'BOT', 'cadillac', 'Cadillac Formula 1 Team'],
  81: ['piastri', 'Oscar Piastri', 'PIA', 'mclaren', 'McLaren F1 Team'],
  87: ['bearman', 'Oliver Bearman', 'BEA', 'haas', 'MoneyGram Haas F1 Team'],
};

const TEAM_IDS = [
  ['red bull', 'redbull'],
  ['racing bulls', 'racingbulls'],
  ['mercedes', 'mercedes'],
  ['ferrari', 'ferrari'],
  ['mclaren', 'mclaren'],
  ['aston martin', 'astonmartin'],
  ['williams', 'williams'],
  ['alpine', 'alpine'],
  ['haas', 'haas'],
  ['audi', 'audi'],
  ['cadillac', 'cadillac'],
];

const SESSION_MAP = {
  'Practice 1': ['practice', 'fp1'],
  'Practice 2': ['practice', 'fp2'],
  'Practice 3': ['practice', 'fp3'],
  'Sprint Qualifying': ['qualifying', 'sprintQualifying'],
  Qualifying: ['qualifying', 'qualifying'],
  Sprint: ['qualifying', 'sprint'],
};

async function fetchJson(endpoint, params, attempt = 0) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/${endpoint}?${query}`, {
    headers: { Accept: 'application/json', 'User-Agent': 'PODIUM-F1-Sync/1.0' },
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status === 429 && attempt < 3) {
    const retryAfter = Number(response.headers.get('retry-after')) || 2 ** attempt * 2;
    await new Promise((resolve) => setTimeout(resolve, Math.min(retryAfter, 15) * 1000));
    return fetchJson(endpoint, params, attempt + 1);
  }
  if (!response.ok) throw new Error(`OpenF1 ${endpoint} returned ${response.status}`);
  return response.json();
}

async function resolveRound(session) {
  const response = await fetch('https://api.jolpi.ca/ergast/f1/2026.json?limit=100', {
    headers: { Accept: 'application/json', 'User-Agent': 'PODIUM-F1-Sync/1.0' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Jolpica schedule returned ${response.status}`);
  const payload = await response.json();
  const races = payload?.MRData?.RaceTable?.Races || [];
  const sessionDate = new Date(session.date_start).getTime();
  return races.sort((a, b) => {
    const distanceA = Math.abs(
      new Date(`${a.date}T${a.time || '00:00:00Z'}`).getTime() - sessionDate,
    );
    const distanceB = Math.abs(
      new Date(`${b.date}T${b.time || '00:00:00Z'}`).getTime() - sessionDate,
    );
    return distanceA - distanceB;
  })[0];
}

function teamId(name) {
  const normalized = String(name || '').toLowerCase();
  return TEAM_IDS.find(([token]) => normalized.includes(token))?.[1] || 'redbull';
}

function lapTime(seconds) {
  if (!Number.isFinite(seconds)) return undefined;
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(3).padStart(6, '0')}`;
}

function raceTime(seconds) {
  if (!Number.isFinite(seconds)) return '';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, '0');
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${minutes}:${secs}`;
}

function profile(number, driver) {
  const fallback = DRIVER_FALLBACK[number] || [
    `driver-${number}`,
    `Driver ${number}`,
    `#${number}`,
    teamId(driver?.team_name),
    driver?.team_name || 'Formula 1 Team',
  ];
  return {
    driverId: fallback[0],
    driverName: DRIVER_FALLBACK[number]?.[1] || driver?.full_name || fallback[1],
    driverCode: DRIVER_FALLBACK[number]?.[2] || driver?.name_acronym || fallback[2],
    driverNumber: number,
    teamId: driver?.team_name ? teamId(driver.team_name) : fallback[3],
    teamName: driver?.team_name || fallback[4],
  };
}

function baseEntry(result, driver) {
  return {
    position: Number(result.position),
    ...profile(Number(result.driver_number), driver),
    lapsCompleted: Number(result.number_of_laps) || 0,
  };
}

function buildPracticeSession(session, results, drivers) {
  const byNumber = new Map(drivers.map((driver) => [Number(driver.driver_number), driver]));
  const entries = results.map((result) => {
    const duration = typeof result.duration === 'number' ? result.duration : undefined;
    const gap = typeof result.gap_to_leader === 'number' ? result.gap_to_leader : undefined;
    return {
      ...baseEntry(result, byNumber.get(Number(result.driver_number))),
      bestLapTime: lapTime(duration) || 'No time',
      gapToP1:
        Number(result.position) === 1
          ? 'LEADER'
          : typeof result.gap_to_leader === 'string'
            ? result.gap_to_leader
            : Number.isFinite(gap)
              ? `+${gap.toFixed(3)}s`
              : '',
    };
  });
  return {
    sessionName: session.session_name,
    dateStr: session.date_start,
    status: 'finished',
    fastestDriver: entries[0]
      ? { driver: entries[0].driverName, team: entries[0].teamName, time: entries[0].bestLapTime }
      : undefined,
    entries,
  };
}

function buildQualifyingSession(session, sessionKey, results, drivers) {
  const byNumber = new Map(drivers.map((driver) => [Number(driver.driver_number), driver]));
  const sprint = sessionKey === 'sprint';
  const sprintPoints = [8, 7, 6, 5, 4, 3, 2, 1];
  const entries = results.map((result) => {
    const phases = Array.isArray(result.duration) ? result.duration : [];
    const gaps = Array.isArray(result.gap_to_leader) ? result.gap_to_leader : [];
    const best = [...phases].reverse().find(Number.isFinite);
    const finalGap = [...gaps].reverse().find(Number.isFinite);
    const sprintDisplay =
      Number(result.position) === 1
        ? raceTime(typeof result.duration === 'number' ? result.duration : undefined)
        : typeof result.gap_to_leader === 'string'
          ? result.gap_to_leader
          : Number.isFinite(result.gap_to_leader)
            ? `+${Number(result.gap_to_leader).toFixed(3)}s`
            : '';
    return {
      ...baseEntry(result, byNumber.get(Number(result.driver_number))),
      q1Time: sprint ? undefined : lapTime(phases[0]),
      q2Time: sprint ? undefined : lapTime(phases[1]),
      q3Time: sprint ? undefined : lapTime(phases[2]),
      bestLapTime: sprint ? sprintDisplay : lapTime(best) || 'No time',
      gapToPole:
        Number(result.position) === 1
          ? sprint
            ? 'LEADER'
            : 'POLE'
          : Number.isFinite(finalGap)
            ? `+${Number(finalGap).toFixed(3)}s`
            : '',
      sprintPoints: sprint ? sprintPoints[Number(result.position) - 1] : undefined,
    };
  });
  return {
    sessionKey,
    sessionName: session.session_name,
    dateStr: session.date_start,
    status: 'finished',
    poleDriver: entries[0]
      ? { driver: entries[0].driverName, team: entries[0].teamName, time: entries[0].bestLapTime }
      : undefined,
    entries,
  };
}

async function run() {
  const latest = (await fetchJson('sessions', { session_key: 'latest' }))[0];
  if (!latest) throw new Error('OpenF1 returned no latest session');
  const race = await resolveRound(latest);
  if (!race) throw new Error('Could not match the OpenF1 meeting to the 2026 calendar');
  const round = Number(race.round);

  const existing = fs.existsSync(OUTPUT_FILE)
    ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'))
    : { practice: {}, qualifying: {} };
  const sessions = await fetchJson('sessions', { meeting_key: latest.meeting_key });
  const meetingDrivers = await fetchJson('drivers', { session_key: latest.session_key });
  let changed = false;

  for (const session of sessions) {
    const mapping = SESSION_MAP[session.session_name];
    if (!mapping || new Date(session.date_end).getTime() > Date.now()) continue;
    const [bucket, sessionKey] = mapping;
    const results = await fetchJson('session_result', { session_key: session.session_key });
    const drivers = meetingDrivers;
    if (results.length !== EXPECTED_GRID_SIZE) continue;
    results.sort((a, b) => Number(a.position) - Number(b.position));

    const raceRecord = existing[bucket][round] || {
      round,
      grandPrix: race.raceName,
      season: 2026,
      circuit: latest.circuit_short_name,
      sessions: {},
    };
    const nextSession =
      bucket === 'practice'
        ? { sessionKey, ...buildPracticeSession(session, results, drivers) }
        : buildQualifyingSession(session, sessionKey, results, drivers);
    if (JSON.stringify(raceRecord.sessions[sessionKey]) !== JSON.stringify(nextSession)) {
      raceRecord.sessions[sessionKey] = nextSession;
      existing[bucket][round] = raceRecord;
      changed = true;
    }
  }

  if (!changed) {
    console.log('[OpenF1] No new complete session results.');
    return;
  }
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(existing, null, 2)}\n`, 'utf8');
  console.log(`[OpenF1] Updated session snapshot for round ${round}.`);
}

run().catch((error) => {
  console.error(`[OpenF1] Sync failed: ${error.message}`);
  process.exit(1);
});
