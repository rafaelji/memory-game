import type { BestScore } from "@/services/game/types.ts";

type GameHUDProps = {
  seconds: number;
  moves: number;
  foundPairs: number;
  pairsCount: number;
  best: BestScore | null;
  startNew: () => void;
};

export { type GameHUDProps };
