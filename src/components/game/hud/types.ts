type GameHUDProps = {
  seconds: number;
  moves: number;
  foundPairs: number;
  pairsCount: number;
  best: { moves: number; seconds: number } | null;
  startNew: () => void;
};

export { type GameHUDProps };
