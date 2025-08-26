import { useMemo, type CSSProperties } from "react";
import type { ConfettiProps } from "@/components/confetti/types.ts";
import "./Confetti.css";

export default function Confetti({ active, count = 140 }: ConfettiProps) {
  // Precompute particles once per mount
  const pieces = useMemo(() => {
    if (!active) return [];
    return Array.from({ length: count }, (_, i) => {
      const left = Math.random() * 100; // % from left
      const size = 6 + Math.random() * 6; // px
      const delay = Math.random() * 0.6; // s
      const duration = 1.8 + Math.random() * 1.6; // s
      const hue = Math.floor(Math.random() * 360); // color
      const rot = Math.floor(Math.random() * 360); // start rotation
      const sway = -24 + Math.random() * 48; // px horizontal sway
      return { id: i, left, size, delay, duration, hue, rot, sway };
    });
  }, [active, count]);

  if (!active) return null;

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti__piece"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 0.4}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              // CSS custom props consumed in keyframes:
              "--h": `${p.hue}`,
              "--rot": `${p.rot}deg`,
              "--sway": `${p.sway}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
