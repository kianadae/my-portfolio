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
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motionConfig, STORAGE_KEY, type MotionPref } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

type MotionContextValue = {
  enabled: boolean
  setEnabled: (next: boolean) => void
  toggle: () => void
  isTouch: boolean
  scrollTo: (target: string | HTMLElement | number, opts?: { immediate?: boolean }) => void
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
  }, [enabled, applyClass]);

  useEffect(() => {
    if (!enabled) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.documentElement.style.scrollBehavior = "smooth";
      return;
    }

    document.documentElement.style.scrollBehavior = "auto";
    const touch = window.matchMedia("(pointer: coarse)").matches;

    let lenis: Lenis | null = null;
    let tickerFn: ((time: number) => void) | null = null;

    if (!touch) {
      lenis = new Lenis({ lerp: motionConfig.lenisLerp, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tickerFn = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    } else {
      lenisRef.current = null;
    }

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [enabled]);

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

  const value = useMemo(
    () => ({ enabled, setEnabled, toggle, isTouch, scrollTo }),
    [enabled, setEnabled, toggle, isTouch, scrollTo],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
