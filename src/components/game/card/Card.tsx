import type { CardProps } from "./types.ts";
import "./Card.css";

const Card = ({ card, lock, index, onClick }: CardProps) => {
  const state = card.matched
    ? "matched"
    : card.revealed
      ? "revealed"
      : "hidden";

  return (
    <button
      type="button"
      className={`card card--${state}`}
      role="gridcell"
      aria-pressed={card.revealed}
      aria-label={
        card.matched
          ? `Matched ${card.symbol}`
          : card.revealed
            ? `Revealed ${card.symbol}`
            : "Hidden card"
      }
      onClick={() => onClick(index)}
      disabled={card.matched || (lock.current && !card.revealed)}
    >
      <span className="card__face card__face--front">
        {"imageUrl" in card && card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.alt || ""}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ) : (
          card.symbol
        )}
      </span>
      <span className="card__face card__face--back">?</span>
    </button>
  );
};

export default Card;
