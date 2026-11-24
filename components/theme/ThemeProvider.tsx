"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { THEME_KEY, getTheme, type Theme } from "@/lib/theme";

type ThemeContextValue = {
  dark: boolean
  tk: Theme
  toggleTheme: () => void
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_EVENT = "ca-theme";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function applyTheme(dark: boolean) {
  const root = document.documentElement;
  root.setAttribute("data-theme", dark ? "dark" : "light");
  // Section tints used to pin --bg as an inline style and could outlive a toggle.
  root.style.removeProperty("--bg");
}

function readDark(): boolean {
  return document.documentElement.getAttribute("data-theme") !== "light";
}

function subscribe(onStoreChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_KEY) return;
    applyTheme(e.newValue !== "light");
    onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_EVENT, onStoreChange);
  };
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const dark = useSyncExternalStore(subscribe, readDark, () => true);
  const tk = useMemo(() => getTheme(dark), [dark]);

  const toggleTheme = useCallback(() => {
    const nextDark = document.documentElement.getAttribute("data-theme") !== "dark";
    applyTheme(nextDark);
    try {
      localStorage.setItem(THEME_KEY, nextDark ? "dark" : "light");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const value = useMemo(
    () => ({ dark, tk, toggleTheme }),
    [dark, tk, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
