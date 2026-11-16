"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { projects } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import type { Theme } from "@/lib/theme";
import useIsMobile from "@/hooks/useIsMobile";
import LogoPlate from "@/components/LogoPlate";

export default function Work({ tk, px }: { tk: Theme; px: string }) {
  const isMobile = useIsMobile();
  const { enabled } = useMotion();
  const pinRef = useRef<HTMLDivElement>(null);
  const frameInner = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const shown = hover ?? (isMobile ? open : active);
  const previewIndex = hover ?? 0;

  useEffect(() => {
    const pin = pinRef.current;
    const inner = frameInner.current;
    if (!pin || !inner) return;
    if (!enabled || isMobile) {
      gsap.set(inner, { yPercent: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: 0 },
        {
          yPercent: -((projects.length - 1) / projects.length) * 100,
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top 88px",
            end: motionConfig.pin.work,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              const i = Math.min(projects.length - 1, Math.floor(self.progress * projects.length + 0.001));
              setActive(i);
            },
          },
        },
      );
      gsap.fromTo(
        pin.querySelector(".browser-frame"),
        { clipPath: "inset(8% 8% 8% 8%)", scale: motionConfig.imageFromScale },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: motionConfig.duration.slow,
          ease: motionConfig.ease.expo,
          scrollTrigger: { trigger: pin, start: "top 80%", once: true },
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
        style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 64, alignItems: "start" }}
      >
        <ol style={{ listStyle: "none", margin: 0, padding: 0 }} onMouseMove={onMove}>
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

        {!isMobile ? (
          <div>
            <div
              className="browser-frame"
              style={{
                border: `1px solid ${tk.border}`,
                borderRadius: 12,
                overflow: "hidden",
                background: tk.bgAlt,
                transformOrigin: "center top",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: `1px solid ${tk.border}` }}>
                <span className="dot" /><span className="dot" /><span className="dot" />
                <span className="mono" style={{ marginLeft: 8, fontSize: "0.62rem", letterSpacing: "0.12em", color: tk.textDimmer }}>
                  {String(active + 1).padStart(2, "0")} / {projects[active].title}
                </span>
              </div>
              <div style={{ height: 340, overflow: "hidden", position: "relative" }}>
                <div ref={frameInner} style={{ height: `${projects.length * 100}%` }}>
                  {projects.map((item) => (
                    <LogoPlate
                      key={item.title}
                      src={item.logo}
                      plate={item.plate}
                      sizes="40vw"
                      style={{ height: `${100 / projects.length}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="mono" style={{ marginTop: 16, color: tk.textDimmer, fontSize: "0.68rem", letterSpacing: "0.16em" }}>
              {String(active + 1).padStart(2, "0")} — {projects[active].title}
            </p>
          </div>
        ) : null}
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
