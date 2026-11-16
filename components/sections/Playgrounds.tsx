"use client";

import Link from "next/link";
import type { Theme } from "@/lib/theme";
import FadeIn from "@/components/motion/FadeIn";

const teasers = [
  { href: "/playground#scramble", num: "01", title: "Scramble", note: "Decode type on click." },
  { href: "/playground#magnet", num: "02", title: "Magnet field", note: "A grid that leans toward you." },
  { href: "/playground#type", num: "03", title: "Kinetic type", note: "Letters with a magnetic pull." },
  { href: "/playground#orbit", num: "04", title: "Brand orbit", note: "Drag the 3D project ring." },
  { href: "/playground#lens", num: "05", title: "Lens", note: "A cursor that inverts the type." },
];

export default function Playgrounds({
  tk,
  isMobile,
  px,
  py,
}: {
  tk: Theme
  isMobile: boolean
  px: string
  py: string
}) {
  return (
    <section id="play" style={{ padding: `${py} ${px}`, borderTop: `1px solid ${tk.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isMobile ? 24 : 64, marginBottom: isMobile ? 40 : 64 }}>
        <FadeIn>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>Labs</div>
          <h2 className="display" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 0.9, color: tk.text, margin: 0 }}>
            Playgrounds
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p style={{ color: tk.textDim, fontSize: "0.875rem", lineHeight: 1.8, display: "flex", alignItems: isMobile ? "flex-start" : "flex-end", minHeight: isMobile ? undefined : "100%" }}>
            Interactive studies for motion, type, and 3D. Open the lab to play with them.
          </p>
        </FadeIn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5, 1fr)", gap: 3 }}>
        {teasers.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="hoverable play-card"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              minHeight: isMobile ? 140 : 180,
              padding: isMobile ? 20 : 28,
              border: `1px solid ${tk.border}`,
              textDecoration: "none",
              color: tk.text,
            }}
          >
            <div className="mono" style={{ color: tk.textFaint, fontSize: "0.62rem", letterSpacing: "0.2em", marginBottom: 12 }}>
              {item.num}
            </div>
            <div className="display" style={{ fontSize: "clamp(1.3rem, 2vw, 1.9rem)", lineHeight: 1, marginBottom: 8 }}>
              {item.title}
            </div>
            <div style={{ color: tk.textDimmer, fontSize: "0.75rem", lineHeight: 1.5 }}>{item.note}</div>
          </Link>
        ))}
      </div>

      <Link href="/playground" className="magnetic-link hoverable" style={{ color: tk.textDim, marginTop: 36, display: "inline-flex" }}>
        Enter the lab
      </Link>
    </section>
  );
}
