"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { projects } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import type { Theme } from "@/lib/theme";
import LogoPlate from "@/components/LogoPlate";

const COUNT = projects.length;

export default function OrbitLab({ tk, isMobile }: { tk: Theme; isMobile: boolean }) {
  const { enabled } = useMotion();
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const angle = useRef(0);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const pauseUntil = useRef(0);

  const cardW = isMobile ? 180 : 240;
  const cardH = isMobile ? 116 : 152;
  const radius = useMemo(
    () => Math.round((cardW / 2 / Math.tan(Math.PI / COUNT)) * 0.9),
    [cardW],
  );
  const step = 360 / COUNT;

  const apply = (deg: number) => {
    angle.current = deg;
    if (ring.current) ring.current.style.transform = `rotateY(${deg}deg)`;
    const i = ((Math.round(-deg / step) % COUNT) + COUNT) % COUNT;
    setActive(i);
  };

  const snap = (i: number) => {
    pauseUntil.current = performance.now() + 1800;
    const next = -i * step;
    if (!enabled || !ring.current) {
      apply(next);
      return;
    }
    const state = { n: angle.current };
    gsap.killTweensOf(state);
    gsap.to(state, {
      n: next,
      duration: motionConfig.duration.fast,
      ease: motionConfig.ease.out,
      overwrite: true,
      onUpdate: () => apply(state.n),
    });
  };

  useEffect(() => {
    if (!auto || !enabled) return;
    let raf = 0;
    const tick = (now: number) => {
      if (!dragging.current && now > pauseUntil.current) apply(angle.current - 0.12);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [auto, enabled]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      pauseUntil.current = performance.now() + 1200;
      apply(angle.current + e.deltaY * 0.08);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") snap((active - 1 + COUNT) % COUNT);
      if (e.key === "ArrowRight") snap((active + 1) % COUNT);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="lab-stage">
      <div
        ref={stage}
        className="work-orbit hoverable"
        style={{ height: isMobile ? 240 : 340, ["--orbit-tilt" as string]: "-10deg" }}
        onPointerDown={(e) => {
          dragging.current = true;
          lastX.current = e.clientX;
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          apply(angle.current + (e.clientX - lastX.current) * 0.35);
          lastX.current = e.clientX;
        }}
        onPointerUp={() => {
          dragging.current = false;
          snap(active);
        }}
      >
        <div className="work-orbit-scene" style={{ width: cardW, height: cardH }}>
          <div ref={ring} className="work-orbit-ring">
            {projects.map((item, i) => (
              <button
                key={item.title}
                type="button"
                className={`work-orbit-card${active === i ? " is-front" : ""}`}
                onClick={() => snap(i)}
                aria-label={item.title}
                style={{
                  transform: `rotateY(${step * i}deg) translateZ(${radius}px)`,
                  border: `1px solid ${tk.border}`,
                  background: "transparent",
                  padding: 0,
                }}
              >
                <LogoPlate src={item.logo} plate={item.plate} sizes="240px" style={{ width: "100%", height: "100%" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mono" style={{ textAlign: "center", color: tk.textDimmer, fontSize: "0.68rem", letterSpacing: "0.16em", marginTop: 8 }}>
        {String(active + 1).padStart(2, "0")} — {projects[active].title}
      </p>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
        <button type="button" className="copy-btn hoverable" style={{ color: tk.textDim, borderColor: tk.border }} onClick={() => snap((active - 1 + COUNT) % COUNT)}>
          Prev
        </button>
        <button type="button" className="copy-btn hoverable" style={{ color: tk.textDim, borderColor: tk.border }} onClick={() => snap((active + 1) % COUNT)}>
          Next
        </button>
        <button
          type="button"
          className="copy-btn hoverable"
          aria-pressed={auto}
          style={{ color: auto ? tk.text : tk.textDim, borderColor: auto ? tk.text : tk.border }}
          onClick={() => setAuto((v) => !v)}
        >
          Auto {auto ? "on" : "off"}
        </button>
      </div>
    </div>
  );
}
