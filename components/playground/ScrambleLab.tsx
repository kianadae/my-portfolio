"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Theme } from "@/lib/theme";
import { useMotion } from "@/components/motion/MotionProvider";

const WORDS = ["CHRISTIAN", "WORDPRESS", "AUCKLAND", "DEVELOPER", "PLAYGROUND"];
const CHARS = "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleLab({ tk }: { tk: Theme }) {
  const { enabled } = useMotion();
  const [word, setWord] = useState(WORDS[0]);
  const [display, setDisplay] = useState(WORDS[0]);
  const [custom, setCustom] = useState("");
  const [auto, setAuto] = useState(true);
  const run = useRef(0);
  const live = useRef(word);

  const scramble = (next: string) => {
    const target = next.trim().toUpperCase().slice(0, 18) || WORDS[0];
    live.current = target;
    setWord(target);
    if (!enabled) {
      setDisplay(target);
      return;
    }
    const id = ++run.current;
    let iteration = 0;
    const tick = () => {
      if (run.current !== id) return;
      setDisplay(
        target
          .split("")
          .map((letter, i) => (i < iteration ? target[i] : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(""),
      );
      if (iteration >= target.length) return;
      iteration += 0.42;
      window.setTimeout(tick, 26);
    };
    tick();
  };

  useEffect(() => () => { run.current += 1; }, []);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => {
      const i = WORDS.indexOf(live.current);
      const next = WORDS[(i < 0 ? 0 : i + 1) % WORDS.length];
      scramble(next);
    }, 3200);
    return () => window.clearInterval(id);
    // scramble is stable enough for this interval; live.current holds the word
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, enabled]);

  const onCustom = (e: FormEvent) => {
    e.preventDefault();
    if (!custom.trim()) return;
    setAuto(false);
    scramble(custom);
  };

  return (
    <div className="lab-stage">
      <button
        type="button"
        className="display hoverable"
        onClick={() => scramble(word)}
        aria-label={`Scramble ${word}`}
        style={{
          fontSize: "clamp(2.6rem, 8vw, 6rem)",
          letterSpacing: "0.04em",
          color: tk.text,
          margin: "0 0 28px",
          minHeight: "1.15em",
          background: "none",
          border: "none",
          padding: 0,
          textAlign: "left",
          width: "100%",
        }}
      >
        {display}
      </button>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {WORDS.map((w) => (
          <button
            key={w}
            type="button"
            className="btn btn-ghost hoverable"
            onClick={() => { setAuto(false); scramble(w); }}
            aria-pressed={word === w}
            style={{ padding: "8px 14px", color: word === w ? tk.text : tk.textDim, borderColor: word === w ? tk.text : tk.border }}
          >
            {w}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-ghost hoverable"
          onClick={() => setAuto((v) => !v)}
          aria-pressed={auto}
          style={{ padding: "8px 14px", color: auto ? tk.text : tk.textDim, borderColor: auto ? tk.text : tk.border }}
        >
          Auto {auto ? "on" : "off"}
        </button>
      </div>
      <form onSubmit={onCustom} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <input
          className="lab-input hoverable"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Type a word, enter"
          maxLength={18}
          aria-label="Custom scramble word"
          style={{ color: tk.text, borderColor: tk.border }}
        />
        <button type="submit" className="btn btn-ghost hoverable" style={{ padding: "8px 14px", color: tk.textDim, borderColor: tk.border }}>
          Decode
        </button>
      </form>
    </div>
  );
}
