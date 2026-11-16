"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CV, EMAIL, navItems } from "@/lib/content";
import type { Theme } from "@/lib/theme";
import ThemeToggle from "@/components/ThemeToggle";
import { useMotion } from "@/components/motion/MotionProvider";

export default function Nav({
  tk,
  dark,
  onToggleTheme,
  isMobile,
}: {
  tk: Theme
  dark: boolean
  onToggleTheme: () => void
  isMobile: boolean
}) {
  const { enabled, toggle, scrollTo } = useMotion();
  const pathname = usePathname();
  const router = useRouter();
  const atHome = pathname === "/";
  const atPlay = pathname.startsWith("/playground");
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const dur = "0.45s";

  useEffect(() => {
    const ids = [...navItems.map((n) => n.toLowerCase()), "play", "services", "faq"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-32% 0px -55% 0px", threshold: 0.01 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    if (atHome) {
      scrollTo(`#${id}`);
      return;
    }
    router.push(`/#${id}`);
  };

  const goHome = () => {
    setMenuOpen(false);
    if (atHome) scrollTo(0);
    else router.push("/");
  };

  return (
    <>
      <div className="progress-bar" ref={bar} style={{ background: tk.progressBar }} />

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "20px 24px" : "24px 64px",
          background: dark ? "rgba(8,8,8,0.94)" : "rgba(245,243,239,0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${tk.border}`,
          transition: `background ${dur}, border-color ${dur}`,
        }}
      >
        <button
          type="button"
          onClick={goHome}
          aria-label="Back to top"
          style={{ background: "none", border: "none", padding: 0, display: "flex" }}
        >
          <Image
            src="/logo.png"
            alt="Christian Ada"
            width={120}
            height={44}
            priority
            style={{ height: isMobile ? 36 : 44, width: "auto", filter: tk.logoFilter, objectFit: "contain" }}
          />
        </button>

        {!isMobile && (
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {navItems.map((item) => {
              const id = item.toLowerCase();
              return (
                <button
                  key={item}
                  type="button"
                  className={`nav-link${active === id ? " is-active" : ""}`}
                  onClick={() => go(id)}
                  style={{ color: active === id ? tk.text : tk.textDimmer }}
                >
                  {item}
                </button>
              );
            })}
            <Link
              href="/playground"
              className={`nav-link${atPlay ? " is-active" : ""}`}
              style={{ color: atPlay ? tk.text : tk.textDimmer }}
            >
              Play
            </Link>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {!isMobile && (
            <>
              <a className="nav-link hoverable" href={`mailto:${EMAIL}`} style={{ color: tk.text }}>
                Email
              </a>
              <button
                type="button"
                className="nav-link hoverable"
                onClick={toggle}
                aria-pressed={enabled}
                style={{ color: tk.textDimmer }}
              >
                Motion {enabled ? "on" : "off"}
              </button>
              <span
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.25em",
                  color: tk.textDimmer,
                  fontFamily: "var(--font-dm-mono), monospace",
                  textTransform: "uppercase",
                }}
              >
                {dark ? "Dark" : "Light"}
              </span>
            </>
          )}
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          {isMobile && (
            <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <span style={{ background: tk.text }} />
              <span style={{ background: tk.text }} />
              <span style={{ background: tk.text, width: 14 }} />
            </button>
          )}
        </div>
      </nav>

      {menuOpen ? (
        <div
          role="dialog"
          aria-label="Menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: tk.bg,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 32,
          }}
        >
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => go(item.toLowerCase())}
              className="display"
              style={{
                fontSize: "3.5rem",
                color: tk.text,
                background: "none",
                border: "none",
                letterSpacing: "0.05em",
              }}
            >
              {item}
            </button>
          ))}
          <Link
            href="/playground"
            onClick={() => setMenuOpen(false)}
            className="display"
            style={{ fontSize: "3.5rem", color: atPlay ? tk.text : tk.textDim, textDecoration: "none", letterSpacing: "0.05em" }}
          >
            Play
          </Link>
          <a
            href={`mailto:${EMAIL}`}
            className="display"
            style={{ fontSize: "2rem", color: tk.text, textDecoration: "none", letterSpacing: "0.05em" }}
          >
            Email
          </a>
          <a
            href={CV}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
            style={{ color: tk.textDim }}
          >
            Download CV
          </a>
          <button
            type="button"
            className="nav-link"
            onClick={toggle}
            aria-pressed={enabled}
            style={{ color: tk.textDim, marginTop: 8 }}
          >
            Motion {enabled ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            style={{
              color: tk.textDimmer,
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              marginTop: 8,
            }}
          >
            Tap anywhere to close
          </button>
        </div>
      ) : null}
    </>
  );
}
