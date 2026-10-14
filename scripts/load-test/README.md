# Staging load tests

These k6 scripts only target an explicitly named Vercel Preview hostname. They reject the known production hostname and never create traffic unless `BASE_URL` and `ALLOWED_STAGING_HOST` match exactly.

## Before a run

1. Record the preview URL, commit SHA, Vercel plan, deployment protection state, region and remaining quota in `runs/<timestamp>/run.md`.
2. Set `LOAD_TEST_TOKEN` as an encrypted Preview environment variable in Vercel. It is never a `VITE_` variable. The same value is supplied to k6 as `TEST_TOKEN` only for simulated tests.
3. If Preview has Deployment Protection, create a **Protection Bypass for Automation** secret in Vercel and supply it to k6 as `VERCEL_PROTECTION_BYPASS`. This is a separate secret and is sent only as the `x-vercel-protection-bypass` request header.
4. Run live smoke first. Load, spike, soak and dependency-fault scripts require `DATA_MODE=simulated` and stop before making a request if live mode is selected. This prevents load from reaching OpenF1 or Jolpica.

```powershell
$env:BASE_URL = 'https://your-preview.vercel.app'
$env:ALLOWED_STAGING_HOST = 'your-preview.vercel.app'
k6 run scripts/load-test/smoke.js
```

For simulated data, set `DATA_MODE=simulated` and `TEST_TOKEN`. Fault values are `slow`, `timeout`, `429`, and `503`.

```powershell
$env:DATA_MODE = 'simulated'
$env:TEST_TOKEN = '<preview-only secret>'
$env:FAULT = '503'
k6 run scripts/load-test/fault.js
```

Run one load level at a time and enter its expected request count in the run ledger before starting. The script rejects a level that would exceed `MAX_REQUESTS` (20,000 by default); `data_received` has an aborting threshold at 256 MiB. k6 counters are sampled asynchronously, so the final request can exceed the request ceiling by a small number of in-flight requests.

```powershell
$env:RATE = '20'; $env:DURATION = '2m'
k6 run --summary-export runs/<timestamp>/load.json scripts/load-test/load.js
```

Suggested levels are 1, 5, 10, 20, 50, and 100 iterations per second. `static.js` measures CDN/static assets, `cache.js` records repeated, varied and post-TTL API queries, `spike.js` runs the 50% → 150% spike/recovery schedule, and `soak.js` runs 70% of `STABLE_RATE` for 30 minutes. Stop manually if the 30-second view shows unexpected errors above 5% or p95 above five seconds; then run `recovery.js`.

`browser-checklist.md` defines the manual desktop and phone 3D verification. Store k6 summaries, Vercel request/function logs, `x-vercel-cache`, `x-vercel-id`, browser trace, and the completed `report-template.md` outside source control under `runs/`.
