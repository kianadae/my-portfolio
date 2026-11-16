"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";
import FadeIn from "@/components/motion/FadeIn";
import type { Theme } from "@/lib/theme";

export default function Faq({
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
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" style={{ padding: `${py} ${px}`, borderTop: `1px solid ${tk.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: isMobile ? 24 : 64 }}>
        <FadeIn>
          <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>FAQ</div>
          <h2 className="display" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)", lineHeight: 0.9, color: tk.text, margin: 0 }}>
            Before you write
          </h2>
        </FadeIn>
        <div>
          {faqs.map((item, i) => {
            const on = open === i;
            return (
              <button
                key={item.q}
                type="button"
                className="faq-item hoverable"
                aria-expanded={on}
                onClick={() => setOpen(on ? -1 : i)}
                style={{ borderColor: tk.border, color: tk.text }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
                  <span className="display" style={{ fontSize: "clamp(1.15rem, 2vw, 1.55rem)", textAlign: "left" }}>
                    {item.q}
                  </span>
                  <span className="mono" style={{ color: tk.textDimmer, fontSize: "0.7rem" }}>{on ? "–" : "+"}</span>
                </div>
                {on ? (
                  <p style={{ color: tk.textDim, fontSize: "0.88rem", lineHeight: 1.7, margin: "12px 0 0", textAlign: "left", maxWidth: 560 }}>
                    {item.a}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
