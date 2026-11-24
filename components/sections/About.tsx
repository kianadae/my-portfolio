"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/motion/MotionProvider";
import { motionConfig } from "@/lib/motion";
import type { Theme } from "@/lib/theme";

const LEAD = "WordPress developer with 5+ years shipping sites from brief to launch —";
const ITALIC = "custom builds, CRM and payment integrations, and QA across devices.";
const BODY =
  "Currently Junior Website Developer at The Web Guys NZ in Parnell. Previously shipped 60+ WordPress sites at Sites at Scale, cutting load times by up to 30%. PGDip in Information Technology, Auckland Institute of Studies.";

function splitWords(text: string) {
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

export default function About({
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
  const { enabled } = useMotion();
  const section = useRef<HTMLElement>(null);
  const dur = "0.45s";

  useGSAP(() => {
    const root = section.current;
    if (!root) return;
    const units = root.querySelectorAll<HTMLElement>(".about-word");
    if (!enabled) {
      gsap.set(units, { opacity: 1 });
      return;
    }
    gsap.fromTo(
      units,
      { opacity: 0.2 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger: root,
          start: "top 88px",
          end: isMobile ? motionConfig.pin.aboutMobile : motionConfig.pin.about,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      },
    );
  }, { scope: section, dependencies: [enabled, isMobile] });

  return (
    <section id="about" ref={section} style={{ padding: `${py} ${px}`, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 3fr", gap: isMobile ? 24 : 64 }}>
      <div>
        <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>About</div>
        <div style={{ width: 32, height: 1, background: tk.border }} />
      </div>
      <div>
        <p className="serif" style={{ fontSize: "clamp(1.3rem, 3vw, 2.4rem)", lineHeight: 1.4, color: tk.text, fontWeight: 400 }}>
          {splitWords(LEAD).map((w, i) =>
            w.trim() ? (
              <span key={`l-${i}`} className="about-word" style={{ display: "inline" }}>{w}</span>
            ) : (
              <span key={`ls-${i}`}>{w}</span>
            ),
          )}{" "}
          <em style={{ color: tk.accent, fontStyle: "italic", transition: `color ${dur}` }}>
            {splitWords(ITALIC).map((w, i) =>
              w.trim() ? (
                <span key={`i-${i}`} className="about-word" style={{ display: "inline" }}>{w}</span>
              ) : (
                <span key={`is-${i}`}>{w}</span>
              ),
            )}
          </em>
        </p>
        <p style={{ color: tk.textDim, fontSize: "0.95rem", lineHeight: 1.8, marginTop: 28, maxWidth: 640 }}>
          {BODY}
        </p>
      </div>
    </section>
  );
}
