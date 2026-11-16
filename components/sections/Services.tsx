"use client";

import { services, processSteps } from "@/lib/content";
import FadeIn from "@/components/motion/FadeIn";
import type { Theme } from "@/lib/theme";

export default function Services({
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
    <section id="services" style={{ padding: `${py} ${px}`, borderTop: `1px solid ${tk.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isMobile ? 24 : 64, marginBottom: isMobile ? 40 : 64 }}>
        <FadeIn>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>For teams & businesses</div>
          <h2 className="display" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 0.9, color: tk.text, margin: 0 }}>
            What I do
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p style={{ color: tk.textDim, fontSize: "0.875rem", lineHeight: 1.8, display: "flex", alignItems: isMobile ? "flex-start" : "flex-end", minHeight: isMobile ? undefined : "100%" }}>
            The offer for recruiters and for small-business clients is the same: WordPress that ships, integrations that work, and a site that stays fast after launch.
          </p>
        </FadeIn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 3, marginBottom: isMobile ? 56 : 88 }}>
        {services.map((item) => (
          <FadeIn key={item.title}>
            <article style={{ border: `1px solid ${tk.border}`, padding: isMobile ? "28px 22px" : "36px 32px", height: "100%" }}>
              <div className="mono" style={{ color: tk.textFaint, fontSize: "0.62rem", letterSpacing: "0.22em", marginBottom: 16 }}>
                {item.num}
              </div>
              <h3 className="display" style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)", lineHeight: 1, margin: "0 0 12px", color: tk.text }}>
                {item.title}
              </h3>
              <p style={{ color: tk.textDim, fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
            </article>
          </FadeIn>
        ))}
      </div>

      <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 28 }}>How a build runs</div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? 16 : 20 }}>
        {processSteps.map((step) => (
          <FadeIn key={step.title}>
            <div style={{ borderTop: `1px solid ${tk.border}`, paddingTop: 20 }}>
              <div className="mono" style={{ color: tk.accent, fontSize: "0.65rem", letterSpacing: "0.2em", marginBottom: 10 }}>
                {step.num}
              </div>
              <div className="display" style={{ fontSize: "clamp(1.5rem, 2vw, 2rem)", color: tk.text, marginBottom: 8 }}>
                {step.title}
              </div>
              <p style={{ color: tk.textDim, fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{step.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
