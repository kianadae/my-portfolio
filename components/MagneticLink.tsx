"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "./motion/MotionProvider";

export default function MagneticLink({
  href,
  children,
  target,
  dark,
  arrow,
}: {
  href: string
  children: ReactNode
  target?: string
  dark: boolean
  arrow?: boolean
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { enabled, isTouch } = useMotion();

  const handleMouse = (e: MouseEvent) => {
    if (!enabled || isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * motionConfig.magnetic;
    const y = (e.clientY - rect.top - rect.height / 2) * motionConfig.magnetic;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
      }}
      className="magnetic-link hoverable"
      style={{
        color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
        fontSize: "0.9rem",
        letterSpacing: "0.06em",
        transition: "color 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
      {arrow ? <span className="link-arrow" aria-hidden="true">↗</span> : null}
    </a>
  );
}
