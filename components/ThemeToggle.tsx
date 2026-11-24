"use client";

export default function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="theme-toggle hoverable"
      onClick={onToggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
    >
      <span className="theme-toggle-sun" aria-hidden="true">☀️</span>
      <span className="theme-toggle-moon" aria-hidden="true">🌙</span>
      <span className="theme-toggle-knob" aria-hidden="true" />
    </button>
  );
}
