# EDS-M1.8 — Commercial Infrastructure, Hosting & Operating Economics

**Project:** Podium Effet De Sol (EDS)  
**Branch Audited:** `Per-PEDS`  
**Audit Date:** 2026-10-17  
**Auditor:** DevOps Release Engineer & Principal Software Architect  

---

## 1. Executive Summary

This report evaluates the infrastructure architecture, hosting plans, privacy/consent compliance, CI/CD pipeline reliability, and operating costs (TCO) required to sustain Podium Effet De Sol as a commercial digital enterprise.

---

## 2. Hosting Platform & Commercial Restrictions

### 2.1 Current Hosting: Vercel Hobby Tier
- **Deployment Endpoint:** `https://podiumeds.vercel.app/`
- **Vercel Terms of Service (Hobby Plan):**
  - Section 4.1 explicitly states: *“The Hobby tier is strictly for personal, non-commercial use.”*
  - Any commercial activity—including programmatic display advertising (Google AdSense/AdThrive), affiliate marketing links, commercial sponsorships, or paid subscriber accounts—**violates the Hobby terms and subjects the project to immediate suspension without notice.**
- **Mandatory Action:**
  - Option A: Upgrade to **Vercel Pro** ($20/team member/month + usage bandwidth over 1TB).
  - Option B: Self-host using the existing hardened `Dockerfile` on cloud infrastructure (e.g. AWS ECS / Fargate behind CloudFront, or a dedicated Hetzner/DigitalOcean instance managed by Coolify/Dokku).
  - Option C: Deploy static assets to **Cloudflare Pages** (unlimited bandwidth on free tier, allows commercial traffic) and proxy serverless routes via Cloudflare Workers.

---

## 3. Privacy, Analytics, Consent & Advertising Infrastructure

### 3.1 Analytics & Telemetry
- Current libraries: `@vercel/analytics` (`^2.0.1`) and `@vercel/speed-insights` (`^2.0.0`).
- Both collect real-user performance data (LCP, CLS, FID/INP) and route views.
- Under EU GDPR, ePrivacy Directive, and California CCPA:
  - If analytics use cookies or collect pseudo-anonymized IP addresses for commercial analytics, **an explicit Cookie Consent Management Platform (CMP)** must be displayed to EU/UK visitors prior to script execution.
  - Vercel Web Analytics is cookieless and privacy-friendly, but advertising tags (AdSense, Google Analytics 4, Meta Pixel) **require explicit opt-in consent**.

### 3.2 Required Legal Documents
Prior to commercial traffic monetization, the following legal pages must be implemented:
1. `/privacy`: Comprehensive Privacy Policy detailing data controller identity, telemetry collection, server logs, cookie definitions, and user data rights (GDPR Articles 13 & 14).
2. `/terms`: Terms of Service outlining acceptable use, intellectual property disclaimers, no-gambling warranties, and limitation of liability.
3. `/cookies`: Dedicated Cookie Policy detailing first-party and third-party storage mechanisms.
4. **CMP Banner Integration**: Integration of a compliant open-source or commercial CMP (e.g., Klaro!, CookieFirst, or Cookiebot).

### 3.3 Advertising & Monetization Architecture
- **Recommended Monetization Models:**
  1. *Curated Motorsport Engineering Affiliates*: Non-intrusive affiliate partnerships for sim-racing hardware (Fanatec, Moza), engineering books, and racing telemetry software.
  2. *Ethical Tech Advertising*: High-CPM privacy-friendly developer advertising networks (EthicalAds, Carbon Ads) targeting motorsport engineers and simulation enthusiasts.
  3. *Zero Pop-ups / Interstitials*: Preserves Core Web Vitals (CLS ≤ 0.1, INP ≤ 200ms) and user trust.

---

## 4. Operating Cost Estimation (TCO Analysis)

| Cost Component | Architecture 1: Vercel Pro | Architecture 2: Cloudflare Pages + Workers | Architecture 3: Self-Hosted Docker (AWS / Hetzner) |
|---|---|---|---|
| **Base Platform Hosting** | $20.00 / month (1 seat) | $0.00 / month (Free tier) | $5.00 – $15.00 / month |
| **Bandwidth (Est. 500 GB/mo)** | Included (1 TB quota) | Unlimited Free | Included (20 TB on Hetzner) |
| **Serverless API Execution** | Included (1M invocations) | Free up to 100K/day ($5 for paid) | Included in CPU |
| **Domain & DNS (`.com` / `.org`)** | $12.00 / year | $10.00 / year (Cloudflare Registrar) | $12.00 / year |
| **GitHub Actions CI/CD** | Included Free (2,000 min) | Included Free | Included Free |
| **Total Estimated Monthly Cost** | **~$21.00 / month** | **~$0.00 – $5.00 / month** | **~$6.00 – $16.00 / month** |

*Recommendation:* Migrate production hosting to **Cloudflare Pages + Cloudflare Workers**. Provides zero-cost high-bandwidth global edge distribution for heavy 3D assets (`c42.v2.glb` / `eds-g01.glb` and 2K textures), completely eliminates Vercel Hobby commercial violation, and provides enterprise-grade DDoS defense.

---

## 5. Automated Update Pipeline Post-Deployment Verification Protocol

Under EDS Release Governance (`AGENTS.md` Stage 9 & 10), deployment cannot be marked complete without explicit evidence verifying both automated update sources:

```
┌────────────────────────────────────────────────────────────────────────┐
│             POST-DEPLOYMENT DATA PIPELINE VERIFICATION FLOW            │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Trigger Synthetic Workflow Run:                                     │
│    gh workflow run auto-update-f1.yml -f force=true                    │
│                                                                        │
│ 2. Verify Pipeline 1 (Session Classifications):                        │
│    • Status: Completed with exit code 0                                │
│    • Freshness: src/data/championship/openF1SessionResults2026.json    │
│    • Non-empty: Validates 22-driver grid size                          │
│                                                                        │
│ 3. Verify Pipeline 2 (Season Standings & Results):                     │
│    • Status: Completed with exit code 0                                │
│    • Freshness: src/data/championship/standings.ts timestamp           │
│    • Consistency: Standings points align with completed rounds         │
│                                                                        │
│ 4. Verify Frontend Consumption:                                        │
│    • Query production endpoint: /season/2026                           │
│    • Verify 200 HTTP response and live data rendering                  │
└────────────────────────────────────────────────────────────────────────┘
```

### Verification Criteria Checklist:
- [ ] Workflow execution logs examined via GitHub CLI or web UI.
- [ ] Data freshness verified: Data updated within last scheduled window.
- [ ] Classification integrity check: No NaN points, no undefined driver strings, no empty arrays.
- [ ] Neither pipeline silently swallowed errors via uncaught promises.
