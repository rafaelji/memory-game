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

type LeaderboardRow = { user: string; moves: number; seconds: number };

type BestScore = { moves: number; seconds: number };

export type { GameSnapshot, LeaderboardRow, BestScore };
