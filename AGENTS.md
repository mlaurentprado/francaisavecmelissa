# AGENTS.md

## What this app is
`francaisavecmelissa` — a **pure client-side** Vite + React 19 + TypeScript SPA (Tailwind v4 via
`@tailwindcss/vite`). There is **no backend, no API, and no database**: all state (students, weeks,
sessions, points, teacher settings) lives in `localStorage`, seeded from mocks in
`src/services/studentPortalService.ts`. Nothing needs to be migrated or seeded.

## Running it here
- Everything runs through `docker-compose.base44.yml` (single `web` service, `oven/bun:1`,
  repo bind-mounted at `/app`, Vite dev server on host port 3000). The container installs deps from
  the committed `bun.lock` at startup (`bun install --frozen-lockfile`), then `bun run dev`.
- Package manager is **bun** (there is a `bun.lock` text lockfile + `bunfig.toml`); do not switch to
  npm/yarn. `@esbuild/win32-x64` in devDependencies is a harmless platform-specific entry.
- `vite.config.ts` sets `server.host: true` / `allowedHosts: true` because the preview is served
  through an external proxy host. `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is also passed through.

## Verifying it works
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → `200`, and
  `curl -s http://localhost:3000/src/main.tsx` should return Vite-transformed source (unhashed
  `/src/...` + `/@react-refresh` imports). If you get a hashed bundle instead, the compose is
  running a production build and edits won't show.
- Compose healthcheck: `docker compose -f docker-compose.base44.yml ps` should report `healthy`.
- After backend-free frontend edits, Vite HMR picks them up; use `reload_preview` only if a full
  refresh is needed.

## Quirks worth knowing
- **PWA service worker**: `public/sw.js` registers on load. Navigation is network-first (so dev edits
  show) but assets are stale-while-revalidate, so a cached JS module can briefly lag behind an edit —
  a hard reload / `reload_preview` clears it.
- **Gemini API key is optional**: `src/services/geminiService.ts` reads the key from `localStorage`
  first, then `VITE_GEMINI_API_KEY` (baked by Vite from the container env at dev-server start).
  Without a key, `WeekContentEditor` falls back to `lessonGeneratorService` (deterministic
  extraction from the teacher's notes), so the app is fully usable with no credentials.
- Routes are **hash/state based** (single `index.html`, `App.tsx` switches tabs); there is no router,
  so deep links beyond `#sync=...` / `#synced=1` don't exist.
