import { ImageResponse } from "next/og";
import { site } from "../lib/site";

export const alt = "Dwell app preview";
export const size = {
  width: 1200,
  height: 630,
};
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
          justifyContent: "center",
          gap: 44,
          padding: "72px 88px",
          background: "#0e1116",
          color: "#e8eaed",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            width: 132,
            height: 132,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a73e8",
            borderRadius: 30,
          }}
        >
          <svg width="82" height="82" viewBox="0 0 82 82" fill="none">
            <circle cx="41" cy="41" r="31" stroke="#ffffff" strokeWidth="7" />
            <path
              d="M41 20v24l17 11"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 92, lineHeight: 1, fontWeight: 800, letterSpacing: 0 }}>
            {site.name}
          </div>
          <div style={{ maxWidth: 830, color: "#c7cbd1", fontSize: 38, lineHeight: 1.35 }}>
            Arrive at a pinned place and your countdown starts automatically.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
