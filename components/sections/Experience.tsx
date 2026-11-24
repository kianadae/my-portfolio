"use client";

import { useRef, type MouseEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { education, jobs, milestones } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import FadeIn from "@/components/motion/FadeIn";
import type { Theme } from "@/lib/theme";

export default function Experience({
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
  const timeline = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const milestonesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = timeline.current;
    const lineEl = line.current;
    if (!root || !lineEl) return;
    if (!enabled) {
      gsap.set(lineEl, { scaleY: 1 });
      root.querySelectorAll(".timeline-item").forEach((el) => el.classList.add("is-active"));
      return;
    }
    const items = root.querySelectorAll<HTMLElement>(".timeline-item");
    gsap.fromTo(
      lineEl,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "bottom 30%",
          scrub: true,
        },
      },
    );
    items.forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => item.classList.toggle("is-active", self.isActive),
      });
      gsap.fromTo(
        item,
        { opacity: 0, y: motionConfig.revealY },
        {
          opacity: 1,
          y: 0,
          duration: motionConfig.duration.base,
          ease: motionConfig.ease.out,
          scrollTrigger: { trigger: item, start: "top 82%", once: true },
        },
      );
    });
  }, { scope: timeline, dependencies: [enabled] });

  useGSAP(() => {
    const root = milestonesRef.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>(".milestone-card");
    if (!enabled) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      cards,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: motionConfig.duration.base,
        ease: motionConfig.ease.out,
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      },
    );
  }, { scope: milestonesRef, dependencies: [enabled] });

  const tilt = (e: MouseEvent<HTMLDivElement>) => {
    if (!enabled || isTouch || isMobile) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  return (
    <section id="experience" style={{ padding: `${py} ${px}`, borderTop: `1px solid ${tk.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isMobile ? 24 : 64, marginBottom: isMobile ? 32 : 48 }}>
        <FadeIn>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>Career</div>
          <h2 className="display" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 0.9, color: tk.text, margin: 0 }}>
            Experience
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p style={{ color: tk.textDim, fontSize: "0.875rem", lineHeight: 1.8, display: "flex", alignItems: isMobile ? "flex-start" : "flex-end", minHeight: isMobile ? undefined : "100%" }}>
            From shipping 60+ WordPress sites in production to Junior Developer at The Web Guys NZ.
          </p>
        </FadeIn>
      </div>

      <div ref={timeline} className="timeline" style={{ color: tk.text }}>
        <div ref={line} className="timeline-line" />
        {jobs.map((job) => (
          <div key={`${job.company}-${job.role}`} className="timeline-item" style={{ paddingTop: 28, paddingBottom: 28, borderBottom: `1px solid ${tk.border}` }}>
            <span className="timeline-dot" aria-hidden="true" />
            <div className="mono" style={{ color: tk.textDimmer, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8 }}>
              {job.dates}
            </div>
            <div className="display" style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)", lineHeight: 1, letterSpacing: "0.02em", color: tk.text, marginBottom: 8 }}>
              {job.company}
            </div>
            <div className="kicker" style={{ color: tk.textDimmer, fontSize: "0.68rem", letterSpacing: "0.16em", marginBottom: 10 }}>
              {job.role} · {job.place}
            </div>
            <p style={{ color: tk.textDim, fontSize: "0.88rem", lineHeight: 1.7, maxWidth: 560 }}>{job.note}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 48, marginTop: isMobile ? 48 : 72 }}>
        {education.map((ed) => (
          <FadeIn key={ed.school}>
            <div style={{ borderTop: `1px solid ${tk.border}`, paddingTop: 24 }}>
              <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 10 }}>Education</div>
              <div className="display" style={{ fontSize: "clamp(1.3rem, 2vw, 1.8rem)", lineHeight: 1.05, color: tk.text, marginBottom: 8 }}>
                {ed.school}
              </div>
              <div style={{ color: tk.textDim, fontSize: "0.85rem", lineHeight: 1.6 }}>{ed.cred}</div>
              <div className="mono" style={{ color: tk.textDimmer, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8 }}>
                {ed.when}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div
        ref={milestonesRef}
        style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 16 : 20, marginTop: isMobile ? 56 : 88 }}
      >
        {milestones.map((s, i) => (
          <div
            key={s.year}
            className="milestone-card hoverable"
            onMouseMove={tilt}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
            }}
            style={{
              border: `1px solid ${tk.border}`,
              padding: isMobile ? "28px 24px" : "36px 28px",
              background: tk.bgAlt,
            }}
          >
            <div className="mono" style={{ color: tk.textFaint, fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 16 }}>
              {s.year} — 0{i + 1} / 03
            </div>
            <div className="display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 0.95, color: tk.text, marginBottom: 12 }}>
              {s.title}
            </div>
            <p style={{ color: tk.textDim, fontSize: "0.85rem", lineHeight: 1.7 }}>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
