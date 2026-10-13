const baseUrl = (process.env.BASE_URL || '').replace(/\/$/, '');
const allowed = process.env.ALLOWED_STAGING_HOST || '';
const production = process.env.PRODUCTION_HOST || 'podiumeds.vercel.app';
if (!baseUrl || !allowed) throw new Error('BASE_URL and ALLOWED_STAGING_HOST are required');
const url = new URL(baseUrl);
if (url.protocol !== 'https:' || url.hostname !== allowed || url.hostname === production) {
  throw new Error(
    'Refusing an unsafe target: use the exact HTTPS staging hostname, never production',
  );
}
console.log(`Validated staging target: ${url.hostname}`);
