export const THEME_KEY = "ca-theme";

export function getTheme(dark: boolean) {
  return {
    bg: "var(--bg)",
    bgAlt: "var(--surface)",
    text: "var(--text)",
    textDim: "var(--muted)",
    textDimmer: "color-mix(in srgb, var(--muted) 78%, transparent)",
    textFaint: "color-mix(in srgb, var(--muted) 45%, transparent)",
    border: "var(--border)",
    borderHover: "color-mix(in srgb, var(--accent) 50%, transparent)",
    navBg: "color-mix(in srgb, var(--bg) 90%, transparent)",
    ghostText: "color-mix(in srgb, var(--text) 7%, transparent)",
    logoFilter: dark ? "invert(1)" : "invert(0)",
    progressBar: "var(--accent)",
    skillHoverBg: "var(--accent)",
    skillHoverText: "var(--bg)",
    connectDim: "color-mix(in srgb, var(--muted) 60%, transparent)",
    accent: "var(--accent)",
    cta: "var(--cta)",
    surface: "var(--surface)",
    muted: "var(--muted)",
  };
}

export type Theme = ReturnType<typeof getTheme>;
