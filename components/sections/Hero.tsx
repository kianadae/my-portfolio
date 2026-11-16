"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitText from "@/components/motion/SplitText";
import FadeIn from "@/components/motion/FadeIn";
import AucklandClock from "@/components/AucklandClock";
import { useMotion } from "@/components/motion/MotionProvider";
import { motionConfig } from "@/lib/motion";
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
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        minHeight: "100vh",
        padding: isMobile ? "0 24px 80px" : "0 64px 128px",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
        <div
          className="display"
          style={{
            fontSize: "clamp(10rem, 40vw, 52rem)",
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

        <div ref={name} className="display" style={{ lineHeight: 0.88, transformOrigin: "left center" }}>
          <h1 className="display" style={{ margin: 0, fontWeight: 400 }}>
            <SplitText
              text="CHRISTIAN"
              mode="chars"
              as="span"
              className="display"
              style={{ display: "block", fontSize: "clamp(4rem, 18vw, 18rem)", letterSpacing: "-0.02em", color: tk.text }}
            />
            <SplitText
              text="ADA"
              mode="chars"
              as="span"
              delay={0.18}
              className="display"
              style={{ display: "block", fontSize: "clamp(4rem, 18vw, 18rem)", letterSpacing: "-0.02em", color: tk.textDimmer }}
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
      </div>

      <div ref={scrollHint} style={{ position: "absolute", bottom: 32, right: isMobile ? 24 : 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div className="kicker" style={{ color: tk.textDimmer, fontSize: "0.6rem", writingMode: "vertical-rl" }}>Scroll</div>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${tk.textDim}, transparent)` }} />
      </div>
    </section>
  );
}
