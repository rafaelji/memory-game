import type { GridSize } from "@/pages/game/types";

/** LocalStorage key for best scores per user + size */
const BEST_KEY = (user: string, gridSize: GridSize) =>
  `${BEST_KEY_PREFIX}${user}:${gridSize.rows * gridSize.cols}`;

const BEST_KEY_PREFIX = "snyk-mem:best:v1:";

const SNAP_KEY = "snyk-mem:snapshot";

const DEFAULT_SIZE: GridSize = { rows: 3, cols: 4 };

const SYMBOLS_POOL = [
  "🍎",
  "🍌",
  "🍇",
  "🍑",
  "🍉",
  "🍓",
  "🍍",
  "🥝",
  "🍒",
  "🍐",
  "🍊",
  "🥥",
  "🍈",
  "🥕",
  "🌽",
  "🍆",
  "🥔",
  "🧄",
  "🧅",
  "🍄",
  "🥜",
  "🧀",
  "🥨",
  "🍪",
  "🍩",
  "🍰",
  "🧁",
  "🍔",
  "🍕",
  "🌮",
  "🍣",
  "🍤",
];

export { BEST_KEY, SYMBOLS_POOL, DEFAULT_SIZE, SNAP_KEY, BEST_KEY_PREFIX };
