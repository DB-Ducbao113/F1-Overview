import { check } from 'k6';
import { apiRequest, assertSafeTarget, assertSimulatedDataMode, config } from './lib.js';

const stableRate = Number(__ENV.STABLE_RATE || 10);
const duration = __ENV.DURATION || '30m';
const durationSeconds =
  Number((duration.match(/^(\d+)(s|m)$/) || [])[1]) * (duration.endsWith('m') ? 60 : 1);
const rate = Math.max(1, Math.floor(stableRate * 0.7));
if (!Number.isFinite(stableRate) || !Number.isFinite(durationSeconds))
  throw new Error('STABLE_RATE must be numeric and DURATION must be Ns or Nm');
assertSafeTarget(rate * durationSeconds);
assertSimulatedDataMode();
export const options = {
  scenarios: {
    soak: {
      executor: 'constant-arrival-rate',
      rate,
      timeUnit: '1s',
      duration,
      preAllocatedVUs: Math.max(5, rate),
      maxVUs: Math.max(30, rate * 4),
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '30s' }],
    http_req_duration: ['p(95)<2000', 'p(99)<4000'],
    invalid_response: ['rate==0'],
    load_test_requests: [{ threshold: `count<${config.maxRequests}`, abortOnFail: true }],
    data_received: [{ threshold: `count<${config.maxReceivedBytes}`, abortOnFail: true }],
  },
};

export default function () {
  const result = apiRequest('/api/jolpica?path=ergast/f1/2026/results.json&limit=1&offset=0');
  check(result.response, { 'soak API response is JSON': () => result.valid });
}
