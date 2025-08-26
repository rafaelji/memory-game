import type { GameSnapshot } from "./types";
import type { GridSize } from "@/pages/game/types";
import { BEST_KEY, SNAP_KEY } from "@/constants/game";
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
function readBest(
  user: string,
  grid: GridSize,
): { moves: number; seconds: number } | null {
  try {
    const raw = localStorage.getItem(BEST_KEY(user, grid));
    if (!raw) return null;
    const best = JSON.parse(raw) as { moves: number; seconds: number };
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

export { maybeWriteBest, readSnapshot, writeSnapshot, clearSnapshot, readBest };
