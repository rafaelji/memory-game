const GAME_PATH = "/game";

export const ROUTES = {
  LANDING: "/",
  GAME: GAME_PATH,
  SCORE: `${GAME_PATH}/score`,
} as const;
