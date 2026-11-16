export function getTheme(dark: boolean) {
  return {
    bg:             dark ? "#080808"                 : "#f5f3ef",
    bgAlt:          dark ? "#101010"                 : "#efece6",
    text:           dark ? "#ffffff"                 : "#0a0a0a",
    textDim:        dark ? "rgba(255,255,255,0.5)"   : "rgba(0,0,0,0.5)",
    textDimmer:     dark ? "rgba(255,255,255,0.2)"   : "rgba(0,0,0,0.25)",
    textFaint:      dark ? "rgba(255,255,255,0.1)"   : "rgba(0,0,0,0.12)",
    border:         dark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.1)",
    borderHover:    dark ? "rgba(255,255,255,0.2)"   : "rgba(0,0,0,0.25)",
    navBg:          dark ? "rgba(8,8,8,0.88)"        : "rgba(245,243,239,0.88)",
    ghostText:      dark ? "rgba(255,255,255,0.022)" : "rgba(0,0,0,0.04)",
    logoFilter:     dark ? "invert(1)"               : "invert(0)",
    progressBar:    dark ? "white"                   : "#0a0a0a",
    skillHoverBg:   dark ? "white"                   : "#0a0a0a",
    skillHoverText: dark ? "#080808"                 : "#f5f3ef",
    connectDim:     dark ? "rgba(255,255,255,0.18)"  : "rgba(0,0,0,0.15)",
    accent:         dark ? "#d4c4a8"                 : "#6b4f2e",
  };
}

export type Theme = ReturnType<typeof getTheme>;
