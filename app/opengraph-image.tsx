import { ImageResponse } from "next/og";

export const alt = "Christian Ada — WordPress Developer in Auckland";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "#000000",
          padding: 72,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 280,
            height: 8,
            background: "#FFFFFF",
          }}
        />
        <div
          style={{
            color: "#D4D4D9",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          WordPress Developer
        </div>
        <div
          style={{
            color: "#F5F5F7",
            fontSize: 88,
            lineHeight: 0.9,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          CHRISTIAN ADA
        </div>
        <div
          style={{
            color: "#888888",
            fontSize: 26,
            marginTop: 28,
          }}
        >
          Auckland, NZ · WordPress · Integrations · QA
        </div>
      </div>
    ),
    { ...size },
  );
}
