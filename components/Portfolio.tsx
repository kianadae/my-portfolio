"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import useIsMobile from "@/hooks/useIsMobile";
import SiteShell from "@/components/SiteShell";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Work from "@/components/sections/Work";
import Proof from "@/components/sections/Proof";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import Playgrounds from "@/components/sections/Playgrounds";
import Services from "@/components/sections/Services";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import HireBar from "@/components/HireBar";

export default function Portfolio() {
  const isMobile = useIsMobile();
  const { dark, tk } = useTheme();
  const px = isMobile ? "20px" : "64px";
  const py = isMobile ? "72px" : "160px";

  return (
    <SiteShell>
      <Hero tk={tk} isMobile={isMobile} />
      <Stats tk={tk} isMobile={isMobile} />
      <About tk={tk} isMobile={isMobile} px={px} py={py} />
      <Work tk={tk} px={px} />
      <Proof tk={tk} isMobile={isMobile} px={px} />
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
