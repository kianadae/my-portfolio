"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useMotion } from "@/components/motion/MotionProvider";
import useIsMobile from "@/hooks/useIsMobile";
import ScrambleLab from "./ScrambleLab";
import MagnetLab from "./MagnetLab";
import TypeLab from "./TypeLab";
import OrbitLab from "./OrbitLab";
import LensLab from "./LensLab";

const labs = [
  { id: "scramble", kicker: "01", title: "Scramble", note: "Letters decode in place. Click the big word, pick a preset, or type your own — the same load trick, slowed down so you can see it." },
  { id: "magnet", kicker: "02", title: "Magnet field", note: "A denser grid. Pointer pull scales the nearest dots. Works with mouse or a finger." },
  { id: "type", kicker: "03", title: "Kinetic type", note: "Each letter is magnetic. Hover to pull, click to scatter, then they snap home." },
  { id: "orbit", kicker: "04", title: "Brand orbit", note: "The Work ring, under your control. Drag, scroll, arrows, or let it auto-rotate." },
  { id: "lens", kicker: "05", title: "Lens", note: "A cursor spotlight that inverts whatever sits underneath. Move around the type." },
] as const;

export default function PlaygroundPage() {
  const { tk } = useTheme();
  const { scrollTo } = useMotion();
  const isMobile = useIsMobile();
  const px = isMobile ? "24px" : "64px";
  const [active, setActive] = useState(labs[0].id);

  useEffect(() => {
    const jump = (immediate = false) => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      scrollTo(`#${id}`, { immediate });
      setActive(id);
    };
    jump(true);
    const onHash = () => jump(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [scrollTo]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: 0.01 },
    );
    labs.forEach((lab) => {
      const el = document.getElementById(lab.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const i = Number(e.key) - 1;
      if (i >= 0 && i < labs.length) {
        const id = labs[i].id;
        setActive(id);
        scrollTo(`#${id}`);
        history.replaceState(null, "", `#${id}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollTo]);

  return (
    <SiteShell>
      <section style={{ padding: isMobile ? `120px ${px} 28px` : `140px ${px} 36px` }}>
        <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 16 }}>Labs</div>
        <h1 className="display" style={{ fontSize: "clamp(3.2rem, 10vw, 9rem)", lineHeight: 0.88, margin: 0, color: tk.text }}>
          Playgrounds
        </h1>
        <p style={{ color: tk.textDim, fontSize: "0.95rem", lineHeight: 1.8, maxWidth: 560, marginTop: 24 }}>
          Interactive studies for motion, type, and 3D. Nothing here ships a client site — it is how I test feel, easing, and interaction before it lands on a real build.
        </p>
        <p className="mono" style={{ color: tk.textFaint, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 16 }}>
          Keys 1–5 jump labs{isMobile ? "" : " · arrows spin the orbit"}
        </p>
        <Link href="/" className="magnetic-link hoverable" style={{ color: tk.textDim, marginTop: 24, display: "inline-flex" }}>
          Back to portfolio
        </Link>
      </section>

      <div style={{ padding: `0 ${px} 120px` }}>
        <div className="lab-index" style={{ color: tk.text }}>
          {labs.map((lab) => (
            <a
              key={lab.id}
              href={`#${lab.id}`}
              className={active === lab.id ? "is-active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActive(lab.id);
                scrollTo(`#${lab.id}`);
                history.replaceState(null, "", `#${lab.id}`);
              }}
            >
              {lab.kicker} {lab.title}
            </a>
          ))}
        </div>

        <div style={{ display: "grid", gap: isMobile ? 20 : 28 }}>
        {labs.map((lab) => (
          <article
            key={lab.id}
            id={lab.id}
            style={{
              border: `1px solid ${tk.border}`,
              background: tk.bgAlt,
              padding: isMobile ? "28px 22px" : "40px 36px",
              scrollMarginTop: 140,
              overflow: "hidden",
            }}
          >
            <div className="mono" style={{ color: tk.textFaint, fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 10 }}>
              {lab.kicker} / {lab.title}
            </div>
            <h2 className="display" style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", margin: "0 0 10px", color: tk.text }}>
              {lab.title}
            </h2>
            <p style={{ color: tk.textDim, fontSize: "0.88rem", lineHeight: 1.7, maxWidth: 620, marginBottom: 28 }}>
              {lab.note}
            </p>
            {lab.id === "scramble" ? <ScrambleLab tk={tk} /> : null}
            {lab.id === "magnet" ? <MagnetLab tk={tk} isMobile={isMobile} /> : null}
            {lab.id === "type" ? <TypeLab tk={tk} /> : null}
            {lab.id === "orbit" ? <OrbitLab tk={tk} isMobile={isMobile} /> : null}
            {lab.id === "lens" ? <LensLab tk={tk} /> : null}
          </article>
        ))}
        </div>
      </div>
    </SiteShell>
  );
}
