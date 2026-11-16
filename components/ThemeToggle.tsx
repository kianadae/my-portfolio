"use client";

import { motion } from "framer-motion";

export default function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <motion.button onClick={onToggle} whileTap={{ scale: 0.92 }} className="hoverable"
      style={{ position: "relative", width: "48px", height: "26px", borderRadius: "999px", border: dark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)", background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", cursor: "pointer", outline: "none", flexShrink: 0, transition: "border-color 0.4s, background 0.4s" }}
      aria-label="Toggle theme">
      <span style={{ position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)", fontSize: "9px", opacity: dark ? 0.5 : 0, transition: "opacity 0.3s", pointerEvents: "none" }}>☀️</span>
      <span style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", fontSize: "9px", opacity: dark ? 0 : 0.6, transition: "opacity 0.3s", pointerEvents: "none" }}>🌙</span>
      <motion.div animate={{ x: dark ? 24 : 2 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ position: "absolute", top: "3px", width: "18px", height: "18px", borderRadius: "50%", background: dark ? "white" : "#080808", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </motion.button>
  );
}
