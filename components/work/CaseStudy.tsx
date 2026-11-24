"use client";

import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { useTheme } from "@/components/theme/ThemeProvider";
import useIsMobile from "@/hooks/useIsMobile";
import { featuredProjects, type Project } from "@/lib/content";

export default function CaseStudy({ project }: { project: Project }) {
  const { tk } = useTheme();
  const isMobile = useIsMobile();
  const px = isMobile ? "24px" : "64px";
  const study = project.caseStudy;
  const index = featuredProjects.findIndex((p) => p.slug === project.slug);
  const next = featuredProjects[(index + 1) % featuredProjects.length];

  if (!study) return null;

  return (
    <SiteShell>
      <article style={{ padding: isMobile ? `120px ${px} 80px` : `140px ${px} 120px` }}>
        <Link href="/#work" className="magnetic-link hoverable" style={{ display: "inline-flex", marginBottom: 28 }}>
          Back to work
        </Link>
        <div className="kicker" style={{ color: tk.textDimmer, marginBottom: 12 }}>Case study</div>
        <h1 className="display" style={{ fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.88, margin: 0, color: tk.text }}>
          {project.title}
        </h1>
        <p style={{ color: tk.accent, marginTop: 16, fontSize: "0.9rem" }}>{project.role}</p>
        <p style={{ color: tk.textDim, fontSize: "1rem", lineHeight: 1.8, maxWidth: 640, marginTop: 16 }}>
          {project.summary}
        </p>

        <div
          style={{
            marginTop: 36,
            padding: isMobile ? "24px" : "32px 36px",
            border: `1px solid ${tk.border}`,
            background: tk.bgAlt,
            display: "inline-flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <div className="display" style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", lineHeight: 1, color: tk.accent }}>
            {study.metric.value}
          </div>
          <div className="kicker" style={{ color: tk.textDimmer }}>{study.metric.label}</div>
        </div>

        <section style={{ marginTop: isMobile ? 48 : 72 }}>
          <h2 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: tk.text, margin: "0 0 12px" }}>
            Problem
          </h2>
          <p style={{ color: tk.textDim, fontSize: "0.95rem", lineHeight: 1.8, maxWidth: 640 }}>{study.problem}</p>
        </section>

        <section style={{ marginTop: isMobile ? 40 : 56 }}>
          <h2 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: tk.text, margin: "0 0 12px" }}>
            What I built
          </h2>
          <p style={{ color: tk.textDim, fontSize: "0.95rem", lineHeight: 1.8, maxWidth: 640 }}>{study.built}</p>
        </section>

        <section style={{ marginTop: isMobile ? 40 : 56 }}>
          <h2 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: tk.text, margin: "0 0 16px" }}>
            Tech
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.tech.map((t) => (
              <span key={t} className="tech-chip">{t}</span>
            ))}
          </div>
        </section>

        <section style={{ marginTop: isMobile ? 40 : 56 }}>
          <h2 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: tk.text, margin: "0 0 20px" }}>
            Gallery
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            {study.gallery.map((shot) => (
              <div key={shot.src} style={{ border: `1px solid ${tk.border}`, background: tk.bgAlt, overflow: "hidden" }}>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={1200}
                  height={750}
                  sizes="(max-width: 767px) 92vw, 44vw"
                  style={{ width: "100%", height: "auto", objectFit: "contain", padding: 32 }}
                />
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 48 }}>
          {project.liveUrl ? (
            <a className="btn btn-ghost hoverable" href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: tk.accent, borderColor: tk.accent }}>
              Live site
            </a>
          ) : null}
          {next && next.slug !== project.slug ? (
            <Link className="btn btn-ghost hoverable" href={`/work/${next.slug}`} style={{ color: tk.accent, borderColor: tk.accent }}>
              Next project — {next.title}
            </Link>
          ) : null}
        </div>
      </article>
    </SiteShell>
  );
}
