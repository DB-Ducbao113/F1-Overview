import { check, sleep } from 'k6';
import { apiRequest, assertSafeTarget } from './lib.js';

assertSafeTarget(24);
export const options = {
  vus: 1,
  duration: '2m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
    invalid_response: ['rate==0'],
  },
};
export default function () {
  const result = apiRequest('/api/openf1?endpoint=position&session_key=9472&limit=1');
  check(result.response, { 'recovered JSON response': () => result.valid });
  sleep(5);
}
