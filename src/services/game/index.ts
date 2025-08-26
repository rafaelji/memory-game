import type { BestScore, GameSnapshot, LeaderboardRow } from "./types";
import type { GridSize } from "@/pages/game/types";
import { BEST_KEY, BEST_KEY_PREFIX, SNAP_KEY } from "@/constants/game";
import logger from "@/services/logger";

function sizeCells(size: GridSize) {
  return size.rows * size.cols;
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

function readSnapshot(gridSize: GridSize): GameSnapshot | null {
  try {
    const raw = localStorage.getItem(SNAP_KEY);
    if (!raw) return null;
    const snap = JSON.parse(raw) as GameSnapshot;
    if (snap.v !== 1 || snap.size !== sizeCells(gridSize)) return null;

    // se estava rodando, ajusta o tempo "offline"
    if (snap.running && typeof snap.savedAt === "number") {
      const delta = Math.max(0, nowSec() - Math.floor(snap.savedAt / 1000));
      return { ...snap, seconds: snap.seconds + delta, savedAt: Date.now() };
    }
    return snap;
  } catch (err) {
    logger.error("[game/readSnapshot]", err);
    return null;
  }
}

function writeSnapshot(
  grid: GridSize,
  partial: Omit<GameSnapshot, "v" | "size" | "savedAt">,
): void {
  const full: GameSnapshot = {
    ...partial,
    v: 1,
    size: sizeCells(grid),
    savedAt: Date.now(),
  };
  try {
    localStorage.setItem(SNAP_KEY, JSON.stringify(full));
  } catch (err) {
    logger.error("[game/writeSnapshot]", err);
  }
}

function clearSnapshot(): void {
  try {
    localStorage.removeItem(SNAP_KEY);
  } catch {
    return;
  }
}

/** Safely read a best score */
function readBest(user: string, grid: GridSize): BestScore | null {
  try {
    const raw = localStorage.getItem(BEST_KEY(user, grid));
    if (!raw) return null;
    const best = JSON.parse(raw) as BestScore;
    if (typeof best?.moves !== "number" || typeof best?.seconds !== "number") {
      return null;
    }
    return best;
  } catch {
    return null;
  }
}

/** Safely write a best score */
function maybeWriteBest(
  user: string,
  grid: GridSize,
  moves: number,
  seconds: number,
): void {
  const best = readBest(user, grid);
  const shouldSave =
    !best ||
    moves < best.moves ||
    (moves === best.moves && seconds < best.seconds);
  if (!shouldSave) return;
  try {
    localStorage.setItem(
      BEST_KEY(user, grid),
      JSON.stringify({ moves, seconds }),
    );
  } catch {
    return;
  }
}

export function readLeaderboardFromBests(
  grid: GridSize,
  limit = 100,
): LeaderboardRow[] {
  const prefix = BEST_KEY_PREFIX;
  const cells = grid.rows * grid.cols;
  const suffix = `:${cells}`;

  const rows: LeaderboardRow[] = [];

  for (let index = 0; index < localStorage.length; index++) {
    const localStorageKey = localStorage.key(index);
    if (
      !localStorageKey ||
      !localStorageKey.startsWith(prefix) ||
      !localStorageKey.endsWith(suffix)
    )
      continue;

    // Expected key structure: BEST_KEY_PREFIX<user>:<cells>
    // As username does not accept ":", it is safe to extract via slice:
    const user = localStorageKey.slice(
      prefix.length,
      localStorageKey.length - suffix.length,
    );
    if (!user) continue;

    try {
      const raw = localStorage.getItem(localStorageKey);
      if (!raw) continue;
      const val = JSON.parse(raw) as BestScore;
      if (typeof val?.moves !== "number" || typeof val?.seconds !== "number") {
        continue;
      }
      rows.push({ user, moves: val.moves, seconds: val.seconds });
    } catch {
      logger.error("[game/readLeaderboardFromBests]", "failed to parse best");
    }
  }

  // Ordering: fewer movements, then less time.
  rows.sort((a, b) => a.moves - b.moves || a.seconds - b.seconds);

  return rows.slice(0, limit);
}

export function clearLeaderboardFromBests(grid: GridSize) {
  const prefix = BEST_KEY_PREFIX;
  const cells = grid.rows * grid.cols;
  const suffix = `:${cells}`;
  const keys: string[] = [];
  for (let index = 0; index < localStorage.length; index++) {
    const localStorageKey = localStorage.key(index);
    if (
      localStorageKey &&
      localStorageKey.startsWith(prefix) &&
      localStorageKey.endsWith(suffix)
    ) {
      keys.push(localStorageKey);
    }
  }
  for (const k of keys) localStorage.removeItem(k);
}

export { maybeWriteBest, readSnapshot, writeSnapshot, clearSnapshot, readBest };
