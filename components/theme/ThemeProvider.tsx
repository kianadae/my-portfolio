"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getTheme, type Theme } from "@/lib/theme";

type ThemeContextValue = {
  dark: boolean
  tk: Theme
  toggleTheme: () => void
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);
  const tk = useMemo(() => getTheme(dark), [dark]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--page-bg", tk.bg);
    root.style.setProperty("--page-fg", tk.text);
    root.style.setProperty("--accent", tk.accent);
  }, [tk]);

  const value = useMemo(
    () => ({ dark, tk, toggleTheme: () => setDark((d) => !d) }),
    [dark, tk],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
