"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { faqs } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import FadeIn from "@/components/motion/FadeIn";
import type { Theme } from "@/lib/theme";

export default function Faq({
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
  const [open, setOpen] = useState(0);
  const list = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = list.current;
    if (!root) return;
    const panels = root.querySelectorAll<HTMLElement>(".faq-panel");
    const icons = root.querySelectorAll<HTMLElement>(".faq-icon");

    panels.forEach((panel, i) => {
      const isOpen = open === i;
      const icon = icons[i];
      const inner = panel.querySelector<HTMLElement>(".faq-panel-inner");
      const target = isOpen && inner ? inner.scrollHeight : 0;
      if (!enabled) {
        gsap.set(panel, { height: isOpen ? "auto" : 0 });
        if (icon) gsap.set(icon, { rotate: isOpen ? 45 : 0 });
        return;
      }
      gsap.to(panel, {
        height: target,
        duration: motionConfig.duration.fast,
        ease: motionConfig.ease.out,
        onComplete: () => {
          if (isOpen) gsap.set(panel, { height: "auto" });
        },
      });
      if (icon) {
        gsap.to(icon, {
          rotate: isOpen ? 45 : 0,
          duration: motionConfig.duration.fast,
          ease: motionConfig.ease.out,
        });
      }
    });
  }, { scope: list, dependencies: [open, enabled] });

  return (
    <section id="faq" style={{ padding: `${py} ${px}`, borderTop: `1px solid ${tk.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isMobile ? 24 : 64 }}>
        <FadeIn>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>FAQ</div>
          <h2 className="display" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 0.9, color: tk.text, margin: 0 }}>
            Before you write
          </h2>
        </FadeIn>
        <div ref={list}>
          {faqs.map((item, i) => {
            const on = open === i;
            const panelId = `faq-panel-${i}`;
            return (
              <div key={item.q} className="faq-row" style={{ borderColor: tk.border, color: tk.text }}>
                <button
                  type="button"
                  className="faq-item hoverable"
                  aria-expanded={on}
                  aria-controls={panelId}
                  onClick={() => setOpen(on ? -1 : i)}
                  style={{ borderColor: tk.border, color: tk.text }}
                >
                  <span className="display" style={{ fontSize: "clamp(1.15rem, 2vw, 1.55rem)", textAlign: "left" }}>
                    {item.q}
                  </span>
                  <span className="faq-icon mono" aria-hidden="true" style={{ color: tk.textDimmer }}>
                    +
                  </span>
                </button>
                <div id={panelId} className={`faq-panel${on ? " is-open" : ""}`} role="region">
                  <div className="faq-panel-inner">
                    <p style={{ color: tk.textDim, fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 18px", maxWidth: 560 }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
