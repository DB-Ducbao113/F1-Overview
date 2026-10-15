import { validateLoadTestTarget } from './safety.js';

const baseUrl = (process.env.BASE_URL || '').replace(/\/$/, '');
const allowed = process.env.ALLOWED_STAGING_HOST || '';
const production = process.env.PRODUCTION_HOST || 'podiumeds.vercel.app';
const hostname = validateLoadTestTarget({
  baseUrl,
  allowedHost: allowed,
  productionHost: production,
});
console.log(`Validated staging target: ${hostname}`);
