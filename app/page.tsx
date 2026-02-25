"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

/* ─── TEXT SCRAMBLE HOOK ─── */
function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  useEffect(() => {
    if (!trigger) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(
        text.split("").map((letter, i) =>
          i < iteration ? text[i] : chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 0.4;
    }, 30);
    return () => clearInterval(interval);
  }, [trigger, text]);
  return display;
}

/* ─── MAGNETIC BUTTON ─── */
function MagneticLink({ href, children, target }: { href: string; children: React.ReactNode; target?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.4);
    y.set((e.clientY - cy) * 0.4);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="magnetic-link"
    >
      {children}
    </motion.a>
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
        img.data[i+3] = 18;
      }
      ctx.putImageData(img, 0, 0);
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-[999] pointer-events-none" />;
}

/* ─── CUSTOM CURSOR ─── */
function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
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
      <div ref={cursorRef} className={`cursor-ring ${hovered ? 'cursor-ring--hover' : ''}`} />
      <div ref={dotRef} className="cursor-dot" />
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
        animate(0, value, {
          duration: 2,
          ease: "easeOut",
          onUpdate: (v) => setCount(Math.floor(v)),
        });
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── MAIN ─── */
export default function Home() {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [activePanel, setActivePanel] = useState(0);

  const heroName1 = useScramble("CHRISTIAN", heroLoaded);
  const heroName2 = useScramble("ADA", heroLoaded);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Horizontal scroll with boundary release
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

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { cursor: none; }
        body { cursor: none; background: #080808; overflow-x: hidden; }

        .cursor-ring {
          position: fixed; top: 0; left: 0; z-index: 9999;
          width: 40px; height: 40px;
          border: 1px solid rgba(255,255,255,0.6);
          border-radius: 50%;
          pointer-events: none;
          transition: width 0.3s, height 0.3s, border-color 0.3s, background 0.3s;
          mix-blend-mode: difference;
        }
        .cursor-ring--hover {
          width: 60px; height: 60px;
          background: rgba(255,255,255,0.08);
          border-color: white;
        }
        .cursor-dot {
          position: fixed; top: 0; left: 0; z-index: 9999;
          width: 6px; height: 6px;
          background: white;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: difference;
        }

        .magnetic-link {
          display: inline-flex; align-items: center; gap: 12px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          font-size: 1rem;
          letter-spacing: 0.08em;
          transition: color 0.3s;
          cursor: none;
        }
        .magnetic-link:hover { color: white; }
        .magnetic-link::before {
          content: '';
          width: 24px; height: 1px;
          background: currentColor;
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .magnetic-link:hover::before { width: 56px; }

        .progress-bar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 1px; background: white;
          transform-origin: left;
        }

        .nav-link {
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          font-size: 0.7rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          transition: color 0.3s;
          cursor: none;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute; bottom: -2px; left: 0;
          width: 0; height: 1px;
          background: white;
          transition: width 0.3s;
        }
        .nav-link:hover { color: white; }
        .nav-link:hover::after { width: 100%; }

        .work-card {
          position: relative;
          border: 1px solid rgba(255,255,255,0.07);
          padding: 48px 40px;
          overflow: hidden;
          cursor: none;
          transition: border-color 0.4s;
        }
        .work-card::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .work-card:hover { border-color: rgba(255,255,255,0.2); }
        .work-card:hover::before { opacity: 1; }
        .work-card .card-arrow {
          position: absolute; top: 40px; right: 40px;
          width: 32px; height: 32px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transform: rotate(-45deg) scale(0.8);
          transition: opacity 0.3s, transform 0.3s;
        }
        .work-card:hover .card-arrow {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }

        .showcase-panel {
          flex-shrink: 0;
          width: 75vw;
          height: 65vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 60px 70px;
          border-right: 1px solid rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
        }
        .showcase-panel::before {
          content: attr(data-num);
          position: absolute;
          top: 48px; right: 60px;
          font-size: 8rem;
          font-weight: 900;
          color: rgba(255,255,255,0.03);
          line-height: 1;
          font-family: 'Bebas Neue', sans-serif;
          pointer-events: none;
          user-select: none;
        }

        .stat-item {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 36px 0;
        }

        .skill-pill {
          border: 1px solid rgba(255,255,255,0.08);
          padding: 12px 24px;
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          cursor: none;
          position: relative;
          overflow: hidden;
        }
        .skill-pill::before {
          content: '';
          position: absolute; inset: 0;
          background: white;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .skill-pill:hover { color: #080808; border-color: white; }
        .skill-pill:hover::before { transform: translateY(0); }
        .skill-pill span { position: relative; z-index: 1; }

        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400&display=swap');
      `}</style>

      <NoiseOverlay />
      <Cursor />

      {/* Progress bar */}
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-10 md:px-16 py-7"
        style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.9) 0%, transparent 100%)', backdropFilter: 'blur(0px)' }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <img
            src="/logo.png"
            alt="Christian Ada"
            style={{ height: '48px', width: 'auto', filter: 'invert(1)', objectFit: 'contain' }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex gap-10"
        >
          {['About', 'Work', 'Skills', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="text-white/20 text-xs tracking-widest"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          NZL — 2025
        </motion.div>
      </nav>

      <div ref={containerRef} className="bg-[#080808] text-white min-h-screen" style={{ fontFamily: "'DM Mono', monospace" }}>

        {/* ─── HERO ─── */}
        <section className="relative flex flex-col justify-end min-h-screen px-10 md:px-16 pb-32 overflow-hidden">

          {/* Large background number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(18rem, 40vw, 52rem)',
                lineHeight: 1,
                color: 'rgba(255,255,255,0.022)',
                letterSpacing: '-0.05em',
                userSelect: 'none',
              }}
            >
              WEB
            </motion.div>
          </div>

          {/* Floating label top-right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="absolute top-32 right-10 md:right-16 text-right"
          >
            <div className="text-white/20 text-xs tracking-[0.3em] uppercase mb-1">Based in</div>
            <div className="text-white/50 text-xs tracking-[0.2em] uppercase">Auckland, NZ</div>
          </motion.div>

          {/* Main title */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-white/30 text-xs tracking-[0.4em] uppercase mb-10"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              ✦ Web Developer
            </motion.div>

            <div style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.88 }}>
              <motion.div
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(5rem, 18vw, 18rem)', letterSpacing: '-0.02em', color: 'white' }}
              >
                {heroName1}
              </motion.div>
              <motion.div
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: 'clamp(5rem, 18vw, 18rem)', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.15)' }}
              >
                {heroName2}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-14 flex items-center gap-10"
            >
              <p className="text-white/40 text-xs tracking-widest max-w-xs leading-relaxed uppercase">
                WordPress · Performance · UX · Backend
              </p>
              <div className="w-px h-10 bg-white/10" />
              <p className="text-white/25 text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>
                4+ yrs exp.
              </p>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 right-10 md:right-16 flex flex-col items-center gap-3"
          >
            <div className="text-white/20 text-xs tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>
              Scroll
            </div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"
            />
          </motion.div>
        </section>

        {/* ─── STATS BAND ─── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-b border-white/8 grid grid-cols-2 md:grid-cols-4"
        >
          {[
            { value: 40, suffix: '+', label: 'WP Sites Built' },
            { value: 4, suffix: '+', label: 'Years Experience' },
            { value: 30, suffix: '%', label: 'Avg Load Improvement' },
            { value: 100, suffix: '%', label: 'Client Satisfaction' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="stat-item px-10 md:px-16 border-r border-white/8 last:border-r-0"
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3.5rem', lineHeight: 1, letterSpacing: '0.02em' }}>
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white/30 text-xs tracking-widest uppercase mt-2">{s.label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* ─── ABOUT ─── */}
        <section id="about" className="py-40 px-10 md:px-16 grid md:grid-cols-12 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-3"
          >
            <div className="text-white/20 text-xs tracking-[0.3em] uppercase mb-3">About</div>
            <div className="w-8 h-px bg-white/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="md:col-span-9"
          >
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2.6rem)', lineHeight: 1.35, color: 'rgba(255,255,255,0.85)', fontWeight: 400 }}>
              Detail-oriented Web Developer with 4+ years crafting WordPress experiences —
              <em style={{ color: 'rgba(255,255,255,0.4)' }}> focused on performance, responsiveness,
              and backend precision.</em> Currently pursuing postgraduate studies in IT in New Zealand.
            </p>
          </motion.div>
        </section>

        {/* ─── WORK GRID ─── */}
        <section id="work" className="py-20 px-10 md:px-16">
          <div className="flex items-end justify-between mb-20 border-t border-white/8 pt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-white/20 text-xs tracking-[0.3em] uppercase mb-4">Selected Work</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 8vw, 7rem)', lineHeight: 0.9, letterSpacing: '0.01em' }}>
                Projects
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-white/20 text-xs tracking-widest hidden md:block"
            >
              2020 — Present
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {[
              { num: '01', title: "WordPress Development", sub: "40+ sites", desc: "Developed 40+ WordPress websites with CRM and payment integrations, optimised load time by up to 30%.", tag: "2020–Present" },
              { num: '02', title: "Maintenance & Support", sub: "Ongoing", desc: "Ongoing plugin updates, troubleshooting, UX improvements, and responsive cross-browser testing.", tag: "Freelance" },
              { num: '03', title: "Performance Optimisation", sub: "Specialist", desc: "Improved load times up to 30% using caching strategies, image compression, and code minification.", tag: "Core Skill" },
              { num: '04', title: "UX & Responsive Design", sub: "Mobile-first", desc: "Mobile-first design approach with cross-browser compatibility and accessibility improvements.", tag: "Design" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="work-card hoverable"
              >
                <div className="card-arrow">↗</div>
                <div className="flex items-start justify-between mb-8">
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>{item.num}</span>
                  <span className="text-white/20 text-xs tracking-widest uppercase">{item.tag}</span>
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', lineHeight: 1, letterSpacing: '0.02em', marginBottom: '8px' }}>
                  {item.title}
                </div>
                <div className="text-white/30 text-xs tracking-widest uppercase mb-5">{item.sub}</div>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── HORIZONTAL SCROLL SHOWCASE ─── */}
        <div
          ref={horizontalRef}
          className="overflow-x-auto overflow-y-hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          <div className="flex border-t border-white/8">
            {[
              { title: "WordPress Projects", text: "40+ websites built with CRM & payment integration.", year: "2020" },
              { title: "Performance Optimisation", text: "Improved load times up to 30% with caching and code minification.", year: "2022" },
              { title: "UX & Responsive Design", text: "Cross-browser testing and mobile-first UX improvements.", year: "2023" },
            ].map((s, i) => (
              <div
                key={i}
                className="showcase-panel"
                data-num={`0${i + 1}`}
              >
                <div className="text-white/15 text-xs tracking-[0.4em] uppercase mb-6"
                  style={{ fontFamily: "'DM Mono', monospace" }}>
                  {s.year} — 0{i + 1} / 03
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 0.9, letterSpacing: '0.01em', marginBottom: '24px' }}>
                  {s.title}
                </div>
                <p className="text-white/40 text-sm leading-relaxed max-w-md">{s.text}</p>

                {/* progress dots */}
                <div className="flex gap-2 mt-10">
                  {[0,1,2].map(j => (
                    <div key={j} className="h-px transition-all duration-500"
                      style={{ width: j === i ? '32px' : '12px', background: j === i ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)' }} />
                  ))}
                </div>
              </div>
            ))}
            {/* End spacer */}
            <div className="flex-shrink-0 w-[25vw] h-[65vh] border-none" />
          </div>
        </div>

        {/* ─── SKILLS ─── */}
        <section id="skills" className="py-40 px-10 md:px-16 border-t border-white/8">
          <div className="grid md:grid-cols-12 gap-16 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-4"
            >
              <div className="text-white/20 text-xs tracking-[0.3em] uppercase mb-4">Expertise</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.9 }}>
                Skills &<br/>Tools
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-8 flex items-end"
            >
              <p className="text-white/30 text-sm leading-relaxed max-w-lg">
                A toolkit built over 4+ years of professional web development, continuously evolving with the industry.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              "WordPress", "PHP", "JavaScript", "TypeScript",
              "React", "Next.js", "Tailwind CSS", "MySQL",
              "WooCommerce", "Git", "Performance", "UX Design",
              "Elementor", "ACF", "REST API", "Figma",
            ].map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="skill-pill hoverable"
              >
                <span>{skill}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" className="py-40 px-10 md:px-16 border-t border-white/8">
          <div className="grid md:grid-cols-12 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="md:col-span-8"
            >
              <div className="text-white/20 text-xs tracking-[0.3em] uppercase mb-8">Get in touch</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 10vw, 10rem)', lineHeight: 0.88, letterSpacing: '-0.01em', marginBottom: '48px' }}>
                Let&apos;s<br />
                <span style={{ color: 'rgba(255,255,255,0.2)' }}>Connect</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-md mb-12">
                Open to internships, web development roles, and freelance projects. Let&apos;s build something great.
              </p>

              <div className="flex flex-col gap-6">
                <MagneticLink href="mailto:mahusaycada98@gmail.com">
                  mahusaycada98@gmail.com
                </MagneticLink>
                <MagneticLink href="https://www.linkedin.com/in/christian-ada/" target="_blank">
                  LinkedIn — christian-ada
                </MagneticLink>
                <MagneticLink href="https://www.behance.net/christian-ada" target="_blank">
                  Behance — christian-ada
                </MagneticLink>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="md:col-span-4 flex flex-col justify-end"
            >
              <div className="text-white/10 text-xs tracking-widest leading-loose" style={{ fontFamily: "'DM Mono', monospace" }}>
                <img
                  src="/logo.png"
                  alt="Christian Ada"
                  style={{ height: '40px', width: 'auto', filter: 'invert(1)', opacity: 0.15, marginBottom: '20px', objectFit: 'contain' }}
                />
                <div>Christian Ada</div>
                <div>Web Developer</div>
                <div>Auckland, New Zealand</div>
                <div className="mt-4">© 2026</div>
                <div>All rights reserved</div>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}