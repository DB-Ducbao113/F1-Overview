import { check } from 'k6';
import { apiRequest, assertSafeTarget, assertSimulatedDataMode, config } from './lib.js';

const stableRate = Number(__ENV.STABLE_RATE || 20);
if (!Number.isFinite(stableRate) || stableRate <= 0)
  throw new Error('STABLE_RATE must be a positive number');
const low = Math.max(1, Math.ceil(stableRate * 0.5));
const high = Math.ceil(stableRate * 1.5);
const estimatedRequests = low * 30 + stableRate * 10 + high * 60 + stableRate * 10 + low * 120;
assertSafeTarget(estimatedRequests);
assertSimulatedDataMode();
export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-arrival-rate',
      startRate: low,
      timeUnit: '1s',
      preAllocatedVUs: Math.max(10, high),
      maxVUs: Math.max(40, high * 4),
      stages: [
        { target: low, duration: '30s' },
        { target: high, duration: '10s' },
        { target: high, duration: '1m' },
        { target: low, duration: '10s' },
        { target: low, duration: '2m' },
      ],
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: 'rate<0.05', abortOnFail: true, delayAbortEval: '30s' }],
    http_req_duration: [{ threshold: 'p(95)<5000', abortOnFail: true, delayAbortEval: '30s' }],
    invalid_response: ['rate==0'],
    load_test_requests: [{ threshold: `count<${config.maxRequests}`, abortOnFail: true }],
    data_received: [{ threshold: `count<${config.maxReceivedBytes}`, abortOnFail: true }],
  },
};

export default function () {
  const result = apiRequest('/api/openf1?endpoint=position&session_key=9472&limit=1');
  check(result.response, { 'spike API response is JSON': () => result.valid });
}
