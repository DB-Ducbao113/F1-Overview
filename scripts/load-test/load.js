import { check } from 'k6';
import { apiRequest, assertSafeTarget, config } from './lib.js';

const rate = Number(__ENV.RATE || 1);
const duration = __ENV.DURATION || '2m';
const durationSeconds =
  Number((duration.match(/^(\d+)(s|m)$/) || [])[1]) * (duration.endsWith('m') ? 60 : 1);
if (!Number.isFinite(rate) || !Number.isFinite(durationSeconds))
  throw new Error('RATE must be numeric and DURATION must be Ns or Nm');
assertSafeTarget(rate * durationSeconds);
export const options = {
  scenarios: {
    load: {
      executor: 'constant-arrival-rate',
      rate,
      timeUnit: '1s',
      duration,
      preAllocatedVUs: Math.max(2, rate),
      maxVUs: Math.max(20, rate * 4),
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '30s' }],
    http_req_duration: [
      { threshold: 'p(95)<2000', abortOnFail: true, delayAbortEval: '30s' },
      'p(99)<4000',
    ],
    invalid_response: ['rate==0'],
    load_test_requests: [{ threshold: `count<${config.maxRequests}`, abortOnFail: true }],
    data_received: [{ threshold: `count<${config.maxReceivedBytes}`, abortOnFail: true }],
  },
};

export default function () {
  const path =
    __ITER % 2 === 0
      ? '/api/openf1?endpoint=position&session_key=9472&limit=1'
      : '/api/jolpica?path=ergast/f1/2026/results.json&limit=1&offset=0';
  const result = apiRequest(path);
  check(result.response, { 'API returned valid JSON': () => result.valid });
}
