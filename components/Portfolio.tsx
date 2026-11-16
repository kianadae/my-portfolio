"use client";

import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getTheme } from "@/lib/theme";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import useIsMobile from "@/hooks/useIsMobile";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Marquee from "@/components/Marquee";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const isMobile = useIsMobile();
  const { enabled } = useMotion();
  const tk = useMemo(() => getTheme(dark), [dark]);
  const px = isMobile ? "24px" : "64px";
  const py = isMobile ? "80px" : "160px";

  useEffect(() => {
    const root = document.documentElement;
    gsap.killTweensOf(root);
    root.style.setProperty("--page-bg", tk.bg);
    root.style.setProperty("--page-fg", tk.text);
    root.style.setProperty("--accent", tk.accent);
    root.style.setProperty("--marquee-duration", `${motionConfig.marqueeSeconds}s`);
  }, [tk]);

  useEffect(() => {
    const tints = dark
      ? ["#080808", "#0c0c0d", "#0a0a0a", "#0e0c0a", "#090909", "#080808"]
      : ["#f5f3ef", "#f1eee8", "#f3f0ea", "#efece6", "#f4f1eb", "#f5f3ef"];
    const ids = ["hero", "about", "work", "experience", "skills", "contact"];

    if (!enabled) {
      document.documentElement.style.setProperty("--page-bg", tints[0]);
      return;
    }

    const ctx = gsap.context(() => {
      ids.forEach((id, i) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 55%",
          onEnter: () => {
            gsap.to(document.documentElement, { "--page-bg": tints[i], duration: 0.7, ease: "power2.out" });
          },
          onEnterBack: () => {
            gsap.to(document.documentElement, { "--page-bg": tints[i], duration: 0.7, ease: "power2.out" });
          },
        });
      });
    });
    return () => ctx.revert();
  }, [dark, enabled]);

  return (
    <>
      <div className="noise" aria-hidden="true" />
      {!isMobile ? <Cursor dark={dark} /> : null}
      <Nav tk={tk} dark={dark} onToggleTheme={() => setDark((d) => !d)} isMobile={isMobile} />

      <div
        style={{
          background: "var(--page-bg)",
          color: tk.text,
          minHeight: "100vh",
          fontFamily: "var(--font-dm-mono), monospace",
          transition: "color 0.45s",
        }}
      >
        <Hero tk={tk} isMobile={isMobile} />
        <Stats tk={tk} isMobile={isMobile} />
        <About tk={tk} isMobile={isMobile} px={px} py={py} />
        <Work tk={tk} px={px} />
        <Marquee tk={tk} />
        <Experience tk={tk} isMobile={isMobile} px={px} py={py} />
        <Skills tk={tk} isMobile={isMobile} px={px} py={py} />
        <Contact tk={tk} dark={dark} isMobile={isMobile} px={px} py={py} />
      </div>
    </>
  );
}
