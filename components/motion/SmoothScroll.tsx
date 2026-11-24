"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "./MotionProvider";

function LenisGsapBridge() {
  const lenis = useLenis();
  const { setLenis } = useMotion();

  useEffect(() => {
    setLenis(lenis ?? null);
    return () => setLenis(null);
  }, [lenis, setLenis]);

  useEffect(() => {
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}

/** Mounted once from the root layout. Drives Lenis from the GSAP ticker. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const { enabled } = useMotion();

  if (!enabled) return children;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: motionConfig.lenisLerp,
        smoothWheel: true,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
