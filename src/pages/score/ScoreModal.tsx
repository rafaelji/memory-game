import { useEffect, useRef, type MouseEvent, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { readBest, readLeaderboardFromBests } from "@/services/game";
import { formatDuration } from "@/shared/helpers/time";
import Button from "@/components/button/Button";
import type { OutletContextProps } from "./types";
import "./ScoreModal.css";

export default function ScoreModal() {
  const nav = useNavigate();
  const { username, gridSize, moves, seconds, startNew } =
    useOutletContext<OutletContextProps>();

  const firstBtnRef = useRef<HTMLButtonElement>(null);
  const best = readBest(username, gridSize);
  const board = readLeaderboardFromBests(gridSize, 100);

  // close helpers
  const close = useCallback(
    (isResuming = true) =>
      nav("/game", { replace: true, state: { isResuming } }),
    [nav],
  );

  const onBackdrop = (e: MouseEvent) => {
    if (e.target === e.currentTarget) close();
  };

  // focus first button for a11y
  useEffect(() => {
    firstBtnRef.current?.focus();
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      onMouseDown={onBackdrop}
    >
      <div className="modal__panel panel" role="document">
        <h2 className="mt-0 text-center">Fastest memorizers</h2>

        <div className="scores">
          <div className="scores__row">
            <span className="scores__label">Grid</span>
            <span className="scores__value">
              {gridSize.rows} × {gridSize.cols}
            </span>
          </div>
          <div className="scores__row">
            <span className="scores__label">Current run</span>
            <span className="scores__value">
              {moves} moves · {formatDuration(seconds)}
            </span>
          </div>
          <div className="scores__row">
            <span className="scores__label">Your best</span>
            <span className="scores__value">
              {best
                ? `${best.moves} moves · ${formatDuration(best.seconds)}`
                : "—"}
            </span>
          </div>
        </div>

        {/* Leaderboard (best → worst) */}
        <ol className="board" aria-label="Leaderboard">
          {board.map((e, i) => (
            <li key={`${e.user}-${i}`} className="board__row">
              <span className="board__rank">({i + 1})</span>
              <span className="board__name">{e.user}</span>
              <span className="board__stats">
                {e.moves} moves · {formatDuration(e.seconds)}
              </span>
            </li>
          ))}
          {board.length === 0 && (
            <li className="board__empty">No scores yet. Play a game!</li>
          )}
        </ol>

        <div className="modal__actions">
          <Button
            ref={firstBtnRef}
            onClick={() => {
              startNew();
              close(false);
            }}
          >
            Play again
          </Button>
          <Button variant="ghost" onClick={() => close()}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
