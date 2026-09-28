# F1-Overview: Evolution of Speed & Anatomy 🏎️💨

> Interactive 3D Scrollytelling and Exploded View Showroom for modern Formula 1 Ground Effect era cars (2022 - present).

## 🚀 Overview
- **Concept:** Scrollytelling + Interactive 3D Anatomy.
- **Focus:** Modern Ground Effect Aerodynamics (Venturi Tunnels, DRS, Halo, 1.6L V6 Turbo Hybrid Power Unit, 18-inch Pirelli Tires).
- **Architecture:** Zero-Cost, High-Performance 3D Web Application.
  - **3D Engine:** Three.js + React Three Fiber + Drei
  - **Framework:** Vite + React + TypeScript
  - **Styling:** Tailwind CSS (Modern Glassmorphic Dark UI / F1 Telemetry HUD)
  - **Animation:** GSAP / Lenis Smooth Scroll

## Local setup

```bash
npm ci
npm run dev
```

The community upload and admin moderation flows are disabled while they only use browser storage. Do not enable `VITE_ENABLE_COMMUNITY` until uploads and moderation are backed by server-side authentication and authorization. The current UI has no admin login.

## 🛡️ Git Workflow & Branching Strategy

- **`main`**: Protected branch. Direct pushes are disabled. All code merges must pass through Pull Requests reviewed and approved by the repository owner.
- **`develop`**: Main integration branch for active development.
- **`feature/*`**: Feature branches for individual milestones (e.g. `feature/3d-scene-setup`, `feature/exploded-view`, `feature/telemetry-hud`).
