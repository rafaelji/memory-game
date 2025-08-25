import { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Hud from "@/components/game/hud/Hud.tsx";
import Card from "@/components/game/card/Card.tsx";
import { type Card as CardType } from "@/components/game/card/types.ts";
import { DEFAULT_SIZE, SYMBOLS_POOL } from "@/constants/game";
import { readBest, shuffle, writeBest } from "@/pages/game/Helper.ts";
import type { GridSize } from "./types";
import "./Game.css";

const Game = () => {
  const { session } = useAuth();
  const username = session?.username ?? "guest";

  const [gridSize] = useState<GridSize>(DEFAULT_SIZE);
  const currentUserBestScore = readBest(username, gridSize);

  // Deck
  const pairsCount = useMemo(
    () => (gridSize.rows * gridSize.cols) / 2,
    [gridSize],
  );
  const [deck, setDeck] = useState<CardType[]>([]);

  // Selection state
  const firstPick = useRef<number | null>(null); // card index in deck
  const lock = useRef<boolean>(false); // prevent clicks while resolving

  // Timer
  const [seconds, setSeconds] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);

  // Moves and matches
  const [moves, setMoves] = useState<number>(0);
  const [foundPairs, setFoundPairs] = useState<number>(0);

  /** Initialize a new shuffled deck */
  const makeDeck = (): CardType[] => {
    const chosenSymbols = SYMBOLS_POOL.slice(0, pairsCount);
    let id = 0;
    const cards: CardType[] = [];
    for (const symbol of chosenSymbols) {
      cards.push({ id: id++, symbol: symbol, revealed: false, matched: false });
      cards.push({ id: id++, symbol: symbol, revealed: false, matched: false });
    }
    return shuffle(cards);
  };

  /** Start or restart game */
  const startNew = () => {
    setDeck(makeDeck());
    setMoves(0);
    setSeconds(0);
    setFoundPairs(0);
    setRunning(false);
    firstPick.current = null;
    lock.current = false;
  };

  /** Card click handler */
  const onCardClick = (currentCardIndex: number) => {
    if (lock.current) return;
    const selectedCard = deck[currentCardIndex];
    if (!selectedCard || selectedCard.matched || selectedCard.revealed) return;

    // start timer on first interaction
    if (!running && moves === 0 && firstPick.current === null) {
      setRunning(true);
    }

    const updatedDeck = deck.slice();
    updatedDeck[currentCardIndex] = { ...selectedCard, revealed: true };
    setDeck(updatedDeck);

    // first pick
    if (firstPick.current === null) {
      firstPick.current = currentCardIndex;
      return;
    }

    // second pick
    const firstPickIndex = firstPick.current;
    const firstSelectedCard = updatedDeck[firstPickIndex];
    const secondSelectedCard = updatedDeck[currentCardIndex];
    setMoves((totalMoves) => totalMoves + 1);
    firstPick.current = null;

    if (firstSelectedCard.symbol === secondSelectedCard.symbol) {
      // match
      updatedDeck[firstPickIndex] = { ...firstSelectedCard, matched: true };
      updatedDeck[currentCardIndex] = { ...secondSelectedCard, matched: true };
      setDeck(updatedDeck);
      setFoundPairs((totalFoundPairs) => totalFoundPairs + 1);
      return;
    }

    // no match: briefly show both, then hide
    lock.current = true;
    setTimeout(() => {
      setDeck((currentDeck) => {
        const firstRevealedCard = currentDeck[firstPickIndex];
        const secondRevealedCard = currentDeck[currentCardIndex];
        // defensively check they still exist
        if (firstRevealedCard)
          currentDeck[firstPickIndex] = {
            ...firstRevealedCard,
            revealed: false,
          };
        if (secondRevealedCard)
          currentDeck[currentCardIndex] = {
            ...secondRevealedCard,
            revealed: false,
          };
        return currentDeck.slice();
      });
      lock.current = false;
    }, 650);
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Stop timer and store best when finished
  useEffect(() => {
    if (foundPairs !== pairsCount) return;
    setRunning(false);

    // best score: fewer moves wins; tie-breaker is faster time
    const best = readBest(username, gridSize);
    const shouldSave =
      !best ||
      moves < best.moves ||
      (moves === best.moves && seconds < best.seconds);

    if (shouldSave) {
      writeBest(username, gridSize, moves, seconds);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundPairs, pairsCount]);

  // Initialize once
  useEffect(() => {
    startNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="game">
      <Hud
        seconds={seconds}
        moves={moves}
        foundPairs={foundPairs}
        pairsCount={pairsCount}
        best={currentUserBestScore}
        startNew={startNew}
      />

      {/* Live status for screen readers only */}
      <p className="sr-only" aria-live="polite" role="status">
        {foundPairs === pairsCount
          ? "All pairs found. You win!"
          : `${pairsCount - foundPairs} pairs remaining.`}
      </p>

      <div
        className="game__grid"
        role="grid"
        aria-label={`${gridSize} by ${gridSize} memory grid`}
        style={{
          gridTemplateRows: `repeat(${gridSize.rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
        }}
      >
        {deck.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            lock={lock}
            index={index}
            onClick={onCardClick}
          />
        ))}
      </div>
    </section>
  );
};

export default Game;
