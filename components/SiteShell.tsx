"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import useIsMobile from "@/hooks/useIsMobile";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";

export default function SiteShell({ children }: { children: ReactNode }) {
  const { dark, tk, toggleTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="noise" aria-hidden="true" />
      {!isMobile ? <Cursor /> : null}
      <Nav tk={tk} dark={dark} onToggleTheme={toggleTheme} isMobile={isMobile} />
      <div
        style={{
          background: "var(--bg)",
          color: tk.text,
          minHeight: "100vh",
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        {children}
      </div>
    </>
  );
}
