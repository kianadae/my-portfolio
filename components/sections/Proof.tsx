"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { proofStatements } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import type { Theme } from "@/lib/theme";

export default function Proof({
  tk,
  isMobile,
  px,
}: {
  tk: Theme
  isMobile: boolean
  px: string
}) {
  const { enabled } = useMotion();
  const section = useRef<HTMLElement>(null);

  useGSAP(() => {
    const root = section.current;
    if (!root) return;
    const lines = root.querySelectorAll<HTMLElement>(".proof-line");
    if (!lines.length) return;

    if (!enabled || isMobile) {
      gsap.set(lines, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(lines, { opacity: 0, y: 48 });
    gsap.set(lines[0], { opacity: 1, y: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 88px",
        end: motionConfig.pin.proof,
        pin: true,
        pinSpacing: true,
        scrub: 0.65,
        anticipatePin: 1,
      },
    });

    lines.forEach((el, i) => {
      if (i === 0) return;
      const prev = lines[i - 1];
      tl.to(prev, { opacity: 0, y: -40, ease: "none", duration: 1 }, i);
      tl.fromTo(el, { opacity: 0, y: 48 }, { opacity: 1, y: 0, ease: "none", duration: 1 }, i + 0.12);
    });
  }, { scope: section, dependencies: [enabled, isMobile] });

  return (
    <section
      id="proof"
      ref={section}
      style={{
        padding: isMobile ? `48px ${px} 80px` : `0 ${px}`,
        borderTop: `1px solid ${tk.border}`,
      }}
    >
      <div className="proof-stage" style={{ minHeight: isMobile ? undefined : "100svh" }}>
        <div className="kicker" style={{ color: tk.textDimmer, marginBottom: isMobile ? 28 : 40 }}>
          Proof
        </div>
        <div className="proof-lines">
          {proofStatements.map((item) => (
            <p
              key={item.kicker}
              className="proof-line display"
              style={{ color: tk.text }}
            >
              <span className="mono proof-kicker" style={{ color: tk.accent }}>
                {item.kicker}
              </span>
              {item.line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
