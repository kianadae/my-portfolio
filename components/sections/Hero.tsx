"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "@/components/motion/SplitText";
import FadeIn from "@/components/motion/FadeIn";
import AucklandClock from "@/components/AucklandClock";
import { useMotion } from "@/components/motion/MotionProvider";
import { motionConfig } from "@/lib/motion";
import { CV, EMAIL } from "@/lib/content";
import type { Theme } from "@/lib/theme";

export default function Hero({
  tk,
  isMobile,
}: {
  tk: Theme
  isMobile: boolean
}) {
  const { enabled } = useMotion();
  const hero = useRef<HTMLElement>(null);
  const name = useRef<HTMLDivElement>(null);
  const sub = useRef<HTMLDivElement>(null);
  const scrollHint = useRef<HTMLDivElement>(null);
  const dur = "0.45s";

  useEffect(() => {
    const root = hero.current;
    if (!root) return;
    if (!enabled) {
      gsap.set([name.current, sub.current, scrollHint.current], { clearProps: "all" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      })
        .to(name.current, {
          y: isMobile ? -36 : -motionConfig.parallaxHero,
          scale: motionConfig.heroScale,
          opacity: 0.28,
          ease: "none",
        }, 0)
        .to([sub.current, scrollHint.current], { opacity: 0, y: isMobile ? -12 : -24, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, [enabled, isMobile]);

  return (
    <section
      id="hero"
      ref={hero}
      className="hero"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        minHeight: "100svh",
        padding: isMobile ? "112px 24px 72px" : "132px 64px 96px",
        overflowX: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
        <div
          className="display hero-ghost"
          style={{
            lineHeight: 1,
            color: tk.ghostText,
            letterSpacing: "-0.05em",
            userSelect: "none",
            transition: `color ${dur}`,
          }}
        >
          WEB
        </div>
      </div>

      {!isMobile && (
        <div style={{ position: "absolute", top: 94, right: 64, textAlign: "right" }}>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 4 }}>Based in</div>
          <div className="kicker" style={{ color: tk.textDim, letterSpacing: "0.2em" }}>Auckland, NZ</div>
          <div className="mono" style={{ marginTop: 8, fontSize: "0.65rem" }}>
            <AucklandClock color={tk.textDimmer} />
          </div>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 10 }}>
        <FadeIn delay={0.1}>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 24, letterSpacing: "0.35em" }}>
            ✦ WordPress Developer {isMobile && "— Auckland, NZ"}
          </div>
        </FadeIn>

        <div ref={name} className="display" style={{ lineHeight: 0.9, transformOrigin: "left center" }}>
          <h1 className="display" style={{ margin: 0, fontWeight: 400 }}>
            <SplitText
              text="CHRISTIAN"
              mode="chars"
              as="span"
              className="display hero-name"
              style={{ color: tk.text }}
            />
            <SplitText
              text="ADA"
              mode="chars"
              as="span"
              delay={0.18}
              className="display hero-name"
              style={{ color: tk.textDimmer }}
            />
          </h1>
        </div>

        <div ref={sub} style={{ marginTop: 32, display: "flex", alignItems: "center", gap: isMobile ? 16 : 40, flexWrap: "wrap" }}>
          <p className="kicker" style={{ color: tk.textDimmer, fontSize: "0.72rem", letterSpacing: "0.15em", maxWidth: 320, lineHeight: 1.8 }}>
            WordPress · Integrations · QA · Performance
          </p>
          <div style={{ width: 1, height: 32, background: tk.border }} />
          <p className="mono" style={{ color: tk.textDimmer, fontSize: "0.72rem" }}>5+ yrs exp.</p>
          {isMobile ? (
            <div className="mono" style={{ fontSize: "0.65rem" }}>
              <AucklandClock color={tk.textDimmer} />
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <span
            className="mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              color: tk.textDim,
              fontSize: "0.62rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              marginRight: 8,
            }}
          >
            <span className="status-dot" aria-hidden="true" />
            Open to Auckland roles · freelance
          </span>
        </div>
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a className="btn btn-primary hoverable" href={`mailto:${EMAIL}`}>
            Email me
          </a>
          <a className="btn btn-ghost hoverable" href={CV} target="_blank" rel="noopener noreferrer">
            Download CV
          </a>
        </div>
      </div>

      <div ref={scrollHint} style={{ position: "absolute", bottom: 32, right: isMobile ? 24 : 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div className="kicker" style={{ color: tk.textDimmer, fontSize: "0.6rem", writingMode: "vertical-rl" }}>Scroll</div>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${tk.textDim}, transparent)` }} />
      </div>
    </section>
  );
}
