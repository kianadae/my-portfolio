"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-NZ", {
  timeZone: "Pacific/Auckland",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export default function AucklandClock({ color }: { color: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!time) return <span style={{ color, letterSpacing: "0.16em" }}>—</span>;

  return (
    <time dateTime={time} style={{ color, fontVariantNumeric: "tabular-nums", letterSpacing: "0.16em" }}>
      {time} AKL
    </time>
  );
}
