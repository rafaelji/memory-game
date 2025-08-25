import { BEST_KEY } from "@/constants/game";
import logger from "@/services/logger";

/** Fisher–Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const shallowCopy = arr.slice();
  for (let indexA = shallowCopy.length - 1; indexA > 0; indexA--) {
    const indexB = Math.floor(Math.random() * (indexA + 1));
    [shallowCopy[indexA], shallowCopy[indexB]] = [
      shallowCopy[indexB],
      shallowCopy[indexA],
    ];
  }
  return shallowCopy;
}

/** Safely read a best score */
function readBest(
  username: string,
  size: number,
): { moves: number; seconds: number } | null {
  try {
    const raw = localStorage.getItem(BEST_KEY(username, size));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { moves: number; seconds: number };
    if (
      typeof parsed?.moves !== "number" ||
      typeof parsed?.seconds !== "number"
    )
      return null;
    return parsed;
  } catch (err) {
    logger.error(err, "Failed to read best score");
    return null;
  }
}

/** Safely write a best score */
function writeBest(
  username: string,
  size: number,
  moves: number,
  seconds: number,
): void {
  try {
    localStorage.setItem(
      BEST_KEY(username, size),
      JSON.stringify({ moves, seconds }),
    );
  } catch (err) {
    logger.error(err, "Failed to write best score");
  }
}

export { shuffle, readBest, writeBest };
