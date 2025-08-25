import { forwardRef } from "react";
import type { ButtonProps } from "./types.ts";
import "./Button.css";

/** Tiny helper to join classNames without extra deps */
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    loading = false,
    fullWidth,
    className,
    children,
    disabled,
    type = "button",
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      disabled={isDisabled}
      className={cx(
        "btn",
        variant === "primary" && "btn--primary",
        variant === "ghost" && "btn--ghost",
        variant === "danger" && "btn--danger",
        fullWidth && "full-width",
        className,
      )}
      {...rest}
    >
      <span className="btn__content">
        {loading && <span className="spinner" aria-hidden="true" />}
        <span>{children}</span>
      </span>
    </button>
  );
});

export default Button;
