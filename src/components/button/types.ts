import { type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
  "data-testid"?: string;
};

export { type ButtonProps };
