"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionConfig } from "@/lib/motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { useTheme } from "@/components/theme/ThemeProvider";
import useIsMobile from "@/hooks/useIsMobile";
import SiteShell from "@/components/SiteShell";
import Marquee from "@/components/Marquee";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Playgrounds from "@/components/sections/Playgrounds";
import Services from "@/components/sections/Services";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import HireBar from "@/components/HireBar";

export default function Portfolio() {
  const isMobile = useIsMobile();
  const { enabled } = useMotion();
  const { dark, tk } = useTheme();
  const px = isMobile ? "24px" : "64px";
  const py = isMobile ? "80px" : "160px";

  useEffect(() => {
    document.documentElement.style.setProperty("--marquee-duration", `${motionConfig.marqueeSeconds}s`);
  }, []);

  useEffect(() => {
    const tints = dark
      ? {
          hero: "#080808",
          about: "#0c0c0d",
          work: "#0a0a0a",
          services: "#0e0c0a",
          experience: "#090909",
          skills: "#080808",
          play: "#0b0b0c",
          contact: "#080808",
        }
      : {
          hero: "#f5f3ef",
          about: "#f1eee8",
          work: "#f3f0ea",
          services: "#efece6",
          experience: "#f4f1eb",
          skills: "#f5f3ef",
          play: "#f2efe9",
          contact: "#f3f0ea",
        };

    if (!enabled) {
      document.documentElement.style.setProperty("--page-bg", tints.hero);
      return;
    }

    const ctx = gsap.context(() => {
      Object.entries(tints).forEach(([id, color]) => {
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top 55%",
          onEnter: () => {
            gsap.to(document.documentElement, { "--page-bg": color, duration: 0.7, ease: "power2.out" });
          },
          onEnterBack: () => {
            gsap.to(document.documentElement, { "--page-bg": color, duration: 0.7, ease: "power2.out" });
          },
        });
      });
    });
    return () => ctx.revert();
  }, [dark, enabled]);

  return (
    <SiteShell>
      <Hero tk={tk} isMobile={isMobile} />
      <Stats tk={tk} isMobile={isMobile} />
      <About tk={tk} isMobile={isMobile} px={px} py={py} />
      <Work tk={tk} px={px} />
      <Marquee tk={tk} />
      <Services tk={tk} isMobile={isMobile} px={px} py={py} />
      <Experience tk={tk} isMobile={isMobile} px={px} py={py} />
      <Skills tk={tk} isMobile={isMobile} px={px} py={py} />
      <Playgrounds tk={tk} isMobile={isMobile} px={px} py={py} />
      <Faq tk={tk} isMobile={isMobile} px={px} py={py} />
      <Contact tk={tk} dark={dark} isMobile={isMobile} px={px} py={py} />
      <HireBar tk={tk} />
    </SiteShell>
  );
}
