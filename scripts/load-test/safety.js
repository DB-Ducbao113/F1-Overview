export function validateLoadTestTarget({
  baseUrl,
  allowedHost,
  productionHost = 'podiumeds.vercel.app',
}) {
  if (!baseUrl || !allowedHost) {
    throw new Error('BASE_URL and ALLOWED_STAGING_HOST are required');
  }

  const match = baseUrl.match(/^https:\/\/([^/:?#]+)(?::\d+)?(?:[/?#]|$)/i);
  const hostname = match ? match[1].toLowerCase() : '';
  if (!hostname || hostname !== allowedHost.toLowerCase()) {
    throw new Error('BASE_URL must be HTTPS and its hostname must equal ALLOWED_STAGING_HOST');
  }
  if (hostname === productionHost.toLowerCase()) {
    throw new Error('Refusing to run against the production hostname');
  }

  return hostname;
}

export function requireSimulatedDataMode(dataMode) {
  if (dataMode !== 'simulated') {
    throw new Error('High-load scripts require DATA_MODE=simulated to protect upstream APIs');
  }
}

export function assertRequestCeiling(expectedRequests, maxRequests) {
  if (!Number.isFinite(expectedRequests) || expectedRequests < 0) {
    throw new Error('Planned request count must be a non-negative number');
  }
  if (expectedRequests > maxRequests) {
    throw new Error(`Planned ${expectedRequests} requests exceeds MAX_REQUESTS=${maxRequests}`);
  }
}
