import { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import Hud from "@/components/game/hud/Hud.tsx";
import Card from "@/components/game/card/Card.tsx";
import { type Card as CardType } from "@/components/game/card/types.ts";
import { DEFAULT_SIZE, SYMBOLS_POOL } from "@/constants/game";
import { shuffle } from "@/pages/game/Helper.ts";
import {
  writeSnapshot,
  clearSnapshot,
  readSnapshot,
  readBest,
  maybeWriteBest,
} from "@/services/game";
import { fetchGameImages } from "@/services/images";
import { type GameImage } from "@/services/images/types";
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

  // undefined = deciding; null = emojis; array Pexels loaded
  const [images, setImages] = useState<GameImage[] | null | undefined>(
    undefined,
  );

  /** Initialize a new shuffled deck */
  const makeDeck = (): CardType[] => {
    if (images && images.length >= pairsCount) {
      let id = 0;
      const cards: CardType[] = [];
      for (const img of images.slice(0, pairsCount)) {
        const base = {
          imageUrl: img.url,
          alt: img.alt,
          revealed: false,
          matched: false,
        } as const;

        cards.push({ id: id++, symbol: img.id, ...base });
        cards.push({ id: id++, symbol: img.id, ...base });
      }
      return shuffle(cards);
    }

    // Fallback: emojis
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
    clearSnapshot();
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

  // Decide between images and emojis.
  useEffect(() => {
    let alive = true;
    (async () => {
      const imgs = await fetchGameImages({
        count: pairsCount,
        query: "animals",
      });
      if (alive) setImages(imgs ?? null);
    })();
    return () => {
      alive = false;
    };
  }, [pairsCount]);

  /** Tick timer */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  /** Finish when all pairs are found: stop timer, maybe update best, clear snapshot */
  useEffect(() => {
    if (foundPairs !== pairsCount) return;
    setRunning(false);
    maybeWriteBest(username, gridSize, moves, seconds);
    clearSnapshot(); // don't resume a finished game
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundPairs, pairsCount]);

  /** Bootstrap: wait for images decision, restore snapshot if present, otherwise start new */
  useEffect(() => {
    if (images === undefined) return;
    const saved = readSnapshot(gridSize);
    if (saved) {
      setDeck(saved.deck);
      setMoves(saved.moves);
      setFoundPairs(saved.foundPairs);
      setSeconds(saved.seconds);
      setRunning(saved.running);
      firstPick.current = null;
      lock.current = false;
    } else {
      startNew();
    }
    // Run when grid changes or images decision changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize.rows, gridSize.cols, images]);

  /** Persist snapshot whenever structure changes */
  useEffect(() => {
    if (deck.length === 0) return;
    writeSnapshot(gridSize, {
      deck,
      moves,
      foundPairs,
      running,
      seconds,
    });
  }, [gridSize, deck, moves, foundPairs, running, seconds]);

  /** Save periodically while only the timer ticks (every 5s) to reduce churn */
  useEffect(() => {
    if (!running || seconds === 0) return;
    if (seconds % 5 === 0) {
      writeSnapshot(gridSize, {
        deck,
        moves,
        foundPairs,
        running,
        seconds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, running]);

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
        aria-label={`${gridSize.rows} by ${gridSize.cols} memory grid`}
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
