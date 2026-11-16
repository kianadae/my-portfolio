"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { projects } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import type { Theme } from "@/lib/theme";
import useIsMobile from "@/hooks/useIsMobile";
import LogoPlate from "@/components/LogoPlate";

const COUNT = projects.length;

export default function Work({ tk, px }: { tk: Theme; px: string }) {
  const isMobile = useIsMobile();
  const { enabled } = useMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const shown = hover ?? (isMobile ? open : active);
  const previewIndex = hover ?? 0;

  const cardW = isMobile ? motionConfig.orbit.mobileCardWidth : motionConfig.orbit.cardWidth;
  const cardH = isMobile ? motionConfig.orbit.mobileCardHeight : motionConfig.orbit.cardHeight;
  const radius = useMemo(
    () => Math.round((cardW / 2 / Math.tan(Math.PI / COUNT)) * motionConfig.orbit.spread),
    [cardW],
  );

  useEffect(() => {
    const pin = pinRef.current;
    const ring = ringRef.current;
    if (!pin || !ring) return;

    if (!enabled) {
      gsap.set(ring, { rotateY: 0 });
      return;
    }

    const step = 360 / COUNT;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ring,
        { rotateY: 0 },
        {
          rotateY: -step * (COUNT - 1),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: isMobile ? "top 70%" : "top 88px",
            end: isMobile ? "bottom top" : motionConfig.pin.work,
            pin: !isMobile,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              const i = Math.min(COUNT - 1, Math.floor(self.progress * COUNT + 0.001));
              setActive(i);
            },
          },
        },
      );
    }, pin);
    return () => ctx.revert();
  }, [enabled, isMobile]);

  useEffect(() => {
    const el = preview.current;
    if (!el || isMobile) return;
    let raf = 0;
    const cur = { x: 0, y: 0 };
    const loop = () => {
      if (enabled) {
        cur.x += (mouse.current.x - cur.x) * motionConfig.previewLerp;
        cur.y += (mouse.current.y - cur.y) * motionConfig.previewLerp;
      } else {
        cur.x = mouse.current.x;
        cur.y = mouse.current.y;
      }
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled, isMobile]);

  const onMove = (e: MouseEvent) => {
    mouse.current = { x: e.clientX + 28, y: e.clientY - 80 };
  };

  const step = 360 / COUNT;

  return (
    <section id="work" style={{ padding: `80px ${px} 40px` }}>
      <div
        style={{
          display: "flex",
          alignItems: isMobile ? "flex-start" : "flex-end",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: isMobile ? 40 : 64,
          borderTop: `1px solid ${tk.border}`,
          paddingTop: isMobile ? 40 : 64,
        }}
      >
        <div>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>Selected Work</div>
          <h2 className="display" style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)", lineHeight: 0.9, color: tk.text, margin: 0 }}>
            Projects
          </h2>
        </div>
        <div style={{ color: tk.textDimmer, fontSize: "0.7rem", letterSpacing: "0.2em" }}>2020 — Present</div>
      </div>

      <div
        ref={pinRef}
        className="work-stage"
        style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 64, alignItems: "center" }}
      >
        <ol style={{ listStyle: "none", margin: 0, padding: 0, order: isMobile ? 2 : 0 }} onMouseMove={onMove}>
          {projects.map((item, i) => {
            const isOn = shown === i;
            return (
              <li key={item.title}>
                <button
                  type="button"
                  className="project-row hoverable"
                  aria-expanded={isMobile ? open === i : undefined}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  onClick={() => {
                    if (isMobile) setOpen(open === i ? null : i);
                    else if (!enabled) setActive(i);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    padding: "18px 0",
                    border: "none",
                    borderBottom: `1px solid ${tk.border}`,
                    background: "transparent",
                    color: isOn ? tk.text : tk.textDimmer,
                    cursor: "pointer",
                    textAlign: "left",
                    font: "inherit",
                  }}
                >
                  <span className="mono" style={{ fontSize: "0.65rem", letterSpacing: "0.18em", minWidth: 28 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="display" style={{ fontSize: "clamp(1.5rem, 3vw, 2.6rem)", lineHeight: 1, letterSpacing: "0.02em" }}>
                    {item.title}
                  </span>
                </button>
                {isMobile && open === i ? (
                  <LogoPlate src={item.logo} plate={item.plate} sizes="90vw" style={{ margin: "12px 0 20px", height: 140 }} />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div
          style={{
            order: isMobile ? 1 : 0,
            position: isMobile ? "sticky" : "relative",
            top: isMobile ? 72 : undefined,
            zIndex: 2,
            background: isMobile ? "var(--page-bg)" : "transparent",
            paddingBottom: isMobile ? 8 : 0,
          }}
        >
          <div
            className="work-orbit"
            style={{ ["--orbit-tilt" as string]: `${motionConfig.orbit.tiltX}deg` }}
            aria-hidden="true"
          >
            <div
              className="work-orbit-scene"
              style={{ width: cardW, height: cardH }}
            >
              <div ref={ringRef} className="work-orbit-ring">
                {projects.map((item, i) => {
                  const isFront = (hover ?? active) === i;
                  return (
                    <div
                      key={item.title}
                      className={`work-orbit-card${isFront ? " is-front" : ""}`}
                      style={{
                        transform: `rotateY(${step * i}deg) translateZ(${radius}px)`,
                        border: `1px solid ${tk.border}`,
                      }}
                    >
                      <LogoPlate
                        src={item.logo}
                        plate={item.plate}
                        sizes="280px"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {!isMobile ? (
            <p className="mono" style={{ marginTop: 16, color: tk.textDimmer, fontSize: "0.68rem", letterSpacing: "0.16em", textAlign: "center" }}>
              {String(active + 1).padStart(2, "0")} — {projects[active].title}
            </p>
          ) : null}
        </div>
      </div>

      {!isMobile ? (
        <div
          ref={preview}
          className="floating-preview"
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 240,
            height: 150,
            pointerEvents: "none",
            zIndex: 80,
            opacity: hover !== null ? 1 : 0,
          }}
        >
          <LogoPlate src={projects[previewIndex].logo} plate={projects[previewIndex].plate} sizes="240px" style={{ width: "100%", height: "100%" }} />
        </div>
      ) : null}
    </section>
  );
}
