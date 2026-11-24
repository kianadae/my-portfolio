"use client";

import { useRef, type MouseEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { skillGroups } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import FadeIn from "@/components/motion/FadeIn";
import type { Theme } from "@/lib/theme";

function Chip({
  label,
  tk,
  enabled,
  isTouch,
}: {
  label: string
  tk: Theme
  enabled: boolean
  isTouch: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const magnet = (e: MouseEvent<HTMLButtonElement>) => {
    if (!enabled || isTouch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.22;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  return (
    <button
      type="button"
      ref={ref}
      className="skill-pill hoverable"
      onMouseMove={magnet}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
      }}
      style={{
        border: `1px solid ${tk.border}`,
        color: tk.textDim,
        background: "transparent",
      }}
    >
      <span>{label}</span>
    </button>
  );
}

export default function Skills({
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
  const root = useRef<HTMLElement>(null);
  const groups = Object.entries(skillGroups);

  useGSAP(() => {
    const el = root.current;
    if (!el) return;
    const chips = el.querySelectorAll<HTMLElement>(".skill-pill");
    if (!enabled) {
      gsap.set(chips, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      chips,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: motionConfig.duration.base,
        ease: motionConfig.ease.out,
        stagger: motionConfig.stagger.chips,
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
        onComplete: () => {
          if (isTouch) return;
          gsap.to(chips, {
            y: -5,
            duration: 2.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: { each: 0.12, from: "random" },
          });
        },
      },
    );
  }, { scope: root, dependencies: [enabled, isTouch] });

  return (
    <section
      id="skills"
      ref={root}
      style={{
        padding: `${py} ${px}`,
        borderTop: `1px solid ${tk.border}`,
        ["--skill-hover-bg" as string]: tk.skillHoverBg,
        ["--skill-hover-text" as string]: tk.skillHoverText,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isMobile ? 24 : 64, marginBottom: isMobile ? 40 : 80 }}>
        <FadeIn>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>Expertise</div>
          <h2 className="display" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 0.9, color: tk.text, margin: 0 }}>
            Skills &<br />Tools
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p style={{ color: tk.textDim, fontSize: "0.875rem", lineHeight: 1.8, display: "flex", alignItems: isMobile ? "flex-start" : "flex-end", minHeight: isMobile ? undefined : "100%" }}>
            The stack I use daily to ship WordPress sites, plus the front-end tools behind this portfolio.
          </p>
        </FadeIn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {groups.map(([group, skills], i) => {
          const loop = enabled ? [...skills, ...skills] : skills;
          return (
            <div key={group}>
              <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>{group}</div>
              {enabled ? (
                <div className="marquee" style={{ border: `1px solid ${tk.border}`, padding: "14px 0" }}>
                  <div className={`marquee-track${i % 2 ? " reverse" : ""}`} style={{ gap: 8, padding: "0 8px" }}>
                    {loop.map((skill, n) => (
                      <Chip key={`${skill}-${n}`} label={skill} tk={tk} enabled={enabled} isTouch={isTouch} />
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skills.map((skill) => (
                    <Chip key={skill} label={skill} tk={tk} enabled={enabled} isTouch={isTouch} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
