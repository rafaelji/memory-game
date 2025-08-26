import { useRef } from "react";
import { useNavigate } from "react-router";
import { formatDuration } from "@/shared/helpers/time.ts";
import Button from "@/components/button/Button.tsx";
import { ROUTES } from "@/constants/routes";
import type { VictoryOverlayProps } from "@/components/game/victory-overlay/types.ts";
import "./VictoryOverlay.css";

const VictoryOverlay = ({
  totalSeconds,
  totalMoves,
  startNew,
}: VictoryOverlayProps) => {
  const nav = useNavigate();
  const winBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="You win"
    >
      <div className="overlay__card panel" role="document">
        <div className="overlay__win-icon" aria-hidden>
          🏆
        </div>
        <h3 className="mt-0 text-center">You won!</h3>
        <p className="overlay__win-meta">
          Finished in <strong>{formatDuration(totalSeconds)}</strong> with{" "}
          <strong>{totalMoves}</strong> moves.
        </p>
        <div className="overlay__actions">
          <Button ref={winBtnRef} onClick={startNew} className="full-width">
            Play again
          </Button>
          <Button
            variant="ghost"
            onClick={() => nav(ROUTES.SCORE)}
            className="full-width"
          >
            View scores
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VictoryOverlay;
