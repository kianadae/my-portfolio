"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { EMAIL, featuredProjects, navItems } from "@/lib/content";
import type { Theme } from "@/lib/theme";
import ThemeToggle from "@/components/ThemeToggle";
import { useMotion } from "@/components/motion/MotionProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { motionConfig } from "@/lib/motion";
import LogoPlate from "@/components/LogoPlate";

const menuLinks = [
  { label: "About", id: "about", href: null as string | null },
  { label: "Work", id: "work", href: null },
  { label: "Services", id: "services", href: null },
  { label: "Experience", id: "experience", href: null },
  { label: "Skills", id: "skills", href: null },
  { label: "Play", id: "play", href: "/playground" },
  { label: "FAQ", id: "faq", href: null },
  { label: "Contact", id: "contact", href: null },
];

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
  const { enabled, toggle, scrollTo, lockScroll } = useMotion();
  const pathname = usePathname();
  const router = useRouter();
  const atHome = pathname === "/";
  const atPlay = pathname.startsWith("/playground");
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const featured = featuredProjects.slice(0, 2);

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
    lockScroll(menuOpen);
    return () => lockScroll(false);
  }, [menuOpen, lockScroll]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => {
    const root = overlay.current;
    if (!root || !enabled) {
      setMenuOpen(false);
      return;
    }
    gsap.to(root, {
      opacity: 0,
      duration: motionConfig.duration.fast,
      ease: motionConfig.ease.inOut,
      onComplete: () => setMenuOpen(false),
    });
  };

  useGSAP(() => {
    const root = overlay.current;
    if (!root || !menuOpen) return;
    const links = root.querySelectorAll<HTMLElement>(".site-menu-link");
    const cards = root.querySelectorAll<HTMLElement>(".site-menu-card");
    gsap.set(root, { opacity: 1 });
    if (!enabled) {
      gsap.set([links, cards], { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      links,
      { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: motionConfig.duration.base,
        ease: motionConfig.ease.out,
        stagger: motionConfig.stagger.list,
      },
    );
    gsap.fromTo(
      cards,
      { opacity: 0, y: motionConfig.menuFromY },
      {
        opacity: 1,
        y: 0,
        duration: motionConfig.duration.slow,
        ease: motionConfig.ease.out,
        stagger: 0.08,
        delay: 0.16,
      },
    );
  }, { dependencies: [menuOpen, enabled] });

  return (
    <>
      <div className="progress-bar" ref={bar} style={{ background: tk.progressBar }} />

      <nav
        className="site-nav"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: tk.navBg,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${tk.border}`,
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
            sizes="120px"
            priority
            className="site-logo"
            style={{ height: isMobile ? 36 : 44, width: "auto", objectFit: "contain" }}
          />
        </button>

        <div className="nav-desktop" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {navItems.map((item) => {
            const id = item.toLowerCase();
            return (
              <button
                key={item}
                type="button"
                className={`nav-link${active === id ? " is-active" : ""}`}
                onClick={() => go(id)}
                style={{ color: active === id ? tk.accent : tk.textDimmer }}
              >
                {item}
              </button>
            );
          })}
          <Link
            href="/playground"
            className={`nav-link${atPlay ? " is-active" : ""}`}
            style={{ color: atPlay ? tk.accent : tk.textDimmer }}
          >
            Play
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 14 }}>
          <div className="nav-cta-desktop">
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
          </div>
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          <button
            type="button"
            className="hamburger"
            onClick={openMenu}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            style={{ color: tk.text }}
          >
            <span className="hamburger-icon" aria-hidden="true">
              <span style={{ background: tk.text }} />
              <span style={{ background: tk.text }} />
              <span style={{ background: tk.text, width: 14 }} />
            </span>
            <span className="nav-menu-label">Menu</span>
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          ref={overlay}
          className="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          style={{ background: tk.bg, color: tk.text }}
        >
          <div className="site-menu-top" style={{ padding: isMobile ? "20px 24px" : "24px 64px" }}>
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
                sizes="120px"
                className="site-logo"
                style={{ height: isMobile ? 36 : 44, width: "auto", objectFit: "contain" }}
              />
            </button>
            <button
              type="button"
              className="nav-link hoverable"
              onClick={closeMenu}
              style={{ color: tk.text }}
            >
              Close
            </button>
          </div>

          <div
            className="site-menu-body"
            style={{
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              padding: isMobile ? "24px 24px 40px" : "40px 64px 64px",
            }}
          >
            <div className="site-menu-links">
              {menuLinks.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="site-menu-link display hoverable"
                    style={{ color: item.href === "/playground" && atPlay ? tk.accent : tk.text }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    className="site-menu-link display hoverable"
                    onClick={() => go(item.id)}
                    style={{ color: active === item.id ? tk.accent : tk.text }}
                  >
                    {item.label}
                  </button>
                ),
              )}
              <div className="site-menu-meta">
                <a className="nav-link hoverable" href={`mailto:${EMAIL}`} style={{ color: tk.accent }}>
                  Email
                </a>
                {isMobile ? (
                  <button
                    type="button"
                    className="nav-link"
                    onClick={toggle}
                    aria-pressed={enabled}
                    style={{ color: tk.textDim }}
                  >
                    Motion {enabled ? "on" : "off"}
                  </button>
                ) : null}
              </div>
            </div>

            {isMobile ? null : (
            <div className="site-menu-cards">
              {featured.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => go("work")}
                  className="site-menu-card hoverable"
                  style={{ borderColor: tk.border, color: tk.text, textAlign: "left", width: "100%" }}
                >
                  <LogoPlate
                    src={item.logo}
                    plate={item.plate}
                    alt={item.alt}
                    sizes="(max-width: 767px) 90vw, 28vw"
                    style={{ height: isMobile ? 140 : 180 }}
                  />
                  <div className="site-menu-card-copy">
                    <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 6 }}>Selected work</div>
                    <div className="display" style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.4rem)", lineHeight: 0.95 }}>
                      {item.title}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
