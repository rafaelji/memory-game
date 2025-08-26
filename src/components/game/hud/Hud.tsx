import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "@/components/button/Button.tsx";
import { ROUTES } from "@/constants/routes";
import { formatTime } from "@/shared/helpers/time";
import type { GameHUDProps } from "@/components/game/hud/types.ts";
import useAuth from "@/hooks/useAuth";
import logger from "@/services/logger";
import "./Hud.css";

const Hud = ({
  seconds,
  moves,
  foundPairs,
  pairsCount,
  best,
  startNew,
}: GameHUDProps) => {
  const nav = useNavigate();
  const { session, logout } = useAuth();
  const username = session?.username ?? "guest";

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return; // idempotent guard
    setLoggingOut(true);
    try {
      await logout(); // async mutation
      nav(ROUTES.LANDING, { replace: true });
    } catch (err) {
      logger.error("[Game] logout failed", err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="panel hud">
      <div className="hud__stats">
        <div className="stat">
          <span className="stat__label">Player</span>
          <span className="stat__value">{username}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Time</span>
          <span className="stat__value">{formatTime(seconds)}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Moves</span>
          <span className="stat__value">{moves}</span>
        </div>
        <div className="stat">
          <span className="stat__label">Pairs</span>
          <span className="stat__value">
            {foundPairs}/{pairsCount}
          </span>
        </div>
        {best && (
          <div className="stat">
            <span className="stat__label">Best</span>
            <span className="stat__value">
              {best.moves} moves · {formatTime(best.seconds)}
            </span>
          </div>
        )}
      </div>

      <div className="hud__actions">
        <Button onClick={startNew}>Restart</Button>
        <Button variant="ghost" onClick={() => nav(ROUTES.SCORE)}>
          View scores
        </Button>
        <Button variant="danger" loading={loggingOut} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Hud;
