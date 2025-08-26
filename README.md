# Snyk Memory Game — Take-home Assignment

A secure-by-default memory game built with **React + TypeScript (Vite)**.
Focus: clean architecture, route protection, state persistence, and accessible UI.

> Grid: **4×3** (12 cards). With `VITE_PEXELS_KEY`, images come from **Pexels**; otherwise the game falls back to **emojis**.

## Quickstart

### Requirements

- Node **18.18+** (tested on **Node 23.6.1**)
- **npm** (project uses `package-lock.json`).

### Install & Run

```bash
# npm (default)
npm install
npm run dev
# open http://localhost:5173
```

### Build & Preview

```bash
# npm
npm run build
npm run preview
```

### Tests (Vitest + Testing Library)

```bash
# npm
npm test
npm run test:ui    # optional Vitest UI
npm run test:cov   # coverage
```

---

## Environment

Create `.env.local` (or `.env`) if you want real photos:

```
VITE_PEXELS_KEY=<your-pexels-api-key>
```

Behavior:

- **With key**: Pexels Search API is used; results cached in `sessionStorage`.
- **Without key**: emoji fallback (fully functional).

---

## Routes & Guards

- `/` – **Login** (username input + Enter).
- `/game` – **Board** (HUD shows username, time, moves, best; logout).
- `/game/score` – **Scores modal** on top of `/game` (opens/pushes URL).

**Auth rules**

- Not authenticated → redirect to `/` if accessing `/game` or `/game/score`.
- Authenticated hitting `/` → redirect to `/game`.

**Errors**

- Router `errorElement` shows a friendly panel and “Reload” action.

---

## Game Mechanics

- **Grid**: 4×3, all cards start face down.
- **Flip & match**: two flips per move; matches stay revealed; non-match flips back after a short delay.
- **Timer & Moves**: timer starts on first interaction; moves increment on each pair attempt.
- **Best score**: **fewer moves** wins; tie-breaker is **lower time**.
- **Win overlay**: frosted overlay with 🏆, “Play again”, and “View scores”.
- **Scores modal**: shows current run, your best, and a **leaderboard** (built from each user’s best; sorted by fewer moves then time). Opening the modal **pauses** the game; closing **resumes** (if not finished).
- **Images**: `object-fit: cover` ensures photos never overflow cards.
- **Loading**: skeleton grid + centered spinner while images are loading.
- **A11y**: semantic roles/labels (`role="grid"`, `aria-live`, `role="status"`), ESC to close modal, focus management.

---

## Persistence

- **Snapshot**: the in-progress game (deck, moves, seconds, running, foundPairs) is saved to `localStorage`. On reload, the snapshot is restored (unless the game already finished).
- **Best**: per **user × grid** (e.g. `snyk-mem:best:v1:<user>:12`).
- **Storage keys**: namespaced + versioned (`snyk-mem:*:v1:*`) for safety/migration.

---

## Security posture

- **Auth**: simple browser session via `AuthService` + `AuthProvider` (safe API surface; easy to swap for a real backend later).
- **Input validation**: username `^[A-Za-z0-9 _-]{1,20}$`.
- **Logger**: verbose in dev; **noop in prod**; listener errors wrapped in `try/catch`.

---

## Project structure

```
src/
  components/
    button/             # Reusable <Button>
    confetti/           # CSS-only confetti overlay
    game/
      card/             # Card component + styles
      hud/              # HUD (time, moves, user, logout)
      skeleton/         # Grid skeleton for being shown when loading cards
      victory-overlay   # The victory overlay that appears when the user wins the game
    top-bar/            # The top bar
  constants/
    env/                # IS_DEV/PROD/TEST, MODE
    game/               # DEFAULT_SIZE (4x3), emoji pool
    images/             # PEXELS_API_URL, cache key helper
    routes/             # ROUTES
    session/            # Session keys for local storage
  hooks/
    useAuth/            # Hook for auth state
  lib/
    session/            # Session handlers
  pages/
    landing/            # Login page
    game/               # Game.tsx + styles
    score/              # ScoreModal.tsx + styles (modal route)
  providers/
    auth/               # AuthProvider (React Context)
  router/
    index.tsx           # Router v7 + errorElement + modal nesting
    RequireAuth.tsx
    AppRouteError.tsx
  services/
    auth/               # login/logout/getSession + events
    game/               # snapshot/best/leaderboard helpers
    images/             # fetchGameImages (Pexels or null)
    logger/             # defaultLogger (noop in prod)
  shared/
    helpers/time.ts     # time formatting handlers
    types/session.ts    # Session type
  tests/                # Tests setup
  index.css             # tokens, reset, utilities
```

**Design choices**

- Router v7 nested routes → URL reflects UI state (`/game/score`).
- Services with stable contracts → swap storage/backend without touching UI.
- Versioned storage keys → migration-friendly.
- CSS tokens + small utilities; per-component CSS for locality.

---

## Testing

**Why these tests?** They cover business rules and integration contracts.

- `services/game/leaderboard-from-bests.test.ts`
  Sorts leaderboard by **moves**, then **seconds**.
- `services/game/maybeWriteBest.test.ts`
  Overwrites best only when strictly better (tie → faster time).
- `services/images/images.test.ts`
  Conditional:
  - _without key_: returns `null`, does **not** call `fetch`.
  - _with key_: normalizes response and reuses **session cache**.

- `shared/utils/time.test.ts`
  `formatTime`: **MM\:SS** (<1h) and **HH\:MM\:SS** (≥1h).
- `router/RequireAuth.test.tsx`
  Guard contracts: unauth → redirect, auth → render.

---

## How this maps to the brief

- 3 routes + auth guard ✅
- Username on board ✅
- Public API images (Pexels) + emoji fallback ✅
- Initial backflipped cards ✅
- Timer + flip/match logic ✅
- Scores modal (pauses/resumes) ✅
- Win overlay + persist best + ability to play again ✅
- State survives full reload ✅
- Clean structure, safe defaults ✅

---

## Scripts

```jsonc
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "stylelint": "stylelint \"src/**/*.css\"",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:cov": "vitest run --coverage",
}
```

---

_MIT – for the take-home Assignment review_
