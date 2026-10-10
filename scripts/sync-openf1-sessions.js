/**
 * Persist completed Formula 1 session classifications in the repository.
 * Formula 1's public live-timing archive publishes classifications before
 * slower feeds. Write only when a complete 22-driver classification changes.
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
const LIVE_TIMING_BASE = 'https://livetiming.formula1.com/static';
const EXPECTED_GRID_SIZE = 22;
const USER_AGENT = 'PODIUM-F1-Sync/2.0';

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

async function fetchText(url, attempt = 0) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(25_000),
  });
  if ((response.status === 429 || response.status >= 500) && attempt < 3) {
    await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1500));
    return fetchText(url, attempt + 1);
  }
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return (await response.text()).replace(/^\uFEFF/, '');
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

function mergePatch(target, patch) {
  if (patch === null || typeof patch !== 'object') return patch;
  const result = target && typeof target === 'object' ? target : Array.isArray(patch) ? [] : {};
  for (const [key, value] of Object.entries(patch)) {
    result[key] = mergePatch(result[key], value);
  }
  return result;
}

function parseJsonStream(text) {
  let state = {};
  for (const line of text.split(/\r?\n/)) {
    const payloadStart = line.indexOf('{');
    if (payloadStart < 0) continue;
    state = mergePatch(state, JSON.parse(line.slice(payloadStart)));
  }
  return state;
}

async function fetchStream(sessionPath, fileName) {
  const text = await fetchText(`${LIVE_TIMING_BASE}/${sessionPath}${fileName}`);
  return parseJsonStream(text);
}

function teamId(name) {
  const normalized = String(name || '').toLowerCase();
  return TEAM_IDS.find(([token]) => normalized.includes(token))?.[1] || 'redbull';
}

function profile(number, driver) {
  const fallback = DRIVER_FALLBACK[number] || [
    `driver-${number}`,
    driver?.FullName || `Driver ${number}`,
    driver?.Tla || `#${number}`,
    teamId(driver?.TeamName),
    driver?.TeamName || 'Formula 1 Team',
  ];
  return {
    driverId: fallback[0],
    driverName: fallback[1],
    driverCode: driver?.Tla || fallback[2],
    driverNumber: number,
    teamId: driver?.TeamName ? teamId(driver.TeamName) : fallback[3],
    teamName: driver?.TeamName || fallback[4],
  };
}

function lapTimeToSeconds(value) {
  if (!value || typeof value !== 'string') return undefined;
  const parts = value.split(':').map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return undefined;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return undefined;
}

function formatGap(seconds) {
  return Number.isFinite(seconds) ? `+${seconds.toFixed(3)}s` : '';
}

function cleanGap(value) {
  if (!value) return '';
  const text = String(value).trim();
  if (/^\+?\d+(?:\.\d+)?$/.test(text)) return `+${text.replace(/^\+/, '')}s`;
  if (/L$/i.test(text)) return text;
  return text;
}

function sessionDate(session) {
  const offset = String(session.GmtOffset || '00:00:00');
  const sign = offset.startsWith('-') ? '-' : '+';
  const normalized = offset.replace(/^[+-]/, '').slice(0, 5);
  return new Date(`${session.StartDate}${sign}${normalized}`).toISOString();
}

function baseEntries(timingData, timingStats, drivers) {
  return Object.entries(timingData.Lines || {})
    .map(([numberText, line]) => {
      const number = Number(numberText);
      const position = Number(line.Position);
      const bestLapTime =
        timingStats.Lines?.[numberText]?.PersonalBestLapTime?.Value ||
        line.BestLapTime?.Value ||
        '';
      return {
        position,
        ...profile(number, drivers[numberText]),
        lapsCompleted: Number(line.NumberOfLaps) || 0,
        bestLapTime,
        rawGap: cleanGap(line.GapToLeader),
      };
    })
    .filter((entry) => Number.isInteger(entry.position) && entry.position > 0)
    .sort((a, b) => a.position - b.position);
}

function buildPracticeSession(session, entries) {
  const leaderSeconds = lapTimeToSeconds(entries[0]?.bestLapTime);
  const normalized = entries.map((entry) => {
    const seconds = lapTimeToSeconds(entry.bestLapTime);
    return {
      ...entry,
      bestLapTime: entry.bestLapTime || 'No time',
      gapToP1:
        entry.position === 1
          ? 'LEADER'
          : formatGap(
              Number.isFinite(seconds) && Number.isFinite(leaderSeconds)
                ? seconds - leaderSeconds
                : undefined,
            ),
      rawGap: undefined,
    };
  });
  return {
    sessionKey: SESSION_MAP[session.Name][1],
    sessionName: session.Name,
    dateStr: sessionDate(session),
    status: 'finished',
    fastestDriver: normalized[0]
      ? {
          driver: normalized[0].driverName,
          team: normalized[0].teamName,
          time: normalized[0].bestLapTime,
        }
      : undefined,
    entries: normalized,
  };
}

function buildClassificationSession(session, sessionKey, entries) {
  const sprint = sessionKey === 'sprint';
  const leaderSeconds = lapTimeToSeconds(entries[0]?.bestLapTime);
  const sprintPoints = [8, 7, 6, 5, 4, 3, 2, 1];
  const normalized = entries.map((entry) => {
    const seconds = lapTimeToSeconds(entry.bestLapTime);
    const calculatedGap = formatGap(
      Number.isFinite(seconds) && Number.isFinite(leaderSeconds)
        ? seconds - leaderSeconds
        : undefined,
    );
    const displayGap = sprint ? entry.rawGap : calculatedGap;
    return {
      ...entry,
      bestLapTime: sprint
        ? entry.position === 1
          ? 'LEADER'
          : displayGap || entry.bestLapTime || ''
        : entry.bestLapTime || 'No time',
      gapToPole: entry.position === 1 ? (sprint ? 'LEADER' : 'POLE') : displayGap,
      sprintPoints: sprint ? sprintPoints[entry.position - 1] : undefined,
      rawGap: undefined,
    };
  });
  return {
    sessionKey,
    sessionName: session.Name,
    dateStr: sessionDate(session),
    status: 'finished',
    poleDriver: normalized[0]
      ? {
          driver: normalized[0].driverName,
          team: normalized[0].teamName,
          time: normalized[0].bestLapTime,
        }
      : undefined,
    entries: normalized,
  };
}

async function readSession(session) {
  const [drivers, timingData, timingStats] = await Promise.all([
    fetchStream(session.Path, 'DriverList.jsonStream'),
    fetchStream(session.Path, 'TimingData.jsonStream'),
    fetchStream(session.Path, 'TimingStats.jsonStream'),
  ]);
  const entries = baseEntries(timingData, timingStats, drivers);
  const positions = new Set(entries.map((entry) => entry.position));
  if (entries.length !== EXPECTED_GRID_SIZE || positions.size !== EXPECTED_GRID_SIZE) {
    console.log(
      `[F1 timing] ${session.Name} is not complete (${entries.length}/${EXPECTED_GRID_SIZE}).`,
    );
    return null;
  }
  const [bucket, sessionKey] = SESSION_MAP[session.Name];
  return {
    bucket,
    sessionKey,
    data:
      bucket === 'practice'
        ? buildPracticeSession(session, entries)
        : buildClassificationSession(session, sessionKey, entries),
  };
}

async function run() {
  const index = await fetchJson(`${LIVE_TIMING_BASE}/2026/Index.json`);
  const meetings = (index.Meetings || []).filter((meeting) =>
    meeting.Sessions?.some((session) => SESSION_MAP[session.Name] && session.Path),
  );
  const meeting = meetings.at(-1);
  if (!meeting) throw new Error('No completed 2026 race-weekend session was found');

  const round = Number(meeting.Number);
  if (!Number.isInteger(round)) throw new Error(`Invalid round number for ${meeting.Name}`);
  const existing = fs.existsSync(OUTPUT_FILE)
    ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'))
    : { practice: {}, qualifying: {} };
  let changed = false;

  for (const session of meeting.Sessions || []) {
    if (!SESSION_MAP[session.Name] || !session.Path) continue;
    const result = await readSession(session);
    if (!result) continue;
    const raceRecord = existing[result.bucket][round] || {
      round,
      grandPrix: meeting.Name,
      season: 2026,
      circuit: meeting.Location,
      sessions: {},
    };
    if (JSON.stringify(raceRecord.sessions[result.sessionKey]) !== JSON.stringify(result.data)) {
      raceRecord.sessions[result.sessionKey] = result.data;
      existing[result.bucket][round] = raceRecord;
      changed = true;
    }
  }

  if (!changed) {
    console.log('[F1 timing] No new complete session results.');
    return;
  }
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(existing, null, 2)}\n`, 'utf8');
  console.log(`[F1 timing] Updated complete session snapshot for round ${round}.`);
}

run().catch((error) => {
  console.error(`[F1 timing] Sync failed: ${error.message}`);
  process.exit(1);
});
