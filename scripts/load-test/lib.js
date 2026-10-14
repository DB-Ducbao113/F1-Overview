import http from 'k6/http';
import { Counter, Rate } from 'k6/metrics';

export const sentRequests = new Counter('load_test_requests');
export const invalidResponses = new Rate('invalid_response');

export const config = {
  baseUrl: (__ENV.BASE_URL || '').replace(/\/$/, ''),
  stagingHost: __ENV.ALLOWED_STAGING_HOST || '',
  productionHost: __ENV.PRODUCTION_HOST || 'podiumeds.vercel.app',
  dataMode: __ENV.DATA_MODE || 'live',
  token: __ENV.TEST_TOKEN || '',
  protectionBypass: __ENV.VERCEL_PROTECTION_BYPASS || '',
  maxRequests: Number(__ENV.MAX_REQUESTS || 20000),
  maxReceivedBytes: Number(__ENV.MAX_RECEIVED_BYTES || 268435456),
};

export function assertSafeTarget(expectedRequests = 0) {
  if (!config.baseUrl || !config.stagingHost)
    throw new Error('BASE_URL and ALLOWED_STAGING_HOST are required');
  // k6's JavaScript runtime does not provide the browser/Node URL global.
  const match = config.baseUrl.match(/^https:\/\/([^/:?#]+)(?::\d+)?(?:[/?#]|$)/i);
  const hostname = match ? match[1].toLowerCase() : '';
  if (!hostname || hostname !== config.stagingHost.toLowerCase()) {
    throw new Error('BASE_URL must be HTTPS and its hostname must equal ALLOWED_STAGING_HOST');
  }
  if (hostname === config.productionHost.toLowerCase())
    throw new Error('Refusing to run against the production hostname');
  if (!['live', 'simulated'].includes(config.dataMode))
    throw new Error('DATA_MODE must be live or simulated');
  if (config.dataMode === 'simulated' && !config.token)
    throw new Error('TEST_TOKEN is required for simulated tests');
  if (expectedRequests > config.maxRequests)
    throw new Error(
      `Planned ${expectedRequests} requests exceeds MAX_REQUESTS=${config.maxRequests}`,
    );
}

export function headers(fault = '') {
  const value = {};
  if (config.protectionBypass) value['x-vercel-protection-bypass'] = config.protectionBypass;
  if (config.dataMode === 'simulated') {
    value['X-Load-Test-Mode'] = 'simulated';
    value['X-Load-Test-Token'] = config.token;
    if (fault) value['X-Load-Test-Fault'] = fault;
  }
  return value;
}

export function apiRequest(path, fault = '') {
  const response = http.get(`${config.baseUrl}${path}`, {
    headers: headers(fault),
    tags: { endpoint: path.split('?')[0], data_mode: config.dataMode },
  });
  sentRequests.add(1);
  const json = response.headers['Content-Type'] || response.headers['content-type'] || '';
  const valid =
    response.status >= 200 &&
    response.status < 300 &&
    json.includes('application/json') &&
    !response.body.trimStart().startsWith('<');
  invalidResponses.add(!valid);
  return { response, valid };
}

export function representativePath(iteration) {
  // 40% home static, 35% season/results, 15% directory, 10% showroom.
  const bucket = iteration % 20;
  if (bucket < 8) return '/';
  if (bucket < 15) return '/season/2026';
  if (bucket < 18) return bucket % 2 ? '/teams' : '/drivers';
  return '/showroom';
}
