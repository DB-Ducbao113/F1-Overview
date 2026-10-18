# Cloudflare migration readiness (design only)

This is a compatibility assessment, not a migration plan or deployment authorization. Vercel Production, its domains, and the current preview configuration remain unchanged.

## Application shape

The Vite client can be deployed as static assets to Cloudflare Pages, or served as static assets by a Worker. Vercel API handlers must be deliberately ported: Pages Functions use file-based routes under `functions/`, and Workers use the Workers runtime rather than a Node serverless runtime. Any port must replace Node filesystem/process assumptions and test bindings, request semantics, and environment configuration in the target runtime. Static asset forwarding from an advanced Pages Worker must use the documented `env.ASSETS.fetch` path.

## Results Engine

Keep the engine off the browser and out of public data paths. A future approved worker would perform read-only collection and enqueue a validation job; a separate authenticated publisher would require a recorded source-rights approval. Do not use KV as the revision ledger: KV is suitable for a cache or lock hint but has eventual-consistency and same-key write-rate constraints. A durable design is a D1 table for append-only session/revision/evidence records, with immutable raw evidence in R2 and an optional KV freshness cache. The writer needs idempotency keys, optimistic revision sequencing, retry-safe transactions, and an auditable backup/export process.

## Scheduling and cost guardrails

GitHub Actions remains the appropriate prototype runner because it is already reviewable in this repository. Cloudflare Cron Triggers should be considered only after an explicit operational approval; they are not a drop-in replacement for the manual-only workflow. Before enabling either system, define polling limits, provider permissions, alerting, recovery, and a missed-run policy.

Current official free-tier documentation describes a 500-deployments-per-month Pages allowance, Workers KV with 100,000 reads/day and 1,000 writes/day, D1 with 10 databases and 500 MB per database, and R2 with 10 GB-month storage, 1 million Class A operations, and 10 million Class B operations. Limits, billing requirements, and availability can change, so verify the account dashboard and current product terms before activation. A $0 budget needs hard request caps and usage alerts; R2 billing setup must not be assumed to be cost-free.

## Migration gate

Before a migration: inventory Vercel-only routes and environment bindings; port one non-production endpoint; test it in the Workers runtime; validate D1/R2 recovery and an export; and obtain approval for Cron, credentials, source rights, and data retention. No Cloudflare configuration is included in this change.
