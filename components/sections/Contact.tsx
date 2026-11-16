"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import SplitText from "@/components/motion/SplitText";
import FadeIn from "@/components/motion/FadeIn";
import MagneticLink from "@/components/MagneticLink";
import { useMotion } from "@/components/motion/MotionProvider";
import { BEHANCE, CV, EMAIL, LINKEDIN, PHONE, PHONE_LABEL } from "@/lib/content";
import type { Theme } from "@/lib/theme";

export default function Contact({
  tk,
  dark,
  isMobile,
  px,
  py,
}: {
  tk: Theme
  dark: boolean
  isMobile: boolean
  px: string
  py: string
}) {
  const { scrollTo, enabled, isTouch } = useMotion();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const magnet = (e: MouseEvent<HTMLButtonElement>) => {
    if (!enabled || isTouch) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.22;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  return (
    <section id="contact" style={{ padding: `${py} ${px}`, borderTop: `1px solid ${tk.border}` }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: isMobile ? 48 : 64 }}>
        <div>
          <FadeIn>
            <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 24 }}>Get in touch</div>
          </FadeIn>
          <h2 className="display" style={{ fontSize: "clamp(3rem, 10vw, 10rem)", lineHeight: 0.88, letterSpacing: "-0.01em", margin: "0 0 32px", color: tk.text }}>
            <SplitText text="Let's" mode="chars" as="span" className="display" style={{ display: "block" }} />
            <SplitText
              text="Connect"
              mode="chars"
              as="span"
              delay={0.12}
              className="display"
              style={{ display: "block", color: tk.connectDim }}
            />
          </h2>
          <FadeIn delay={0.1}>
            <p style={{ color: tk.textDim, fontSize: "0.9rem", lineHeight: 1.8, maxWidth: 440, marginBottom: 40 }}>
              Open to WordPress and web development roles in Auckland, and to freelance builds. Happy to talk about how I can help your team.
            </p>
          </FadeIn>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start" }}>
            <MagneticLink href={`mailto:${EMAIL}`} dark={dark} arrow>
              {EMAIL}
            </MagneticLink>
            <button
              type="button"
              className="copy-btn hoverable"
              onClick={copy}
              onMouseMove={magnet}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0px, 0px)";
              }}
              style={{ color: tk.textDim, borderColor: tk.border }}
            >
              Copy email
            </button>
            <MagneticLink href={`tel:${PHONE}`} dark={dark}>{PHONE_LABEL}</MagneticLink>
            <MagneticLink href={LINKEDIN} target="_blank" dark={dark}>
              LinkedIn — christian-ada
            </MagneticLink>
            <MagneticLink href={BEHANCE} target="_blank" dark={dark}>
              Behance — christian-ada
            </MagneticLink>
            <MagneticLink href={CV} target="_blank" dark={dark}>
              Download CV
            </MagneticLink>
          </div>
        </div>

        <FadeIn delay={0.15}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: isMobile ? "flex-start" : "flex-end", height: "100%" }}>
            <Image
              src="/logo.png"
              alt=""
              width={120}
              height={40}
              style={{ height: 40, width: "auto", filter: tk.logoFilter, opacity: 0.18, marginBottom: 20, objectFit: "contain", objectPosition: "left" }}
            />
            <div className="mono" style={{ color: tk.textFaint, fontSize: "0.72rem", letterSpacing: "0.2em", lineHeight: 2.2 }}>
              <div>Christian Ada</div>
              <div>WordPress Developer</div>
              <div>Sandringham, Auckland</div>
              <div style={{ marginTop: 12 }}>© 2026</div>
              <div>All rights reserved</div>
            </div>
            <button
              type="button"
              className="back-to-top hoverable"
              onClick={() => scrollTo(0)}
              style={{ color: tk.textDim, marginTop: 28, textAlign: "left" }}
            >
              Back to top ↑
            </button>
          </div>
        </FadeIn>
      </div>

      {copied ? (
        <div className="toast" role="status" style={{ color: tk.text, borderColor: tk.border }}>
          Copied to clipboard
        </div>
      ) : null}
    </section>
  );
}
