"use client";

import { useRef, type MouseEvent } from "react";
import type { Theme } from "@/lib/theme";
import { useMotion } from "@/components/motion/MotionProvider";
import { motionConfig } from "@/lib/motion";

const WORD = "CHRISTIAN ADA";

function scatterLetter(el: HTMLButtonElement | null, enabled: boolean) {
  if (!el || !enabled) return;
  const x = (Math.random() - 0.5) * 90;
  const y = (Math.random() - 0.5) * 70;
  const rot = (Math.random() - 0.5) * 22;
  el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
}

export default function TypeLab({ tk }: { tk: Theme }) {
  const { enabled, isTouch } = useMotion();
  const letters = useRef<(HTMLButtonElement | null)[]>([]);

  const magnet = (e: MouseEvent<HTMLButtonElement>, i: number) => {
    const el = letters.current[i];
    if (!el || !enabled || isTouch) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * motionConfig.magnetic * 1.4;
    const y = (e.clientY - r.top - r.height / 2) * motionConfig.magnetic * 1.4;
    el.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.1}deg)`;
  };

  const rest = (i: number) => {
    const el = letters.current[i];
    if (el) el.style.transform = "translate(0,0) rotate(0deg)";
  };

  return (
    <div className="lab-stage">
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: "0.06em", alignItems: "flex-end", minHeight: 140, maxWidth: 920 }}
        aria-label={WORD}
      >
        {WORD.split("").map((letter, i) =>
          letter === " " ? (
            <span key={`space-${i}`} style={{ width: "0.35em" }} aria-hidden="true" />
          ) : (
            <button
              key={`${letter}-${i}`}
              type="button"
              ref={(node) => { letters.current[i] = node; }}
              className="display hoverable"
              onMouseMove={(e) => magnet(e, i)}
              onMouseLeave={() => rest(i)}
              onClick={() => scatterLetter(letters.current[i], enabled)}
              style={{
                fontSize: "clamp(3.2rem, 9vw, 7.2rem)",
                lineHeight: 0.9,
                background: "none",
                border: "none",
                color: i > 9 ? tk.textDim : tk.text,
                padding: 0,
                letterSpacing: "0.02em",
                transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), color 0.3s",
              }}
            >
              {letter}
            </button>
          ),
        )}
      </div>
      <p className="mono" style={{ color: tk.textFaint, fontSize: "0.65rem", letterSpacing: "0.18em", marginTop: 20, textTransform: "uppercase" }}>
        Hover to pull · click to scatter
      </p>
    </div>
  );
}
