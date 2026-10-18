# M4 Phase 2 Source Eligibility Matrix

**Reviewed:** 2026-10-18

**Decision scope:** Podium EDS is an intended commercial service. Access being
technically public does not establish storage, redistribution, or commercial
rights. This record is an engineering readiness assessment, not legal advice.

| Source                  | Permitted access method evidenced                                                                                                                                                                           | Observation                                                       | Internal storage                              | Public redistribution                   | Commercial use                          | Phase 2 decision                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------- | --------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| OpenF1                  | Historical REST is documented as free without authentication; real-time access requires authenticated paid access. Published account guidance gives rate limits and asks clients to back off on throttling. | **REVIEW_REQUIRED** for the intended commercial-track observation | **REVIEW_REQUIRED**                           | **NOT ESTABLISHED**                     | **NOT ESTABLISHED / HOLD**              | No network request. Repository license is CC BY-NC-SA 4.0, but the exact scope over API output and commercial licensing path requires written clarification. |
| Jolpica                 | Public REST with a required identifying User-Agent; current unauthenticated limits are 4 requests/second and 500/hour.                                                                                      | **NON-COMMERCIAL ONLY** under published terms                     | **NON-COMMERCIAL ONLY** under published terms | **CC BY-NC-SA CONDITIONS APPLY**        | **CONTACT REQUIRED**                    | No network request for this commercial-track project. Obtain written commercial permission before observation/storage.                                       |
| FIA document metadata   | Public website document pages and files; no approved API or metadata feed was identified.                                                                                                                   | **MANUAL REVIEW ONLY / HOLD**                                     | **METADATA-ONLY REVIEW REQUIRED**             | **NOT PERMITTED BY AVAILABLE EVIDENCE** | **NOT PERMITTED BY AVAILABLE EVIDENCE** | Do not scrape, mirror, or republish FIA documents. Synthetic metadata remains the default.                                                                   |
| Podium synthetic replay | Repository-authored fixtures with invented participants, identifiers and documents                                                                                                                          | **PERMITTED OFFLINE**                                             | **PERMITTED OFFLINE**                         | **NOT APPLICABLE**                      | **NOT APPLICABLE**                      | Enabled for deterministic QA only; never factual race evidence.                                                                                              |

## Supporting evidence

### OpenF1

- [OpenF1 API documentation](https://openf1.org/docs/) documents direct REST
  access, free historical data and paid real-time access.
- [OpenF1 account guidance](https://openf1.org/account) documents authenticated
  limits and backoff expectations.
- [OpenF1 repository license](https://github.com/br-g/openf1/blob/main/LICENSE)
  is CC BY-NC-SA 4.0 and limits licensed-material reuse to non-commercial use.

Unresolved: whether the repository license is expressly intended to govern every
API response, whether internal commercial observation/storage is available under
separate terms, and what written permission would cover derived classifications.

### Jolpica

- [Jolpica terms](https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md)
  state that use is non-commercial under CC BY-NC-SA 4.0 and direct commercial
  users to contact the operator.
- [Jolpica rate limits](https://github.com/jolpica/jolpica-f1/blob/main/docs/rate_limits.md)
  document 4 requests/second, 500 requests/hour for unauthenticated access,
  HTTP 429 behavior, and caching guidance.
- [Jolpica API documentation](https://github.com/jolpica/jolpica-f1/blob/main/docs/README.md)
  requires an identifying custom User-Agent.

Unresolved: commercial permission, attribution/share-alike implementation, data
retention scope, and whether a future token program changes relevant terms.

### FIA

- [FIA website terms](https://api.fia.com/file/25107/download) reserve copyright
  in publications and prohibit copying, distribution or use outside stated terms
  without prior written consent; private non-commercial viewing and limited
  quotation are the stated exceptions.

Unresolved: a permitted metadata-only feed, commercial use of publication timing
and document identifiers, retention limits, and permission for derived status
signals. Factual metadata may raise different legal questions from document
content, but Phase 2 does not assume that distinction grants permission.

## Gate interpretation

A locally authored permission JSON is only a fail-closed operator control. It is
not provider authorization. Live mode now requires a reviewed calendar mapping,
an explicit command-line authorization, and a schema-v2 record that references
external provider authorization; owner and independent rights review are still
required before use.
