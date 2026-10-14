import { check, sleep } from 'k6';
import { apiRequest, assertSafeTarget } from './lib.js';

assertSafeTarget(12);
export const options = {
  vus: 1,
  iterations: 1,
  thresholds: { http_req_failed: ['rate<0.01'], invalid_response: ['rate==0'] },
};

export default function () {
  const repeatedPath = '/api/openf1?endpoint=position&session_key=9472&limit=1';
  const first = apiRequest(repeatedPath);
  const second = apiRequest(repeatedPath);
  const varied = apiRequest('/api/openf1?endpoint=position&session_key=9488&limit=1');
  check(first.response, { 'cold API response is JSON': () => first.valid });
  check(second.response, { 'repeated query is JSON': () => second.valid });
  check(varied.response, { 'varied query is JSON': () => varied.valid });
  // The OpenF1 function TTL is 12 seconds. This request captures its refresh
  // behavior; Vercel headers and function logs are the cache evidence of record.
  sleep(13);
  const expired = apiRequest(repeatedPath);
  check(expired.response, { 'post-TTL response is JSON': () => expired.valid });
}
