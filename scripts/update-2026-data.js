/**
 * Auto-update 2026 Season Data from Jolpica F1 API
 * -------------------------------------------------
 * Fetches standings (driver + constructor), race results, and sprint results
 * from the Jolpica Ergast API and writes them directly into the source files.
 *
 * Usage:
 *   node scripts/update-2026-data.js
 *   node scripts/update-2026-data.js --dry-run   (preview without writing)
 */

import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IS_DRY_RUN = process.argv.includes('--dry-run');

const API_BASE = 'https://api.jolpi.ca/ergast/f1';

// ─── Constructor ID mapping (Jolpica → our TeamId) ─────────────────────────
const CONSTRUCTOR_MAP = {
  red_bull: 'redbull',
  cadillac: 'cadillac',
  ferrari: 'ferrari',
  mclaren: 'mclaren',
  mercedes: 'mercedes',
  aston_martin: 'astonmartin',
  alpine: 'alpine',
  rb: 'racingbulls',
  sauber: 'audi',
  audi: 'audi',
  haas: 'haas',
  williams: 'williams',
};

const ENGINE_MAP = {
  mercedes: 'Mercedes',
  ferrari: 'Ferrari',
  redbull: 'Red Bull Ford',
  mclaren: 'Mercedes',
  alpine: 'Mercedes',
  astonmartin: 'Honda',
  racingbulls: 'Red Bull Ford',
  haas: 'Ferrari',
  audi: 'Audi',
  williams: 'Mercedes',
  cadillac: 'Ferrari',
};

const DRIVER_FLAGS = {
  antonelli: '🇮🇹',
  russell: '🇬🇧',
  hamilton: '🇬🇧',
  norris: '🇬🇧',
  leclerc: '🇲🇨',
  max_verstappen: '🇳🇱',
  piastri: '🇦🇺',
  hadjar: '🇫🇷',
  lawson: '🇳🇿',
  gasly: '🇫🇷',
  arvid_lindblad: '🇬🇧',
  colapinto: '🇦🇷',
  bearman: '🇬🇧',
  bortoleto: '🇧🇷',
  hulkenberg: '🇩🇪',
  ocon: '🇫🇷',
  sainz: '🇪🇸',
  albon: '🇹🇭',
  alonso: '🇪🇸',
  tsunoda: '🇯🇵',
  stroll: '🇨🇦',
  bottas: '🇫🇮',
  perez: '🇲🇽',
};

// Map Jolpica driver IDs to our driverIds
const DRIVER_ID_MAP = {
  max_verstappen: 'verstappen',
  arvid_lindblad: 'lindblad',
};

function mapDriverId(jolpicaId) {
  return DRIVER_ID_MAP[jolpicaId] || jolpicaId;
}

function mapTeamId(constructorId) {
  return CONSTRUCTOR_MAP[constructorId] || constructorId;
}

// ─── HTTP fetch helper ─────────────────────────────────────────────────────
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        { headers: { 'User-Agent': 'F1-Hub-Sync/1.0', Accept: 'application/json' } },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(data));
              else reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
            } catch (e) {
              reject(e);
            }
          });
        },
      )
      .on('error', reject);
  });
}

/**
 * Paginated fetch: Jolpica caps at 100 result entries per page.
 * This merges all Race objects across pages, deduplicating by round and
 * merging Results arrays for the same round that span pages.
 */
