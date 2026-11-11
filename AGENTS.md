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
- **Student storage keys** (`studentPortalService`): students are read from and written to the
  SAME canonical keys (`fam_portal_students_permanent`, `fam_portal_students_v4`); every save also
  *removes* the older mirrors (`fam_portal_students_v1..v3`, `fam_portal_students`, `fam_students`,
  `*_backup`). Keep the read set and the write set in sync — an asymmetric set lets a stale copy
  resurrect students the teacher deleted. An existing saved list is authoritative **even when
  empty**: `INITIAL_STUDENTS` (the Lucas/Juliana/Camila demo data) is seeded only when no student
  key exists at all, so deleting every student must not bring the demos back.
- **PWA service worker**: registration lives in `src/main.tsx` via
  `src/services/pwaUpdate.ts` (it used to be an inline script in `index.html`). The strategy is
  **network-first for every same-origin GET**, with the versioned cache (`fam-cache-vN` in
  `public/sw.js`) used only as an offline fallback — so an online device always renders the newest
  code. `sw.js` calls `skipWaiting()` and the page reloads itself on `controllerchange`, which is what
  makes an already-installed phone app pick up a new version automatically; never remove `skipWaiting`
  or the `controllerchange` reload without providing another update path.
- **Teacher-created content** uses the same symmetric read/write pattern as students:
  `flashcardService` (`fam_teacher_flashcards_v1`) and `quizService` (`fam_teacher_quizzes_v1`)
  store teacher-authored items in localStorage and merge them with the fixed program data
  (`FLASHCARDS_DATA` / `QUIZ_DATA`) for the student views. CRUD UI lives in the
  `TeacherDashboard` (flashcards) and `TeacherQuizManager` (quizzes).
- **Gemini API key is optional**: `src/services/geminiService.ts` reads the key from `localStorage`
  first, then `VITE_GEMINI_API_KEY` (baked by Vite from the container env at dev-server start).
  Without a key, `WeekContentEditor` falls back to `lessonGeneratorService` (deterministic
  extraction from the teacher's notes), so the app is fully usable with no credentials.
- Routes are **hash/state based** (single `index.html`, `App.tsx` switches tabs); there is no router,
  so deep links beyond `#sync=...` / `#synced=1` don't exist.
