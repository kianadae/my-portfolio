"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type Lenis from "lenis";
import { STORAGE_KEY, type MotionPref } from "@/lib/motion";

type MotionContextValue = {
  enabled: boolean
  setEnabled: (next: boolean) => void
  toggle: () => void
  isTouch: boolean
  scrollTo: (target: string | HTMLElement | number, opts?: { immediate?: boolean }) => void
  setLenis: (instance: Lenis | null) => void
  lockScroll: (locked: boolean) => void
};

const MotionContext = createContext<MotionContextValue | null>(null);
const MOTION_EVENT = "ca-motion";

export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error("useMotion must be used within MotionProvider");
  return ctx;
}

function readPref(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as MotionPref | null;
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {
    /* ignore */
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(MOTION_EVENT, onStoreChange);
  return () => {
    mq.removeEventListener("change", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(MOTION_EVENT, onStoreChange);
  };
}

function subscribeTouch(onStoreChange: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", onStoreChange);
  window.addEventListener("resize", onStoreChange);
  return () => {
    mq.removeEventListener("change", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getTouch() {
  return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
}

export default function MotionProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(subscribeMotion, readPref, () => true);
  const isTouch = useSyncExternalStore(subscribeTouch, getTouch, () => false);
  const lenisRef = useRef<Lenis | null>(null);

  const applyClass = useCallback((on: boolean) => {
    document.documentElement.classList.toggle("motion-off", !on);
    document.documentElement.classList.toggle("motion-on", on);
  }, []);

  const setEnabled = useCallback((next: boolean) => {
    applyClass(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(MOTION_EVENT));
  }, [applyClass]);

  const toggle = useCallback(() => setEnabled(!enabled), [enabled, setEnabled]);

  useEffect(() => {
    applyClass(enabled);
    document.documentElement.style.scrollBehavior = enabled ? "auto" : "smooth";
  }, [enabled, applyClass]);

  const setLenis = useCallback((instance: Lenis | null) => {
    lenisRef.current = instance;
  }, []);

  const scrollTo = useCallback<MotionContextValue["scrollTo"]>((target, opts) => {
    const lenis = lenisRef.current;
    if (lenis && enabled) {
      lenis.scrollTo(target, { immediate: opts?.immediate ?? false, duration: 1.1, offset: -80 });
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: enabled ? "smooth" : "auto" });
      return;
    }
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: enabled ? "smooth" : "auto", block: "start" });
  }, [enabled]);

  const lockScroll = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (locked) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = locked ? "hidden" : "";
  }, []);

  const value = useMemo(
    () => ({ enabled, setEnabled, toggle, isTouch, scrollTo, setLenis, lockScroll }),
    [enabled, setEnabled, toggle, isTouch, scrollTo, setLenis, lockScroll],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
