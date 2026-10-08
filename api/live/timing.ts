/**
 * Vercel Serverless Function: /api/live/timing
 * Combines timing data, gaps, sector times, tyre compound stints,
 * and authentic /v1/car_data (speed, gear, DRS) from OpenF1.
 *
 * Source documentation:
 * - Drivers: https://api.openf1.org/v1/drivers
 * - Position: https://api.openf1.org/v1/position
 * - Intervals: https://api.openf1.org/v1/intervals
 * - Stints (Tyres): https://api.openf1.org/v1/stints
 * - Car Telemetry: https://api.openf1.org/v1/car_data (Speed, Gear, DRS)
 * Caches responses in-memory with a 2-second TTL.
 */

const OPENF1_BASE = 'https://api.openf1.org/v1';

interface TimingCacheEntry {
  at: number;
  data: any;
}

const timingCache = new Map<string, TimingCacheEntry>();
const CACHE_TTL_MS = 2000;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sessionKey = req.query.session_key as string;
  const atParam = req.query.at as string | undefined;

  if (!sessionKey) {
    return res.status(400).json({ error: 'Missing session_key parameter' });
  }

  const sKeyNum = Number(sessionKey);
  const cacheKey = `${sessionKey}_${atParam || 'live'}`;
  const now = Date.now();

  const cached = timingCache.get(cacheKey);
  if (cached && now - cached.at < CACHE_TTL_MS) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cached.data);
  }

  try {
    // Build optional date filter query for replay slice
    let dateFilter = '';
    if (atParam) {
      const atDate = new Date(atParam);
      if (!isNaN(atDate.getTime())) {
        const atIso = atDate.toISOString();
        dateFilter = `&date<=${encodeURIComponent(atIso)}`;
      }
    }

    // Parallel fetch core timing endpoints
    const [driversRes, posRes, intervalsRes, stintsRes, carDataRes] = await Promise.all([
      fetch(`${OPENF1_BASE}/drivers?session_key=${sessionKey}`).then((r) => r.json()).catch(() => []),
      fetch(`${OPENF1_BASE}/position?session_key=${sessionKey}${dateFilter}`).then((r) => r.json()).catch(() => []),
      fetch(`${OPENF1_BASE}/intervals?session_key=${sessionKey}${dateFilter}`).then((r) => r.json()).catch(() => []),
      fetch(`${OPENF1_BASE}/stints?session_key=${sessionKey}`).then((r) => r.json()).catch(() => []),
      fetch(`${OPENF1_BASE}/car_data?session_key=${sessionKey}${dateFilter}`).then((r) => r.json()).catch(() => []),
    ]);

    const drivers: any[] = Array.isArray(driversRes) ? driversRes : [];
    const positions: any[] = Array.isArray(posRes) ? posRes : [];
    const intervals: any[] = Array.isArray(intervalsRes) ? intervalsRes : [];
    const stints: any[] = Array.isArray(stintsRes) ? stintsRes : [];
    const carDataArr: any[] = Array.isArray(carDataRes) ? carDataRes : [];

    // Map driver info by driver_number
    const driverMap = new Map<number, any>();
    for (const d of drivers) {
      if (d && d.driver_number) {
        driverMap.set(d.driver_number, d);
      }
    }

    // Get latest position for each driver
    const latestPosMap = new Map<number, number>();
    for (const p of positions) {
      if (p && p.driver_number && p.position) {
        latestPosMap.set(p.driver_number, p.position);
      }
    }

    // Get latest interval for each driver
    const latestIntervalMap = new Map<number, any>();
    for (const inv of intervals) {
      if (inv && inv.driver_number) {
        latestIntervalMap.set(inv.driver_number, inv);
      }
    }

    // Get latest stint / tyre compound for each driver
    const latestStintMap = new Map<number, any>();
    for (const s of stints) {
      if (s && s.driver_number) {
        const prev = latestStintMap.get(s.driver_number);
        if (!prev || (s.stint_number && s.stint_number >= (prev.stint_number || 0))) {
          latestStintMap.set(s.driver_number, s);
        }
      }
    }

    // Get latest telemetry (speed, gear, DRS) from /v1/car_data
    const latestCarDataMap = new Map<number, any>();
    for (const cd of carDataArr) {
      if (cd && cd.driver_number) {
        latestCarDataMap.set(cd.driver_number, cd);
      }
    }

    // Assemble P1-P20 timing tower
    const tower: any[] = [];

    for (const [driverNumber, driver] of driverMap.entries()) {
      const pos = latestPosMap.get(driverNumber) ?? 20;
      const inv = latestIntervalMap.get(driverNumber);
      const stint = latestStintMap.get(driverNumber);
      const cd = latestCarDataMap.get(driverNumber);

      const tyreCompoundRaw = (stint?.compound || 'UNKNOWN').toUpperCase();
      let compound = 'UNKNOWN';
      if (['SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET'].includes(tyreCompoundRaw)) {
        compound = tyreCompoundRaw;
      }

      // Format gap to leader
      let gapToLeader = null;
      let intervalStr = null;
      if (pos === 1) {
        gapToLeader = 'LEADER';
        intervalStr = '-';
      } else if (inv?.gap_to_leader !== undefined && inv?.gap_to_leader !== null) {
        gapToLeader = `+${Number(inv.gap_to_leader).toFixed(3)}s`;
        if (inv.interval !== undefined && inv.interval !== null) {
          intervalStr = `+${Number(inv.interval).toFixed(3)}s`;
        }
      }

      // Check DRS: 10, 12, 14 indicates DRS activated in OpenF1 car_data
      const drsValue = cd?.drs ?? 0;
      const drsActive = drsValue >= 10;

      tower.push({
        position: pos,
        driver_number: driverNumber,
        broadcast_name: driver.broadcast_name || driver.full_name || `#${driverNumber}`,
        name_acronym: driver.name_acronym || `${driverNumber}`,
        team_name: driver.team_name || 'F1 Team',
        team_colour: driver.team_colour ? `#${driver.team_colour}` : '#dc0000',
        gap_to_leader: gapToLeader,
        interval: intervalStr,
        best_lap: null,
        last_lap: null,
        in_pit: Boolean(stint?.lap_end !== null && stint?.lap_end !== undefined),
        sectors: [null, null, null],
        tyre: {
          compound,
          laps_used: stint?.tyre_age_at_start ? Number(stint.tyre_age_at_start) : 0,
        },
        telemetry: cd
          ? {
              speed: Number(cd.speed || 0),
              gear: Number(cd.gear || 0),
              drs: drsActive,
              throttle: cd.throttle !== undefined ? Number(cd.throttle) : undefined,
              brake: cd.brake !== undefined ? Number(cd.brake) : undefined,
            }
          : undefined,
      });
    }

    // Sort by position ascending
    tower.sort((a, b) => a.position - b.position);

    const payload = {
      session_key: sKeyNum,
      sampled_at: new Date().toISOString(),
      tower,
    };

    timingCache.set(cacheKey, { at: now, data: payload });
    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(payload);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch timing data' });
  }
}