async function fetchAllRaces(endpoint) {
  const LIMIT = 100;
  let offset = 0;
  const raceMap = new Map();

  // First page to get total
  const firstPage = await fetchJson(`${API_BASE}/2026/${endpoint}?limit=${LIMIT}&offset=0`);
  const total = parseInt(firstPage.MRData.total, 10);
  const resultKey = endpoint === 'sprint.json' ? 'SprintResults' : 'Results';

  const mergeRaces = (races) => {
    for (const race of races) {
      const round = race.round;
      if (raceMap.has(round)) {
        const existing = raceMap.get(round);
        const existingEntries = existing[resultKey] || [];
        const newEntries = race[resultKey] || [];
        // Merge entries, avoiding duplicates by position
        const positionSet = new Set(existingEntries.map((e) => e.position));
        for (const entry of newEntries) {
          if (!positionSet.has(entry.position)) {
            existingEntries.push(entry);
            positionSet.add(entry.position);
          }
        }
        existing[resultKey] = existingEntries;
      } else {
        raceMap.set(round, { ...race });
      }
    }
  };

  mergeRaces(firstPage.MRData.RaceTable.Races || []);
  offset += LIMIT;

  while (offset < total) {
    const page = await fetchJson(`${API_BASE}/2026/${endpoint}?limit=${LIMIT}&offset=${offset}`);
    mergeRaces(page.MRData.RaceTable.Races || []);
    offset += LIMIT;
  }

  // Sort races by round and sort entries within each race by position
  const allRaces = [...raceMap.values()].sort((a, b) => parseInt(a.round) - parseInt(b.round));
  for (const race of allRaces) {
    if (race[resultKey]) {
      race[resultKey].sort((a, b) => parseInt(a.position) - parseInt(b.position));
    }
    // Ensure Results key exists for race results
    if (endpoint === 'results.json' && !race.Results) race.Results = race[resultKey] || [];
  }

  return allRaces;
}

// ─── Generate standings.ts content for 2026 section ────────────────────────
function generateDriverStandings(driverStandings) {
  const lines = driverStandings.map((d) => {
    const driverId = mapDriverId(d.Driver.driverId);
    const code = d.Driver.code || d.Driver.familyName.slice(0, 3).toUpperCase();
    const name = `${d.Driver.givenName} ${d.Driver.familyName}`;
    const teamId = mapTeamId(d.Constructors[0]?.constructorId);
    const teamName = d.Constructors[0]?.name || 'Constructor';
    const flag = DRIVER_FLAGS[d.Driver.driverId] || '🏁';
    return `  { rank: ${d.position}, driverId: '${driverId}', driverName: '${name}', driverCode: '${code}', teamId: '${teamId}', teamName: '${teamName}', points: ${d.points}, wins: ${d.wins}, podiums: 0, countryFlag: '${flag}' },`;
  });
  return lines.join('\n');
}

function generateConstructorStandings(constructorStandings) {
  const lines = constructorStandings.map((c) => {
    const teamId = mapTeamId(c.Constructor.constructorId);
    const teamName = c.Constructor.name;
    const engine = ENGINE_MAP[teamId] || 'Hybrid Turbo V6';
    return `  { rank: ${c.position}, teamId: '${teamId}', teamName: '${teamName}', points: ${c.points}, wins: ${c.wins}, podiums: 0, engine: '${engine}' },`;
  });
  return lines.join('\n');
}

