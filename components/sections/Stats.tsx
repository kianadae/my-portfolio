"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { stats } from "@/lib/content";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import type { Theme } from "@/lib/theme";

function Counter({ value, suffix, enabled }: { value: number; suffix: string; enabled: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    const obj = { n: 0 };
    el.textContent = `0${suffix}`;
    const ctx = gsap.context(() => {
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
    }, el);
    return () => ctx.revert();
  }, [enabled, value, suffix]);

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
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            padding: isMobile ? "28px 24px" : "36px 64px",
            borderRight: (isMobile ? i % 2 !== 1 : i < 3) ? `1px solid ${tk.border}` : "none",
            borderBottom: isMobile && i < 2 ? `1px solid ${tk.border}` : "none",
            transition: `border-color ${dur}`,
          }}
        >
          <div className="display" style={{ fontSize: isMobile ? "2.5rem" : "3.5rem", lineHeight: 1, color: tk.text }}>
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
