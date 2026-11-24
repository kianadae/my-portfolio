"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { stats } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import type { Theme } from "@/lib/theme";

function Counter({ value, suffix, enabled }: { value: number; suffix: string; enabled: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    const obj = { n: 0 };
    el.textContent = `0${suffix}`;
    gsap.to(obj, {
      n: value,
      duration: motionConfig.duration.count,
      ease: motionConfig.ease.out,
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => {
        el.textContent = `${Math.floor(obj.n)}${suffix}`;
      },
      onComplete: () => {
        el.textContent = `${value}${suffix}`;
      },
    });
  }, { scope: ref, dependencies: [enabled, value, suffix] });

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {value}
      {suffix}
    </span>
  );
}

export default function Stats({ tk, isMobile }: { tk: Theme; isMobile: boolean }) {
  const { enabled } = useMotion();
  const dur = "0.45s";

  return (
    <section
      style={{
        borderTop: `1px solid ${tk.border}`,
        borderBottom: `1px solid ${tk.border}`,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            padding: isMobile ? "28px 24px" : "36px 64px",
            borderRight: !isMobile && i < stats.length - 1 ? `1px solid ${tk.border}` : "none",
            borderBottom: isMobile && i < stats.length - 1 ? `1px solid ${tk.border}` : "none",
            transition: `border-color ${dur}`,
          }}
        >
          <div className="display" style={{ fontSize: isMobile ? "2.5rem" : "3.5rem", lineHeight: 1, color: tk.accent }}>
            <Counter value={s.value} suffix={s.suffix} enabled={enabled} />
          </div>
          <div className="kicker" style={{ color: tk.textDimmer, fontSize: "0.65rem", letterSpacing: "0.15em", marginTop: 6 }}>
            {s.label}
          </div>
        </div>
      ))}
    </section>
  );
}
