import { afterEach, describe, expect, it, vi } from 'vitest';

import jolpicaHandler from '../../api/jolpica';
import { applySimulatedFault } from '../../server/loadTest';
// The same dependency-free module runs in k6 and Node; it intentionally lives outside src.
// @ts-expect-error JavaScript safety helpers do not ship TypeScript declarations.
import * as loadTestSafety from '../../scripts/load-test/safety.js';

const { assertRequestCeiling, requireSimulatedDataMode, validateLoadTestTarget } = loadTestSafety;

function mockResponse() {
  const headers = new Map<string, string>();
  const response = {
    statusCode: 200,
    body: undefined as unknown,
    headers,
    setHeader(name: string, value: string) {
      headers.set(name, value);
      return response;
    },
    status(code: number) {
      response.statusCode = code;
      return response;
    },
    json(payload: unknown) {
      response.body = payload;
      return response;
    },
    end() {
      return response;
    },
  };
  return response;
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('load-test target guards', () => {
  it('accepts only the exact HTTPS preview hostname', () => {
    expect(
      validateLoadTestTarget({
        baseUrl: 'https://preview.example.test',
        allowedHost: 'preview.example.test',
        productionHost: 'podiumeds.vercel.app',
      }),
    ).toBe('preview.example.test');

    expect(() =>
      validateLoadTestTarget({
        baseUrl: 'https://podiumeds.vercel.app',
        allowedHost: 'podiumeds.vercel.app',
        productionHost: 'podiumeds.vercel.app',
      }),
    ).toThrow('production hostname');
    expect(() =>
      validateLoadTestTarget({
        baseUrl: 'https://unexpected.example.test',
        allowedHost: 'preview.example.test',
      }),
    ).toThrow('must equal ALLOWED_STAGING_HOST');
  });

  it('requires simulated data for high-load scripts', () => {
    expect(() => requireSimulatedDataMode('live')).toThrow('DATA_MODE=simulated');
    expect(() => requireSimulatedDataMode('simulated')).not.toThrow();
  });

  it('rejects a plan above its request ceiling', () => {
    expect(() => assertRequestCeiling(20_000, 20_000)).not.toThrow();
    expect(() => assertRequestCeiling(20_001, 20_000)).toThrow('exceeds MAX_REQUESTS');
    expect(() => assertRequestCeiling(-1, 20_000)).toThrow('non-negative');
  });
});

describe('preview-only Jolpica simulation', () => {
  it('serves an isolated fixture in preview with the matching token', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('LOAD_TEST_TOKEN', 'test-secret');
    const response = mockResponse();

    await jolpicaHandler(
      {
        method: 'GET',
        headers: {
          host: 'preview.example.test',
          'x-load-test-mode': 'simulated',
          'x-load-test-token': 'test-secret',
        },
        query: { path: 'ergast/f1/2026/results.json', limit: '1', offset: '0' },
      },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.headers.get('X-Load-Test-Mode')).toBe('simulated');
    expect((response.body as any).MRData.RaceTable.Races).toHaveLength(1);
  });

  it('rejects simulated mode outside Vercel preview', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('LOAD_TEST_TOKEN', 'test-secret');
    const response = mockResponse();

    await jolpicaHandler(
      {
        method: 'GET',
        headers: {
          host: 'podiumeds.vercel.app',
          'x-load-test-mode': 'simulated',
          'x-load-test-token': 'test-secret',
        },
        query: { path: 'ergast/f1/2026/results.json' },
      },
      response,
    );

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ error: 'Load-test mode is preview-only' });
  });
});

describe('simulated fault responses', () => {
  it.each([
    ['429', 429],
    ['503', 503],
  ] as const)('returns %s without contacting an upstream API', async (fault, status) => {
    const response = mockResponse();
    expect(await applySimulatedFault(response, fault)).toBe(true);
    expect(response.statusCode).toBe(status);
    expect(response.headers.get('Cache-Control')).toBe('private, no-store');
  });

  it('covers slow and timeout schedules with fake timers', async () => {
    vi.useFakeTimers();
    const slowResponse = mockResponse();
    const slow = applySimulatedFault(slowResponse, 'slow');
    await vi.advanceTimersByTimeAsync(750);
    expect(await slow).toBe(false);

    const timeoutResponse = mockResponse();
    const timeout = applySimulatedFault(timeoutResponse, 'timeout');
    await vi.advanceTimersByTimeAsync(9_000);
    expect(await timeout).toBe(true);
    expect(timeoutResponse.statusCode).toBe(504);
  });
});
