"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "./motion/MotionProvider";
import { motionConfig } from "@/lib/motion";

export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const { enabled, isTouch } = useMotion();

  useEffect(() => {
    if (!enabled || isTouch) return;
    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!ringEl || !dotEl) return;

    const pos = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let hovering = false;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      visible = true;
      const t = e.target as HTMLElement | null;
      hovering = !!(t?.closest("a, button, .hoverable, .project-row"));
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const loop = () => {
      cur.x += (pos.x - cur.x) * motionConfig.cursorLerp;
      cur.y += (pos.y - cur.y) * motionConfig.cursorLerp;
      const size = hovering ? 64 : 40;
      ringEl.style.opacity = visible ? "1" : "0";
      dotEl.style.opacity = visible ? "1" : "0";
      ringEl.style.width = `${size}px`;
      ringEl.style.height = `${size}px`;
      ringEl.style.transform = `translate(${cur.x - size / 2}px, ${cur.y - size / 2}px)`;
      dotEl.style.transform = `translate(${pos.x - 3}px, ${pos.y - 3}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled, isTouch]);

  if (!enabled || isTouch) return null;

  const border = "color-mix(in srgb, var(--text) 70%, transparent)";
  const fill = "var(--accent)";

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          width: 40,
          height: 40,
          border: `1px solid ${border}`,
          borderRadius: "50%",
          pointerEvents: "none",
          opacity: 0,
          transition: "width 0.25s, height 0.25s, border-color 0.4s",
        }}
      />
      <div
        ref={dot}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          width: 6,
          height: 6,
          background: fill,
          borderRadius: "50%",
          pointerEvents: "none",
          opacity: 0,
          transition: "background 0.4s",
        }}
      />
    </>
  );
}
