/** LocalStorage key for best scores per user + size */
const BEST_KEY = (user: string, size: number) =>
  `snyk-mem:best:v1:${user}:${size}`;

const DEFAULT_SIZE = 4;

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

export { BEST_KEY, SYMBOLS_POOL, DEFAULT_SIZE };
