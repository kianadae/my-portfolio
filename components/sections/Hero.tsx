"use client";

import { useRef } from "react";
import FadeIn from "@/components/motion/FadeIn";
import AucklandClock from "@/components/AucklandClock";
import { useMotion } from "@/components/motion/MotionProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionConfig } from "@/lib/motion";
import { EMAIL } from "@/lib/content";
import type { Theme } from "@/lib/theme";

const HEADLINE = [
  { text: "CHRISTIAN", accent: false },
  { text: "ADA", accent: true },
] as const;

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

  useGSAP(() => {
    const root = hero.current;
    const nameEl = name.current;
    if (!root || !nameEl) return;

    const masks = nameEl.querySelectorAll<HTMLElement>(".hero-word-mask");
    const units = nameEl.querySelectorAll<HTMLElement>(".hero-word-unit");

    if (!enabled) {
      gsap.set([nameEl, sub.current, scrollHint.current].filter(Boolean), { clearProps: "all" });
      gsap.set(masks, { clipPath: "none" });
      gsap.set(units, { yPercent: 0 });
      return;
    }

    gsap.set(masks, { clipPath: motionConfig.hero.clipFrom });
    gsap.set(units, { yPercent: motionConfig.hero.fromYPercent });

    gsap
      .timeline()
      .to(
        masks,
        {
          clipPath: motionConfig.hero.clipTo,
          duration: motionConfig.duration.hero,
          ease: motionConfig.ease.out,
          stagger: motionConfig.stagger.words,
        },
        0,
      )
      .to(
        units,
        {
          yPercent: 0,
          duration: motionConfig.duration.hero,
          ease: motionConfig.ease.out,
          stagger: motionConfig.stagger.words,
        },
        0,
      );

    gsap
      .timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      })
      .to(nameEl, {
        y: isMobile ? -36 : -motionConfig.parallaxHero,
        scale: motionConfig.heroScale,
        opacity: 0.28,
        ease: "none",
      }, 0)
      .to([sub.current, scrollHint.current].filter(Boolean), { opacity: 0, y: isMobile ? -12 : -24, ease: "none" }, 0);
  }, { scope: hero, dependencies: [enabled, isMobile] });

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

      <div className="hero-desktop-meta" style={{ position: "absolute", top: 94, right: 64, textAlign: "right" }}>
        <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 4 }}>Based in</div>
        <div className="kicker" style={{ color: tk.textDim, letterSpacing: "0.2em" }}>Auckland, NZ</div>
        <div className="mono" style={{ marginTop: 8, fontSize: "0.65rem" }}>
          <AucklandClock color={tk.textDimmer} />
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>
        <FadeIn delay={0.1}>
          <div className="kicker hero-kicker" style={{ color: tk.textDimmer, marginBottom: isMobile ? 16 : 24 }}>
            <span style={{ color: tk.accent }}>✦</span> WordPress Developer
            <span className="hero-loc"> — Auckland, NZ</span>
          </div>
        </FadeIn>

        <div ref={name} className="display" style={{ lineHeight: 0.9, transformOrigin: "left center" }}>
          <h1 className="display" style={{ margin: 0, fontWeight: 400 }}>
            {HEADLINE.map((line) => (
              <span
                key={line.text}
                className="display hero-name hero-word-mask"
                style={{ color: line.accent ? tk.accent : tk.text }}
              >
                <span className="hero-word-unit">{line.text}</span>
              </span>
            ))}
          </h1>
        </div>

        <div
          ref={sub}
          className="hero-sub"
          style={{
            marginTop: 32,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 40,
          }}
        >
          <p className="kicker" style={{ color: tk.textDimmer, fontSize: "0.72rem", letterSpacing: isMobile ? "0.12em" : "0.15em", maxWidth: isMobile ? "100%" : 320, lineHeight: 1.8, margin: 0 }}>
            WordPress · Integrations · QA
          </p>
          <div className="hero-sub-divider" style={{ width: 1, height: 32, background: tk.border }} />
          <p className="mono" style={{ color: tk.textDimmer, fontSize: "0.72rem", margin: 0 }}>5+ yrs exp.</p>
          <div className="hero-clock-mobile mono" style={{ fontSize: "0.65rem" }}>
            <AucklandClock color={tk.textDimmer} />
          </div>
        </div>

        <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <span
            className="mono hero-status"
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
        </div>
      </div>

      <div ref={scrollHint} className="hero-scroll-hint" style={{ position: "absolute", bottom: 32, right: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div className="kicker" style={{ color: tk.textDimmer, fontSize: "0.6rem", writingMode: "vertical-rl" }}>Scroll</div>
        <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${tk.textDim}, transparent)` }} />
      </div>
    </section>
  );
}
