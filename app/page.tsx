"use client";

import { motion, useScroll, useSpring, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ─── TEXT SCRAMBLE ─── */
function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((l, i) => i < iteration ? text[i] : chars[Math.floor(Math.random() * chars.length)]).join(""));
      if (iteration >= text.length) clearInterval(interval);
      iteration += 0.4;
    }, 30);
    return () => clearInterval(interval);
  }, [trigger, text]);
  return display;
}

/* ─── MAGNETIC LINK ─── */
function MagneticLink({ href, children, target, dark }: { href: string; children: React.ReactNode; target?: string; dark: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.4);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.4);
  };
  return (
    <motion.a
      ref={ref} href={href} target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      style={{ x: springX, y: springY, color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', fontSize: '1rem', letterSpacing: '0.08em', cursor: 'none', transition: 'color 0.3s' }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="magnetic-link hoverable"
    >{children}</motion.a>
  );
}

/* ─── NOISE CANVAS ─── */
function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let animId: number;
    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 15;
      }
      ctx.putImageData(img, 0, 0);
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-[999] pointer-events-none" />;
}

/* ─── CURSOR ─── */
function Cursor({ dark }: { dark: boolean }) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorRef.current && (cursorRef.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`);
      dotRef.current && (dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovered(!!(t.closest('a') || t.closest('button') || t.closest('.hoverable')));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);
  return (
    <>
      <div ref={cursorRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, width: hovered ? '60px' : '40px', height: hovered ? '60px' : '40px', border: `1px solid ${dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}`, borderRadius: '50%', pointerEvents: 'none', transition: 'width 0.3s, height 0.3s, border-color 0.4s' }} />
      <div ref={dotRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, width: '6px', height: '6px', background: dark ? 'white' : '#080808', borderRadius: '50%', pointerEvents: 'none', transition: 'background 0.4s' }} />
    </>
  );
}

/* ─── COUNTER ─── */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animate(0, value, { duration: 2, ease: "easeOut", onUpdate: (v) => setCount(Math.floor(v)) });
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── THEME TOGGLE ─── */
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      className="hoverable"
      style={{
        position: 'relative', width: '52px', height: '28px', borderRadius: '999px',
        border: dark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.15)',
        background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        cursor: 'none', outline: 'none', flexShrink: 0, transition: 'border-color 0.4s, background 0.4s',
      }}
      aria-label="Toggle theme"
    >
      <span style={{ position: 'absolute', left: '7px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', opacity: dark ? 0.5 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>☀️</span>
      <span style={{ position: 'absolute', right: '7px', top: '50%', transform: 'translateY(-50%)', fontSize: '10px', opacity: dark ? 0 : 0.6, transition: 'opacity 0.3s', pointerEvents: 'none' }}>🌙</span>
      <motion.div
        animate={{ x: dark ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ position: 'absolute', top: '3px', width: '20px', height: '20px', borderRadius: '50%', background: dark ? 'white' : '#080808', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
      />
    </motion.button>
  );
}

/* ─── MAIN ─── */
export default function Home() {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activePanel, setActivePanel] = useState(0);
  const [dark, setDark] = useState(true);

  const heroName1 = useScramble("CHRISTIAN", heroLoaded);
  const heroName2 = useScramble("ADA", heroLoaded);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = horizontalRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const atStart = el.scrollLeft === 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      if (atStart && e.deltaY < 0) return;
      if (atEnd && e.deltaY > 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY + e.deltaX;
      setActivePanel(Math.round(el.scrollLeft / el.clientWidth));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // ── Theme tokens ──
  const tk = {
    bg:             dark ? '#080808'                    : '#f5f3ef',
    text:           dark ? '#ffffff'                    : '#0a0a0a',
    textDim:        dark ? 'rgba(255,255,255,0.5)'      : 'rgba(0,0,0,0.5)',
    textDimmer:     dark ? 'rgba(255,255,255,0.2)'      : 'rgba(0,0,0,0.25)',
    textFaint:      dark ? 'rgba(255,255,255,0.1)'      : 'rgba(0,0,0,0.12)',
    border:         dark ? 'rgba(255,255,255,0.08)'     : 'rgba(0,0,0,0.1)',
    borderHover:    dark ? 'rgba(255,255,255,0.2)'      : 'rgba(0,0,0,0.25)',
    cardHover:      dark ? 'rgba(255,255,255,0.04)'     : 'rgba(0,0,0,0.03)',
    navBg:          dark ? 'rgba(8,8,8,0.88)'           : 'rgba(245,243,239,0.88)',
    ghostText:      dark ? 'rgba(255,255,255,0.022)'    : 'rgba(0,0,0,0.04)',
    logoFilter:     dark ? 'invert(1)'                  : 'invert(0)',
    progressBar:    dark ? 'white'                      : '#0a0a0a',
    skillHoverBg:   dark ? 'white'                      : '#0a0a0a',
    skillHoverText: dark ? '#080808'                    : '#f5f3ef',
    connectDim:     dark ? 'rgba(255,255,255,0.18)'     : 'rgba(0,0,0,0.15)',
  };

  const dur = '0.45s';

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { cursor: none; scroll-behavior: smooth; }
        body { cursor: none; overflow-x: hidden; }

        .magnetic-link::before {
          content: ''; width: 24px; height: 1px; background: currentColor; flex-shrink: 0;
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .magnetic-link:hover::before { width: 56px; }

        .nav-link {
          text-decoration: none; font-size: 0.7rem; letter-spacing: 0.25em;
          text-transform: uppercase; cursor: none; position: relative; transition: color 0.3s;
        }
        .nav-link::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 0; height: 1px; background: currentColor; transition: width 0.3s ease; }
        .nav-link:hover { text-decoration: none; }
        .nav-link:hover::after { width: 100%; }

        .work-card {
          position: relative; padding: 48px 40px; overflow: hidden; cursor: none;
          transition: border-color ${dur}, background ${dur};
        }
        .work-card .card-arrow {
          position: absolute; top: 40px; right: 40px; width: 32px; height: 32px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: rotate(-45deg) scale(0.8);
          transition: opacity 0.3s, transform 0.3s, border-color ${dur};
        }
        .work-card:hover .card-arrow { opacity: 1; transform: rotate(0deg) scale(1); }

        .showcase-panel {
          flex-shrink: 0; width: 75vw; height: 65vh;
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 60px 70px; position: relative; overflow: hidden;
          transition: border-color ${dur}, background ${dur};
        }
        .showcase-panel::before {
          content: attr(data-num); position: absolute; top: 48px; right: 60px;
          font-size: 8rem; font-weight: 900; line-height: 1;
          font-family: 'Bebas Neue', sans-serif; pointer-events: none; user-select: none;
          transition: color ${dur};
        }

        .skill-pill {
          padding: 12px 24px; font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase;
          cursor: none; position: relative; overflow: hidden;
          transition: color 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s;
        }
        .skill-pill::before {
          content: ''; position: absolute; inset: 0;
          transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .skill-pill:hover::before { transform: translateY(0); }
        .skill-pill span { position: relative; z-index: 1; }
      `}</style>

      <NoiseOverlay />
      <Cursor dark={dark} />

      {/* ── Progress bar ── */}
      <motion.div style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: '1px', background: tk.progressBar, transformOrigin: 'left', transition: `background ${dur}` }} />

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 64px', background: tk.navBg, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${tk.border}`, transition: `background ${dur}, border-color ${dur}` }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
          <img src="/logo.png" alt="Christian Ada" style={{ height: '44px', width: 'auto', filter: tk.logoFilter, objectFit: 'contain', transition: `filter ${dur}` }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {['About', 'Work', 'Skills', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link"
              style={{ color: tk.textDimmer, transition: `color ${dur}` }}
            >{item}</a>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', color: tk.textDimmer, fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', transition: `color ${dur}` }}>
            {dark ? 'Dark' : 'Light'}
          </span>
          <ThemeToggle dark={dark} onToggle={() => setDark(!dark)} />
        </motion.div>
      </nav>

      {/* ── PAGE ── */}
      <div ref={containerRef} style={{ background: tk.bg, color: tk.text, minHeight: '100vh', fontFamily: "'DM Mono', monospace", transition: `background ${dur}, color ${dur}` }}>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '100vh', padding: '0 64px 128px', overflow: 'hidden' }}>
          {/* Ghost BG */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
            <motion.div
              initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(18rem, 40vw, 52rem)', lineHeight: 1, color: tk.ghostText, letterSpacing: '-0.05em', userSelect: 'none', transition: `color ${dur}` }}
            >WEB</motion.div>
          </div>

          {/* Top-right label */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1.8 }}
            style={{ position: 'absolute', top: '120px', right: '64px', textAlign: 'right' }}>
            <div style={{ color: tk.textDimmer, fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '4px', transition: `color ${dur}` }}>Based in</div>
            <div style={{ color: tk.textDim, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', transition: `color ${dur}` }}>Auckland, NZ</div>
          </motion.div>

          <div style={{ position: 'relative', zIndex: 10 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.4 }}
              style={{ color: tk.textDimmer, fontSize: '0.75rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '40px', fontFamily: "'DM Mono', monospace", transition: `color ${dur}` }}>
              ✦ Web Developer
            </motion.div>

            <div style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.88 }}>
              <motion.div initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(5rem, 18vw, 18rem)', letterSpacing: '-0.02em', color: tk.text, transition: `color ${dur}` }}>
                {heroName1}
              </motion.div>
              <motion.div initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(5rem, 18vw, 18rem)', letterSpacing: '-0.02em', color: tk.textDimmer, transition: `color ${dur}` }}>
                {heroName2}
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}
              style={{ marginTop: '56px', display: 'flex', alignItems: 'center', gap: '40px' }}>
              <p style={{ color: tk.textDimmer, fontSize: '0.75rem', letterSpacing: '0.2em', maxWidth: '280px', lineHeight: 1.8, textTransform: 'uppercase', transition: `color ${dur}` }}>
                WordPress · Performance · UX · Backend
              </p>
              <div style={{ width: '1px', height: '40px', background: tk.border, transition: `background ${dur}` }} />
              <p style={{ color: tk.textDimmer, fontSize: '0.75rem', fontFamily: "'DM Mono', monospace", transition: `color ${dur}` }}>4+ yrs exp.</p>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            style={{ position: 'absolute', bottom: '40px', right: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: tk.textDimmer, fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', writingMode: 'vertical-rl', transition: `color ${dur}` }}>Scroll</div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              style={{ width: '1px', height: '48px', background: `linear-gradient(to bottom, ${tk.textDim}, transparent)`, transition: `background ${dur}` }} />
          </motion.div>
        </section>

        {/* ── STATS ── */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ borderTop: `1px solid ${tk.border}`, borderBottom: `1px solid ${tk.border}`, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', transition: `border-color ${dur}` }}>
          {[
            { value: 40, suffix: '+', label: 'WP Sites Built' },
            { value: 4,  suffix: '+', label: 'Years Experience' },
            { value: 30, suffix: '%', label: 'Avg Load Improvement' },
            { value: 100,suffix: '%', label: 'Client Satisfaction' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ padding: '36px 64px', borderRight: i < 3 ? `1px solid ${tk.border}` : 'none', transition: `border-color ${dur}` }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', lineHeight: 1, letterSpacing: '0.02em', color: tk.text, transition: `color ${dur}` }}>
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div style={{ color: tk.textDimmer, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '8px', transition: `color ${dur}` }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* ── ABOUT ── */}
        <section id="about" style={{ padding: '160px 64px', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '64px' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div style={{ color: tk.textDimmer, fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '12px', transition: `color ${dur}` }}>About</div>
            <div style={{ width: '32px', height: '1px', background: tk.border, transition: `background ${dur}` }} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.6rem)', lineHeight: 1.35, color: tk.text, fontWeight: 400, transition: `color ${dur}` }}>
              Detail-oriented Web Developer with 4+ years crafting WordPress experiences —{' '}
              <em style={{ color: tk.textDim, transition: `color ${dur}` }}>focused on performance, responsiveness, and backend precision.</em>{' '}
              Currently pursuing postgraduate studies in IT in New Zealand.
            </p>
          </motion.div>
        </section>

        {/* ── WORK ── */}
        <section id="work" style={{ padding: '80px 64px 160px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '80px', borderTop: `1px solid ${tk.border}`, paddingTop: '64px', transition: `border-color ${dur}` }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div style={{ color: tk.textDimmer, fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px', transition: `color ${dur}` }}>Selected Work</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.9, color: tk.text, transition: `color ${dur}` }}>Projects</div>
            </motion.div>
            <div style={{ color: tk.textDimmer, fontSize: '0.7rem', letterSpacing: '0.2em', transition: `color ${dur}` }}>2020 — Present</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3px' }}>
            {[
              { num: '01', title: "WordPress Development", sub: "40+ sites",   desc: "Developed 40+ WordPress websites with CRM and payment integrations, optimised load time by up to 30%.", tag: "2020–Present" },
              { num: '02', title: "Maintenance & Support", sub: "Ongoing",     desc: "Ongoing plugin updates, troubleshooting, UX improvements, and responsive cross-browser testing.", tag: "Freelance" },
              { num: '03', title: "Performance Optimisation", sub: "Specialist",desc: "Improved load times up to 30% using caching strategies, image compression, and code minification.", tag: "Core Skill" },
              { num: '04', title: "UX & Responsive Design", sub: "Mobile-first",desc: "Mobile-first design approach with cross-browser compatibility and accessibility improvements.", tag: "Design" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.12 }}
                className="work-card hoverable"
                style={{ border: `1px solid ${tk.border}` }}>
                <div className="card-arrow" style={{ border: `1px solid ${tk.border}`, color: tk.text }}>↗</div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: tk.textDimmer, letterSpacing: '0.2em', transition: `color ${dur}` }}>{item.num}</span>
                  <span style={{ color: tk.textDimmer, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', transition: `color ${dur}` }}>{item.tag}</span>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1, letterSpacing: '0.02em', marginBottom: '8px', color: tk.text, transition: `color ${dur}` }}>{item.title}</div>
                <div style={{ color: tk.textDimmer, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px', transition: `color ${dur}` }}>{item.sub}</div>
                <p style={{ color: tk.textDim, fontSize: '0.875rem', lineHeight: 1.7, transition: `color ${dur}` }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── HORIZONTAL SHOWCASE ── */}
        <div ref={horizontalRef} style={{ overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', borderTop: `1px solid ${tk.border}`, transition: `border-color ${dur}` }}>
          <div style={{ display: 'flex' }}>
            {[
              { title: "WordPress Projects",      text: "40+ websites built with CRM & payment integration.", year: "2020" },
              { title: "Performance Optimisation",text: "Improved load times up to 30% with caching and code minification.", year: "2022" },
              { title: "UX & Responsive Design",  text: "Cross-browser testing and mobile-first UX improvements.", year: "2023" },
            ].map((s, i) => (
              <div key={i} className="showcase-panel" data-num={`0${i+1}`}
                style={{ borderRight: `1px solid ${tk.border}`, background: tk.bg }}>
                <div style={{ color: tk.textFaint, fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '24px', fontFamily: "'DM Mono', monospace", transition: `color ${dur}` }}>
                  {s.year} — 0{i+1} / 03
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 0.9, letterSpacing: '0.01em', marginBottom: '24px', color: tk.text, transition: `color ${dur}` }}>
                  {s.title}
                </div>
                <p style={{ color: tk.textDim, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '420px', transition: `color ${dur}` }}>{s.text}</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '40px' }}>
                  {[0,1,2].map(j => (
                    <div key={j} style={{ height: '1px', width: j===i ? '32px' : '12px', background: j===i ? tk.text : tk.border, transition: `width 0.5s, background ${dur}` }} />
                  ))}
                </div>
              </div>
            ))}
            <div style={{ flexShrink: 0, width: '25vw', height: '65vh' }} />
          </div>
        </div>

        {/* ── SKILLS ── */}
        <section id="skills" style={{ padding: '160px 64px', borderTop: `1px solid ${tk.border}`, transition: `border-color ${dur}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '64px', marginBottom: '80px' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div style={{ color: tk.textDimmer, fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px', transition: `color ${dur}` }}>Expertise</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.9, color: tk.text, transition: `color ${dur}` }}>Skills &<br />Tools</div>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <p style={{ color: tk.textDim, fontSize: '0.875rem', lineHeight: 1.8, maxWidth: '480px', transition: `color ${dur}` }}>
                A toolkit built over 4+ years of professional web development, continuously evolving with the industry.
              </p>
            </motion.div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {["WordPress","PHP","JavaScript","TypeScript","React","Next.js","Tailwind CSS","MySQL","WooCommerce","Git","Performance","UX Design","Elementor","ACF","REST API","Figma"].map((skill, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }}
                className="skill-pill hoverable"
                style={{ border: `1px solid ${tk.border}`, color: tk.textDim }}>
                <style>{`.skill-pill:hover { color: ${tk.skillHoverText} !important; border-color: ${tk.text} !important; } .skill-pill::before { background: ${tk.skillHoverBg}; }`}</style>
                <span>{skill}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" style={{ padding: '160px 64px', borderTop: `1px solid ${tk.border}`, transition: `border-color ${dur}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '64px' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
              <div style={{ color: tk.textDimmer, fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '32px', transition: `color ${dur}` }}>Get in touch</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 10vw, 10rem)', lineHeight: 0.88, letterSpacing: '-0.01em', marginBottom: '48px', color: tk.text, transition: `color ${dur}` }}>
                Let&apos;s<br /><span style={{ color: tk.connectDim, transition: `color ${dur}` }}>Connect</span>
              </div>
              <p style={{ color: tk.textDim, fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '400px', marginBottom: '48px', transition: `color ${dur}` }}>
                Open to web development roles and freelance projects. Let&apos;s build something great.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <MagneticLink href="mailto:mahusaycada98@gmail.com" dark={dark}>mahusaycada98@gmail.com</MagneticLink>
                <MagneticLink href="https://www.linkedin.com/in/christian-ada/" target="_blank" dark={dark}>LinkedIn — christian-ada</MagneticLink>
                <MagneticLink href="https://www.behance.net/christian-ada" target="_blank" dark={dark}>Behance — christian-ada</MagneticLink>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <img src="/logo.png" alt="Christian Ada" style={{ height: '44px', width: 'auto', filter: tk.logoFilter, opacity: 0.18, marginBottom: '24px', objectFit: 'contain', transition: `filter ${dur}, opacity ${dur}` }} />
              <div style={{ color: tk.textFaint, fontSize: '0.72rem', letterSpacing: '0.2em', lineHeight: 2.2, fontFamily: "'DM Mono', monospace", transition: `color ${dur}` }}>
                <div>Christian Ada</div>
                <div>Web Developer</div>
                <div>Auckland, New Zealand</div>
                <div style={{ marginTop: '16px' }}>© 2026</div>
                <div>All rights reserved</div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}