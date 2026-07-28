# AGENTS.md - SafeHaven Project Conventions & Instructions

## Project Overview
**SafeHaven** is a full-stack Indonesian Stock Market (IDX / IHSG) analytics platform built with React, Vite, Express, and Yahoo Finance APIs. It provides real-time market insights, fundamental & technical scoring, portfolio management, watchlist tracking, seasonal performance analysis, and AI-driven stock advisory.

---

## Technical Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Lightweight Charts (TradingView).
- **Backend**: Node.js, Express (`server.ts`), SQLite (`safehaven.db`), Yahoo Finance (`yahoo-finance2`), `@google/genai` (Gemini API).
- **Deployment Port**: `3000` (Bound strictly to `0.0.0.0:3000`).
- **Dev Command**: `npm run dev` (uses `tsx server.ts`).

---

## Coding Guidelines & Conventions

### 1. UI & Design System
- Maintain the **Dark Luxury / Neon Accent** aesthetic (`#0b0a10` background, `#111018` card containers, `#ccff00` lime accent, `#00f0ff` cyan, `#00f5a0` green).
- Clean mathematical contrast and no unnecessary clutter.
- Always organize complex pages using modular tabs rather than long stacked card lists.

### 2. Backend API & Resilience
- All Gemini API calls **MUST** reside server-side in `/api/*` routes.
- Always include robust fallback mechanisms and error handling (such as quota/rate limits 429) for Gemini or external financial API endpoints.
- Keep `process.env.GEMINI_API_KEY` hidden from the client.

### 3. Database & Migrations
- Local persistence uses SQLite (`safehaven.db`).
- For scaling or migrating to Firebase (Firestore + Auth), follow structured migration routines (export JSON schema -> Firestore setup).

---

## Key Files & Structure

- `/server.ts` - Express API backend, data proxies, and AI services.
- `/src/pages/TickerDetail.tsx` - Stock detail, interactive technical charts, scoring breakdown, and AI analysis tabs.
- `/src/components/TickerAnalysisWidgets.tsx` - Yahoo Finance integrated widgets (Gauges, Financials, Dividends, Performance, Seasonality).
- `/src/pages/Portfolio.tsx` - User portfolio tracking & AI portfolio insights.
- `/src/pages/Watchlist.tsx` - Custom watchlists and stock screener.
- `/scripts/` - Organized automation & patch scripts (`/checks`, `/fixes`, `/patches`, `/maintenance`, `/debug`, `/_archive`).
- `/tests/` - End-to-end and API integration tests.
