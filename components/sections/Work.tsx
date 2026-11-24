"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { projects, type Project } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import type { Theme } from "@/lib/theme";
import useIsMobile from "@/hooks/useIsMobile";
import LogoPlate from "@/components/LogoPlate";

const COUNT = projects.length;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ProjectMeta({ item, tk }: { item: Project; tk: Theme }) {
  return (
    <div className="project-detail" style={{ padding: 0 }}>
      <p style={{ color: tk.textDim, fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 520, margin: "0 0 12px" }}>
        {item.summary}
      </p>
      <div className="mono" style={{ color: tk.accent, fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>
        {item.role}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {item.tech.map((t) => (
          <span key={t} className="tech-chip">{t}</span>
        ))}
      </div>
      <p style={{ color: tk.text, fontSize: "0.82rem", lineHeight: 1.6, margin: "0 0 14px" }}>{item.result}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {item.liveUrl ? (
          <a className="btn btn-ghost hoverable" href={item.liveUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "10px 14px", color: tk.accent, borderColor: tk.accent }}>
            Live site
          </a>
        ) : null}
        {item.featured && item.caseStudy ? (
          <Link className="btn btn-ghost hoverable" href={`/work/${item.slug}`} style={{ padding: "10px 14px", color: tk.accent, borderColor: tk.accent }}>
            Case study
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default function Work({ tk, px }: { tk: Theme; px: string }) {
  const isMobile = useIsMobile();
  const { enabled } = useMotion();
  const stackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const root = stackRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".work-stack-item"));
    if (!items.length) return;

    if (!enabled) {
      gsap.set(root.querySelectorAll(".work-stack-img"), { scale: 1 });
      gsap.set(root.querySelectorAll(".work-stack-card"), { scale: 1, opacity: 1 });
      return;
    }

    items.forEach((item, i) => {
      const img = item.querySelector<HTMLElement>(".work-stack-img");
      const card = item.querySelector<HTMLElement>(".work-stack-card");
      if (img) {
        gsap.fromTo(
          img,
          { scale: motionConfig.workImageFromScale },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top 82%",
              end: "top 28%",
              scrub: 0.5,
            },
          },
        );
      }

      if (!isMobile && card && i < items.length - 1) {
        gsap.to(card, {
          scale: 0.94,
          opacity: 0.62,
          ease: "none",
          scrollTrigger: {
            trigger: items[i + 1],
            start: "top bottom",
            end: "top 96px",
            scrub: 0.4,
          },
        });
      }

      ScrollTrigger.create({
        trigger: item,
        start: "top 48%",
        end: "bottom 48%",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      });
    });
  }, { scope: stackRef, dependencies: [enabled, isMobile] });

  return (
    <section id="work" style={{ padding: `80px ${px} 40px` }}>
      <div
        style={{
          display: "flex",
          alignItems: isMobile ? "flex-start" : "flex-end",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: isMobile ? 40 : 48,
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
        <div className="mono work-progress" style={{ color: tk.textDimmer, fontSize: "0.7rem", letterSpacing: "0.2em" }}>
          {pad(active + 1)} / {pad(COUNT)}
          <span style={{ display: "block", marginTop: 6, color: tk.text }}>{projects[active].title}</span>
        </div>
      </div>

      <div ref={stackRef} className="work-stack">
        {projects.map((item, i) => (
          <article
            key={item.slug}
            className="work-stack-item"
            style={{ zIndex: i + 1, top: isMobile ? 72 : 96 }}
          >
            <div
              className="work-stack-card"
              style={{
                background: tk.bgAlt,
                border: `1px solid ${tk.border}`,
                gridTemplateColumns: isMobile ? "1fr" : "1.05fr 1fr",
              }}
            >
              <div className="work-stack-media" style={{ background: item.color }}>
                <div className="work-stack-img">
                  <LogoPlate
                    src={item.logo}
                    plate={item.plate}
                    alt={item.alt}
                    sizes="(max-width: 767px) 90vw, 48vw"
                    style={{ width: "100%", height: "100%", minHeight: isMobile ? 180 : 280 }}
                  />
                </div>
              </div>
              <div className="work-stack-copy">
                <div className="mono" style={{ color: tk.textDimmer, fontSize: "0.68rem", letterSpacing: "0.18em", marginBottom: 12 }}>
                  {pad(i + 1)} / {pad(COUNT)}
                </div>
                <h3 className="display" style={{ fontSize: "clamp(2rem, 4vw, 4.2rem)", lineHeight: 0.9, margin: "0 0 16px", color: tk.text }}>
                  {item.title}
                </h3>
                <ProjectMeta item={item} tk={tk} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
