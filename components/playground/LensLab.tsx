"use client";

import { useEffect, useRef } from "react";
import type { Theme } from "@/lib/theme";
import { useMotion } from "@/components/motion/MotionProvider";

export default function LensLab({ tk }: { tk: Theme }) {
  const { enabled } = useMotion();
  const root = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const lens = spot.current;
    if (!el || !lens) return;

    const move = (e: PointerEvent) => {
      if (!enabled) return;
      const r = el.getBoundingClientRect();
      lens.style.opacity = "1";
      lens.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%, -50%)`;
    };
    const leave = () => {
      lens.style.opacity = "0";
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  return (
    <div className="lab-stage">
      <div ref={root} className="lens-stage hoverable" style={{ color: tk.text }}>
        <div>
          <div className="display" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", lineHeight: 0.86, letterSpacing: "-0.02em" }}>
            WORDPRESS
          </div>
          <div className="display" style={{ fontSize: "clamp(3rem, 10vw, 7rem)", lineHeight: 0.86, letterSpacing: "-0.02em", opacity: 0.35 }}>
            DEVELOPER
          </div>
        </div>
        <div ref={spot} className="lens-spot" aria-hidden="true" />
      </div>
    </div>
  );
}
