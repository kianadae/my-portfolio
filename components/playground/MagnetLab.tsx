"use client";

import { useEffect, useRef } from "react";
import type { Theme } from "@/lib/theme";
import { useMotion } from "@/components/motion/MotionProvider";

export default function MagnetLab({ tk, isMobile }: { tk: Theme; isMobile: boolean }) {
  const { enabled } = useMotion();
  const root = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLSpanElement[]>([]);
  const pointer = useRef({ x: -9999, y: -9999, on: false });
  const cols = isMobile ? 12 : 22;
  const rows = isMobile ? 10 : 12;
  const cells = cols * rows;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const nodes = dots.current;
    let raf = 0;

    const reset = () => {
      nodes.forEach((n) => {
        n.style.transform = "translate3d(0,0,0) scale(1)";
        n.style.opacity = "0.45";
      });
    };

    if (!enabled) {
      reset();
      return;
    }

    const tick = () => {
      if (!pointer.current.on) {
        reset();
        return;
      }
      const rect = el.getBoundingClientRect();
      const cellW = rect.width / cols;
      const cellH = rect.height / rows;
      const x = pointer.current.x;
      const y = pointer.current.y;
      nodes.forEach((n, i) => {
        const cx = (i % cols + 0.5) * cellW;
        const cy = (Math.floor(i / cols) + 0.5) * cellH;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.max(16, Math.hypot(dx, dy));
        const pull = Math.min(1, 160 / dist);
        n.style.transform = `translate3d(${(dx / dist) * pull * 22}px, ${(dy / dist) * pull * 22}px, 0) scale(${1 + pull * 1.6})`;
        n.style.opacity = String(0.22 + pull * 0.78);
      });
      raf = window.requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, on: true };
      if (!raf) raf = window.requestAnimationFrame(tick);
    };
    const onLeave = () => {
      pointer.current.on = false;
      window.cancelAnimationFrame(raf);
      raf = 0;
      reset();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerup", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerup", onLeave);
      window.cancelAnimationFrame(raf);
      reset();
    };
  }, [enabled, cols, rows]);

  return (
    <div className="lab-stage">
      <div
        ref={root}
        className="hoverable"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: isMobile ? 8 : 12,
          minHeight: isMobile ? 220 : 320,
          alignItems: "center",
          touchAction: "none",
        }}
      >
        {Array.from({ length: cells }, (_, i) => (
          <span
            key={i}
            ref={(node) => { if (node) dots.current[i] = node; }}
            style={{
              width: isMobile ? 6 : 8,
              height: isMobile ? 6 : 8,
              borderRadius: "50%",
              background: tk.text,
              opacity: 0.45,
              justifySelf: "center",
              display: "block",
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    </div>
  );
}
