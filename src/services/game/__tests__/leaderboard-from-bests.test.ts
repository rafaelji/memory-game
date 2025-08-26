import { readLeaderboardFromBests } from "@/services/game";
import { beforeEach, describe, expect, it } from "vitest";

const BEST_KEY = (user: string, cells: number) =>
  `snyk-mem:best:v1:${user}:${cells}`;

describe("readLeaderboardFromBests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("sorts by fewer moves, then by fewer seconds", () => {
    const grid = { rows: 3, cols: 4 }; // 4x3 => 12 cells
    const cells = grid.rows * grid.cols;

    // alice: 20 moves, 75s
    localStorage.setItem(
      BEST_KEY("alice", cells),
      JSON.stringify({ moves: 20, seconds: 75 }),
    );
    // bob: 18 moves, 140s
    localStorage.setItem(
      BEST_KEY("bob", cells),
      JSON.stringify({ moves: 18, seconds: 140 }),
    );
    // carol: 18 moves, 120s (ties moves with bob; wins on time)
    localStorage.setItem(
      BEST_KEY("carol", cells),
      JSON.stringify({ moves: 18, seconds: 120 }),
    );
    // dave: invalid entry should be ignored
    localStorage.setItem(
      BEST_KEY("dave", cells),
      JSON.stringify({ moves: "x" }),
    );

    const rows = readLeaderboardFromBests(grid, 100);
    expect(rows.map((r) => r.user)).toEqual(["carol", "bob", "alice"]);
    expect(rows[0]).toEqual({ user: "carol", moves: 18, seconds: 120 });
  });

  it("returns empty when no valid bests are present", () => {
    const grid = { rows: 3, cols: 4 };
    const rows = readLeaderboardFromBests(grid);
    expect(rows).toEqual([]);
  });
});