// ─── Generate race results for results.ts ──────────────────────────────────
function generateRaceResults(races) {
  const today = new Date().toISOString().split('T')[0];
  const lines = races
    .map((race) => {
      const results = race.Results || [];
      const p1 = results[0];
      const p2 = results[1];
      const p3 = results[2];
      if (!p1 || !p2 || !p3) return null;

      const flEntry = results.find((r) => r.FastestLap?.rank === '1');

      const formatDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00Z');
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        return `${String(d.getUTCDate()).padStart(2, '0')} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
      };

      const podiumEntry = (entry, isWinner) => {
        const driver = `${entry.Driver.givenName} ${entry.Driver.familyName}`;
        const team = entry.Constructor.name;
        const time = isWinner ? entry.Time?.time || '' : entry.Time?.time || entry.status || '';
        const points = parseInt(entry.points, 10);
        if (isWinner) {
          return `{ driver: '${driver}', team: '${team}', time: '${time}', points: ${points} }`;
        } else {
          return `{ driver: '${driver}', team: '${team}', gap: '${time}', points: ${points} }`;
        }
      };

      let fastestLapStr = '';
      if (flEntry) {
        const flDriver = `${flEntry.Driver.givenName} ${flEntry.Driver.familyName}`;
        const flTeam = flEntry.Constructor.name;
        const flTime = flEntry.FastestLap?.Time?.time || '';
        fastestLapStr = `\n    fastestLap: { driver: '${flDriver}', team: '${flTeam}', time: '${flTime}' },`;
      }

      return `  {
    round: ${race.round},
    grandPrix: '${race.raceName.replace(/'/g, "\\'")}',
    circuit: '${(race.Circuit?.circuitName || 'Circuit').replace(/'/g, "\\'")}',
    season: 2026,
    dataSource: 'Jolpica F1 API',
    dataUpdatedAt: '${today}',
    date: '${formatDate(race.date)}',
    podium: {
      p1: ${podiumEntry(p1, true)},
      p2: ${podiumEntry(p2, false)},
      p3: ${podiumEntry(p3, false)},
    },${fastestLapStr}
  },`;
    })
    .filter(Boolean);

  return lines.join('\n');
}

// ─── Main pipeline ─────────────────────────────────────────────────────────
async function run() {
  console.log('[Update 2026] Fetching data from Jolpica API...');

  // 1. Driver Standings
  console.log('[Update 2026] → Driver Standings...');
  const driverData = await fetchJson(`${API_BASE}/2026/driverStandings.json`);
  const driverStandings = driverData.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  const roundAfter = driverData.MRData.StandingsTable.StandingsLists[0].round;
  console.log(`  ✓ ${driverStandings.length} drivers after round ${roundAfter}`);

  // 2. Constructor Standings
  console.log('[Update 2026] → Constructor Standings...');
  const constructorData = await fetchJson(`${API_BASE}/2026/constructorStandings.json`);
  const constructorStandings =
    constructorData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
  console.log(`  ✓ ${constructorStandings.length} constructors`);

  // 3. Race Results (paginated — Jolpica caps at 100 entries per page)
  console.log('[Update 2026] → Race Results (paginated)...');
  const races = await fetchAllRaces('results.json');
  console.log(
    `  ✓ ${races.length} completed races (${races.reduce((s, r) => s + (r.Results || []).length, 0)} total entries)`,
  );

  // 4. Sprint Results (paginated)
  console.log('[Update 2026] → Sprint Results (paginated)...');
  let sprintRaces = [];
  try {
    sprintRaces = await fetchAllRaces('sprint.json');
    console.log(`  ✓ ${sprintRaces.length} sprint weekends`);
  } catch (e) {
    console.log(`  ⚠ Sprint data unavailable: ${e.message}`);
  }

  // ─── Leader info ───
  const leader = driverStandings[0];
  const leaderName = `${leader.Driver.givenName} ${leader.Driver.familyName}`;
  const leaderTeam = constructorStandings[0].Constructor.name;
  const leaderTeamPts = constructorStandings[0].points;

  console.log(`\n[Update 2026] Championship Leader: ${leaderName} (${leader.points} pts)`);
  console.log(`[Update 2026] Constructors Leader: ${leaderTeam} (${leaderTeamPts} pts)`);

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE standings.ts (only the 2026 section)
  // ═══════════════════════════════════════════════════════════════════════════
  const standingsFile = path.join(__dirname, '..', 'src', 'data', 'championship', 'standings.ts');
  let standingsContent = fs.readFileSync(standingsFile, 'utf-8');

  // Replace DRIVER_STANDINGS_2026
  const driverStart = standingsContent.indexOf(
    'export const DRIVER_STANDINGS_2026: DriverStanding[] = [',
  );
  const driverEnd = standingsContent.indexOf('];', driverStart) + 2;
  const newDriverStandings = `export const DRIVER_STANDINGS_2026: DriverStanding[] = [\n${generateDriverStandings(driverStandings)}\n];`;
  standingsContent =
    standingsContent.slice(0, driverStart) + newDriverStandings + standingsContent.slice(driverEnd);

  // Replace CONSTRUCTOR_STANDINGS_2026
  const ctorStart = standingsContent.indexOf(
    'export const CONSTRUCTOR_STANDINGS_2026: ConstructorStanding[] = [',
  );
  const ctorEnd = standingsContent.indexOf('];', ctorStart) + 2;
  const newCtorStandings = `export const CONSTRUCTOR_STANDINGS_2026: ConstructorStanding[] = [\n${generateConstructorStandings(constructorStandings)}\n];`;
  standingsContent =
    standingsContent.slice(0, ctorStart) + newCtorStandings + standingsContent.slice(ctorEnd);

  // Update metadata in STANDINGS_DATA
  const today = new Date().toISOString().split('T')[0];
  standingsContent = standingsContent.replace(/lastUpdated: '[^']*'/, `lastUpdated: '${today}'`);
  standingsContent = standingsContent.replace(
    /notes: 'Official Live Standings after \d+ events[^']*'/,
    () =>
      `notes: 'Official Live Standings after ${roundAfter} events · ${leaderTeam} & ${leaderName} Leading'`,
  );
  standingsContent = standingsContent.replace(
    /leaderTitle: 'Current Championship Leader:[^']*'/,
    `leaderTitle: 'Current Championship Leader: ${leaderName} (${leader.points} pts) · ${leaderTeam} (${leaderTeamPts} pts)'`,
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE results.ts (RACE_RESULTS_2026)
  // ═══════════════════════════════════════════════════════════════════════════
  const resultsFile = path.join(__dirname, '..', 'src', 'data', 'championship', 'results.ts');
  let resultsContent = fs.readFileSync(resultsFile, 'utf-8');

  const rr26Start = resultsContent.indexOf('export const RACE_RESULTS_2026: RaceResult[] = [');
  const rr26End = resultsContent.indexOf('];', rr26Start) + 2;
  const newRaceResults = `export const RACE_RESULTS_2026: RaceResult[] = [\n${generateRaceResults(races)}\n];`;
  resultsContent =
    resultsContent.slice(0, rr26Start) + newRaceResults + resultsContent.slice(rr26End);

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE standingsEngine.ts — change round cutoff
  // ═══════════════════════════════════════════════════════════════════════════
  const engineFile = path.join(__dirname, '..', 'src', 'services', 'standingsEngine.ts');
  let engineContent = fs.readFileSync(engineFile, 'utf-8');

  // Update comments and round > XX references
  engineContent = engineContent.replace(
    /\/\/ For 2026 \(ongoing season after \d+ events\):/,
    `// For 2026 (ongoing season after ${roundAfter} events):`,
  );
  engineContent = engineContent.replace(
    /\/\/ \(Rounds 1-\d+ are already included in the official base points above\)/,
    `// (Rounds 1-${roundAfter} are already included in the official base points above)`,
  );
  engineContent = engineContent.replace(/r\.round > \d+/, `r.round > ${roundAfter}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE useChampionshipStore.ts — change round cutoff
  // ═══════════════════════════════════════════════════════════════════════════
  const storeFile = path.join(__dirname, '..', 'src', 'store', 'useChampionshipStore.ts');
  let storeContent = fs.readFileSync(storeFile, 'utf-8');

  storeContent = storeContent.replace(
    /r\.round > \d+ && r\.status/g,
    `r.round > ${roundAfter} && r.status`,
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // WRITE FILES
  // ═══════════════════════════════════════════════════════════════════════════
  if (IS_DRY_RUN) {
    console.log('\n[Update 2026] DRY RUN — no files written.');
    console.log('  standings.ts: would update driver & constructor standings');
    console.log('  results.ts: would update race results');
    console.log('  standingsEngine.ts: would update round cutoff');
    console.log('  useChampionshipStore.ts: would update round cutoff');
  } else {
    fs.writeFileSync(standingsFile, standingsContent, 'utf-8');
    console.log(`\n✅ Updated: ${standingsFile}`);

    fs.writeFileSync(resultsFile, resultsContent, 'utf-8');
    console.log(`✅ Updated: ${resultsFile}`);

    fs.writeFileSync(engineFile, engineContent, 'utf-8');
    console.log(`✅ Updated: ${engineFile}`);

    fs.writeFileSync(storeFile, storeContent, 'utf-8');
    console.log(`✅ Updated: ${storeFile}`);
  }

  console.log('\n[Update 2026] ✓ Synchronization complete!');
  console.log(`  Season: 2026 (after ${roundAfter} rounds)`);
  console.log(`  Driver Champion Leader: ${leaderName} (${leader.points} pts)`);
  console.log(`  Constructor Leader: ${leaderTeam} (${leaderTeamPts} pts)`);
  console.log(`  Races synced: ${races.length}`);
  console.log(`  Sprint weekends: ${sprintRaces.length}`);
}

run().catch((err) => {
  console.error('[Update 2026] FATAL:', err.message);
  process.exit(1);
});
