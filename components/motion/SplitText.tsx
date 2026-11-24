"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "./MotionProvider";
import { motionConfig } from "@/lib/motion";

type Mode = "chars" | "words";

export default function SplitText({
  text,
  mode = "chars",
  as: Tag = "span",
  className,
  style,
  delay = 0,
  once = true,
}: {
  text: string
  mode?: Mode
  as?: "span" | "div" | "h1" | "p" | "h2"
  className?: string
  style?: React.CSSProperties
  delay?: number
  once?: boolean
}) {
  const ref = useRef<HTMLElement>(null);
  const { enabled } = useMotion();

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const units = root.querySelectorAll<HTMLElement>(".split-unit");
    if (!enabled) {
      gsap.set(units, { yPercent: 0, opacity: 1 });
      return;
    }
    gsap.fromTo(
      units,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: motionConfig.duration.base,
        ease: motionConfig.ease.out,
        delay,
        stagger: mode === "chars" ? motionConfig.stagger.chars : motionConfig.stagger.words,
      },
    );
  }, { scope: ref, dependencies: [enabled, delay, mode, once, text] });

  const pieces = mode === "chars" ? Array.from(text) : text.split(/(\s+)/);

  return (
    <Tag ref={ref as never} className={className} style={style} aria-label={text}>
      {pieces.map((piece, i) =>
        piece === " " || piece === "\n" ? (
          <span key={`${piece}-${i}`} aria-hidden="true">{piece === "\n" ? " " : "\u00A0"}</span>
        ) : (
          <span key={`${piece}-${i}`} className="split-mask" aria-hidden="true">
            <span className="split-unit">{piece}</span>
          </span>
        ),
      )}
    </Tag>
  );
}
