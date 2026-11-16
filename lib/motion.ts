/** Tunable motion values. Tweak feel here without hunting through components. */

export const motionConfig = {
  /** Lenis smoothing. Higher = snappier, lower = heavier. */
  lenisLerp: 0.1,

  ease: {
    out: "power3.out" as const,
    expo: "expo.out" as const,
    inOut: "power2.inOut" as const,
  },

  duration: {
    fast: 0.45,
    base: 0.7,
    slow: 1.0,
    count: 1.6,
  },

  stagger: {
    chars: 0.035,
    words: 0.045,
    chips: 0.04,
    list: 0.06,
  },

  /** Transform distances in px / scale. Reduced on mobile in hooks. */
  revealY: 28,
  parallaxHero: 80,
  heroScale: 0.88,
  imageFromScale: 1.15,
  cursorLerp: 0.16,
  previewLerp: 0.12,
  magnetic: 0.28,

  /** ScrollTrigger pin distances (desktop). Mobile uses the *Mobile values. */
  pin: {
    about: "+=70%",
    aboutMobile: "+=20%",
    work: "+=420%",
    workMobile: "+=0",
  },

  marqueeSeconds: 28,
} as const;

export const STORAGE_KEY = "ca-motion";
export type MotionPref = "on" | "off";
