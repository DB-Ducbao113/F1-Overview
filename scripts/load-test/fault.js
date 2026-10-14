import { check } from 'k6';
import { apiRequest, assertSafeTarget } from './lib.js';

const fault = __ENV.FAULT || '503';
if (!['slow', 'timeout', '429', '503'].includes(fault))
  throw new Error('FAULT must be slow, timeout, 429, or 503');
assertSafeTarget(30);
export const options = { vus: 1, iterations: 10, thresholds: { http_req_failed: ['rate<1'] } };

export default function () {
  const result = apiRequest('/api/openf1?endpoint=position&session_key=9472&limit=1', fault);
  const expectedStatus =
    fault === '429' ? 429 : fault === '503' ? 503 : fault === 'timeout' ? 504 : 200;
  check(result.response, {
    'simulated fault matches schedule': (r) => r.status === expectedStatus,
    'simulation marker returned': (r) => r.headers['X-Load-Test-Mode'] === 'simulated',
  });
}
