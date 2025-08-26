import type { GridSize } from "@/pages/game/types";

type OutletContextProps = {
  username: string;
  gridSize: GridSize;
  moves: number;
  seconds: number;
  foundPairs: number;
  pairsCount: number;
  startNew: () => void;
};

export { type OutletContextProps };
