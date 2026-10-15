/**
 * Preview-only controls for controlled load tests. They are deliberately
 * header-gated so a browser client cannot switch an API response to fixtures.
 */

type LoadTestFault = 'slow' | 'timeout' | '429' | '503';

export type LoadTestControl = { enabled: false } | { enabled: true; fault: LoadTestFault | null };

function readEnv(name: string): string {
  const proc = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
    .process;
  return proc?.env?.[name] || '';
}

function header(req: any, name: string): string {
  const value = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
}

export function getLoadTestControl(req: any): LoadTestControl | 'forbidden' {
  const requested = header(req, 'x-load-test-mode') === 'simulated';
  if (!requested) return { enabled: false };

  const token = readEnv('LOAD_TEST_TOKEN');
  const isPreview = readEnv('VERCEL_ENV') === 'preview';
  if (!isPreview || !token || header(req, 'x-load-test-token') !== token) return 'forbidden';

  const faultValue = header(req, 'x-load-test-fault');
  const fault: LoadTestFault | null = ['slow', 'timeout', '429', '503'].includes(faultValue)
    ? (faultValue as LoadTestFault)
    : null;
  return { enabled: true, fault };
}

export async function applySimulatedFault(res: any, fault: LoadTestFault | null): Promise<boolean> {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Load-Test-Mode', 'simulated');
  if (!fault) return false;
  if (fault === 'slow') {
    await new Promise((resolve) => setTimeout(resolve, 750));
    return false;
  }
  if (fault === 'timeout') {
    await new Promise((resolve) => setTimeout(resolve, 9000));
    res.status(504).json({ error: 'simulated timeout' });
    return true;
  }
  res.status(fault === '429' ? 429 : 503).json({ error: `simulated ${fault}` });
  return true;
}

export function simulatedOpenF1Payload(endpoint: string): unknown[] {
  const timestamp = '2026-01-01T00:00:00.000Z';
  const payloads: Record<string, unknown[]> = {
    sessions: [
      {
        session_key: 9472,
        session_name: 'Race',
        session_type: 'Race',
        circuit_short_name: 'Bahrain',
        country_name: 'Bahrain',
        country_code: 'BHR',
        location: 'Sakhir',
        year: 2024,
        date_start: timestamp,
        date_end: timestamp,
      },
    ],
    drivers: [
      {
        driver_number: 1,
        name_acronym: 'VER',
        broadcast_name: 'M. Verstappen',
        full_name: 'Max Verstappen',
        team_name: 'Red Bull Racing',
        team_colour: '3671C6',
      },
    ],
    location: [{ driver_number: 1, x: 100, y: 200, z: 0, date: timestamp }],
    car_data: [{ driver_number: 1, speed: 280, gear: 7, drs: 12, date: timestamp }],
    position: [{ driver_number: 1, position: 1, date: timestamp }],
    race_control: [{ category: 'Flag', flag: 'GREEN', message: 'TRACK CLEAR', date: timestamp }],
    meetings: [{ meeting_key: 1, meeting_name: 'Bahrain Grand Prix', year: 2024 }],
  };
  return payloads[endpoint] || [];
}

export function simulatedJolpicaPayload(path: string, limit: number, offset: number): unknown {
  const race = {
    season: path.split('/')[2],
    round: '1',
    raceName: 'Bahrain Grand Prix',
    date: '2026-03-08',
    Results: [
      {
        number: '1',
        position: '1',
        points: '25',
        Driver: { driverId: 'verstappen', givenName: 'Max', familyName: 'Verstappen' },
        Constructor: { constructorId: 'red_bull', name: 'Red Bull' },
      },
    ],
  };
  return {
    MRData: {
      limit: String(limit),
      offset: String(offset),
      total: '1',
      RaceTable: { season: race.season, Races: offset === 0 ? [race] : [] },
    },
  };
}
