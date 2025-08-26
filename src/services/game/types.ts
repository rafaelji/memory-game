type GameSnapshot = {
  v: 1;
  size: number;
  deck: { id: number; symbol: string; revealed: boolean; matched: boolean }[];
  moves: number;
  foundPairs: number;
  running: boolean;
  seconds: number;
  savedAt: number; // ms
};

export { type GameSnapshot };
