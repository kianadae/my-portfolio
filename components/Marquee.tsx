"use client";

import { projects } from "@/lib/content";
import type { Theme } from "@/lib/theme";
import { useMotion } from "@/components/motion/MotionProvider";

export default function Marquee({ tk, reverse = false }: { tk: Theme; reverse?: boolean }) {
  const { enabled } = useMotion();
  const names = enabled
    ? [...projects.map((p) => p.title), ...projects.map((p) => p.title)]
    : projects.map((p) => p.title);

  return (
    <div
      className="marquee"
      aria-hidden="true"
      style={{
        overflow: enabled ? "hidden" : "auto",
        borderTop: `1px solid ${tk.border}`,
        borderBottom: `1px solid ${tk.border}`,
        padding: "18px 0",
      }}
    >
      <div className={`marquee-track${reverse ? " reverse" : ""}`}>
        {names.map((name, i) => (
          <span
            key={`${name}-${i}`}
            style={{
              fontFamily: "var(--font-bebas), sans-serif",
              fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
              letterSpacing: "0.04em",
              color: tk.textDimmer,
              padding: "0 32px",
              whiteSpace: "nowrap",
            }}
          >
            {name}
            <span style={{ color: tk.textFaint, paddingLeft: 32 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
