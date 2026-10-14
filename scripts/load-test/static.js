import { check } from 'k6';
import http from 'k6/http';
import { assertSafeTarget, config, headers } from './lib.js';

const rate = Number(__ENV.RATE || 1);
const duration = __ENV.DURATION || '2m';
const durationSeconds =
  Number((duration.match(/^(\d+)(s|m)$/) || [])[1]) * (duration.endsWith('m') ? 60 : 1);
if (!Number.isFinite(rate) || !Number.isFinite(durationSeconds))
  throw new Error('RATE must be numeric and DURATION must be Ns or Nm');
assertSafeTarget(rate * durationSeconds);

const paths = ['/', '/logo/logo.png', '/models/c42.v2.glb', '/showroom'];
export const options = {
  scenarios: {
    static_cdn: {
      executor: 'constant-arrival-rate',
      rate,
      timeUnit: '1s',
      duration,
      preAllocatedVUs: Math.max(2, rate),
      maxVUs: Math.max(20, rate * 4),
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    data_received: [{ threshold: `count<${config.maxReceivedBytes}`, abortOnFail: true }],
  },
};

export default function () {
  const path = paths[__ITER % paths.length];
  const response = http.get(`${config.baseUrl}${path}`, {
    headers: headers(),
    tags: { kind: 'static', path },
  });
  check(response, {
    'static response succeeds': (r) => r.status === 200,
    'records Vercel cache evidence': (r) =>
      Boolean(r.headers['X-Vercel-Cache'] || r.headers['x-vercel-cache']),
  });
}
