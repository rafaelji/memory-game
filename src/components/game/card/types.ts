import type { RefObject } from "react";

type Card = {
  id: number;
  symbol: string;
  revealed: boolean;
  matched: boolean;
};

type CardProps = {
  index: number;
  onClick: (index: number) => void;
  lock: RefObject<boolean>;
  card: Card;
};

export type { CardProps, Card };
