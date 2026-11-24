"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "./MotionProvider";

export default function FadeIn({
  children,
  y,
  delay = 0,
  as: Tag = "div",
  className,
  style,
}: {
  children: ReactNode
  y?: number
  delay?: number
  as?: "div" | "p" | "span"
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotion();
  const dist = y ?? motionConfig.revealY;

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      el,
      { opacity: 0, y: dist },
      {
        opacity: 1,
        y: 0,
        duration: motionConfig.duration.base,
        ease: motionConfig.ease.out,
        delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );
  }, { scope: ref, dependencies: [enabled, dist, delay] });

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
