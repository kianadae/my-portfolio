"use client";

import { useRef, type MouseEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { processSteps, services } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import FadeIn from "@/components/motion/FadeIn";
import type { Theme } from "@/lib/theme";

export default function Services({
  tk,
  isMobile,
  px,
  py,
}: {
  tk: Theme
  isMobile: boolean
  px: string
  py: string
}) {
  const { enabled, isTouch } = useMotion();
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = grid.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>(".expertise-card");

    cards.forEach((card) => {
      const media = card.querySelector<HTMLElement>(".expertise-media");
      const figure = card.querySelector<HTMLElement>(".expertise-figure");
      if (!enabled) {
        if (media) gsap.set(media, { clipPath: "none" });
        if (figure) gsap.set(figure, { yPercent: 0 });
        return;
      }
      if (media) {
        gsap.fromTo(
          media,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0 0 0)",
            duration: motionConfig.duration.slow,
            ease: motionConfig.ease.out,
            scrollTrigger: { trigger: card, start: "top 82%", once: true },
          },
        );
      }
      if (figure) {
        gsap.fromTo(
          figure,
          { yPercent: -motionConfig.expertiseParallax },
          {
            yPercent: motionConfig.expertiseParallax,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      }
    });
  }, { scope: grid, dependencies: [enabled] });

  const tilt = (e: MouseEvent<HTMLElement>) => {
    if (!enabled || isTouch || isMobile) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * motionConfig.expertiseTilt;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -motionConfig.expertiseTilt;
    el.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
  };

  return (
    <section id="services" style={{ padding: `${py} ${px}`, borderTop: `1px solid ${tk.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isMobile ? 24 : 64, marginBottom: isMobile ? 40 : 64 }}>
        <FadeIn>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>For teams & businesses</div>
          <h2 className="display" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 0.9, color: tk.text, margin: 0 }}>
            What I do
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p style={{ color: tk.textDim, fontSize: "0.875rem", lineHeight: 1.8, display: "flex", alignItems: isMobile ? "flex-start" : "flex-end", minHeight: isMobile ? undefined : "100%" }}>
            The offer for recruiters and for small-business clients is the same: WordPress that ships, integrations that work, and a site that stays fast after launch.
          </p>
        </FadeIn>
      </div>

      <div
        ref={grid}
        style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 20, marginBottom: isMobile ? 56 : 88 }}
      >
        {services.map((item) => (
          <article
            key={item.title}
            className="expertise-card hoverable"
            onMouseMove={tilt}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
            }}
            style={{ border: `1px solid ${tk.border}`, background: tk.bgAlt }}
          >
            <div className="expertise-media">
              <div className="expertise-figure display" style={{ color: tk.accent }}>
                {item.num}
              </div>
            </div>
            <div className="expertise-copy">
              <h3 className="display" style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)", lineHeight: 1, margin: "0 0 12px", color: tk.text }}>
                {item.title}
              </h3>
              <p style={{ color: tk.textDim, fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 28 }}>How a build runs</div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 16 : 20 }}>
        {processSteps.map((step) => (
          <FadeIn key={step.title}>
            <div style={{ borderTop: `1px solid ${tk.border}`, paddingTop: 20 }}>
              <div className="mono" style={{ color: tk.accent, fontSize: "0.65rem", letterSpacing: "0.2em", marginBottom: 10 }}>
                {step.num}
              </div>
              <div className="display" style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", color: tk.text, marginBottom: 8 }}>
                {step.title}
              </div>
              <p style={{ color: tk.textDim, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{step.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
