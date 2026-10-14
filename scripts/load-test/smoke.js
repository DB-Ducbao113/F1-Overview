import { check, sleep } from 'k6';
import http from 'k6/http';
import { apiRequest, assertSafeTarget, config, headers, representativePath } from './lib.js';

assertSafeTarget(30);
export const options = {
  vus: 1,
  duration: '2m',
  thresholds: { http_req_failed: ['rate<0.01'], invalid_response: ['rate==0'] },
};

export default function () {
  const page = http.get(`${config.baseUrl}${representativePath(__ITER)}`, {
    headers: headers(),
    tags: { kind: 'page' },
  });
  check(page, {
    'page is HTML': (r) =>
      r.status === 200 && (r.headers['Content-Type'] || '').includes('text/html'),
  });
  const openf1 = apiRequest('/api/openf1?endpoint=sessions&session_key=latest');
  const jolpica = apiRequest('/api/jolpica?path=ergast/f1/2026/results.json&limit=1&offset=0');
  check(openf1.response, { 'OpenF1 is JSON, not HTML': () => openf1.valid });
  check(jolpica.response, { 'Jolpica is JSON, not HTML': () => jolpica.valid });
  sleep(5 + (__ITER % 11));
}
