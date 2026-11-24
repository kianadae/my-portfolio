"use client";

import { useEffect, useState } from "react";
import { EMAIL } from "@/lib/content";
import type { Theme } from "@/lib/theme";
import useIsMobile from "@/hooks/useIsMobile";

export default function HireBar({ tk }: { tk: Theme }) {
  const [on, setOn] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const update = () => {
      const contact = document.getElementById("contact");
      const pastHero = window.scrollY > window.innerHeight * 0.65;
      const contactVisible = (contact?.getBoundingClientRect().top ?? 9999) < window.innerHeight * 0.72;
      setOn(pastHero && !contactVisible);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className={`hire-bar${on ? " is-on" : ""}`}
      style={{ color: tk.text, borderColor: tk.border, maxWidth: "calc(100vw - 32px)" }}
    >
      <span className="status-dot" aria-hidden="true" />
      {!isMobile ? (
        <span className="mono" style={{ fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: tk.textDim, whiteSpace: "nowrap" }}>
          Open to roles · freelance
        </span>
      ) : null}
      <a className="btn btn-primary hoverable" href={`mailto:${EMAIL}`} style={{ padding: "10px 16px" }}>
        Email
      </a>
    </div>
  );
}
