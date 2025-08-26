import { readBest, maybeWriteBest } from "@/services/game";
import { beforeEach, describe, expect, it } from "vitest";
import { BEST_KEY } from "@/constants/game";

describe("maybeWriteBest", () => {
  const grid = { rows: 3, cols: 4 };

  beforeEach(() => {
    localStorage.clear();
  });

  it("stores when no previous best exists", () => {
    expect(readBest("alice", grid)).toBeNull();
    maybeWriteBest("alice", grid, 20, 100);
    expect(readBest("alice", grid)).toEqual({ moves: 20, seconds: 100 });
  });

  it("overwrites when moves improve", () => {
    localStorage.setItem(
      BEST_KEY("bob", grid),
      JSON.stringify({ moves: 22, seconds: 80 }),
    );
    maybeWriteBest("bob", grid, 20, 200);
    expect(readBest("bob", grid)).toEqual({ moves: 20, seconds: 200 });
  });

  it("overwrites on moves tie when time improves", () => {
    localStorage.setItem(
      BEST_KEY("carol", grid),
      JSON.stringify({ moves: 18, seconds: 150 }),
    );
    maybeWriteBest("carol", grid, 18, 120);
    expect(readBest("carol", grid)).toEqual({ moves: 18, seconds: 120 });
  });

  it("does not overwrite when worse", () => {
    localStorage.setItem(
      BEST_KEY("dave", grid),
      JSON.stringify({ moves: 18, seconds: 120 }),
    );
    maybeWriteBest("dave", grid, 20, 100);
    expect(readBest("dave", grid)).toEqual({ moves: 18, seconds: 120 });
  });
});
