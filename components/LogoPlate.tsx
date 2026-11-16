"use client";

import Image from "next/image";

export default function LogoPlate({
  src,
  plate,
  sizes,
  className = "",
  style,
}: {
  src: string
  plate: "light" | "dark"
  sizes: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`logo-plate${plate === "dark" ? " plate-dark" : ""}${className ? ` ${className}` : ""}`}
      style={{ width: "100%", ...style }}
    >
      <Image
        src={src}
        alt=""
        width={640}
        height={320}
        sizes={sizes}
        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 24 }}
      />
    </div>
  );
}
