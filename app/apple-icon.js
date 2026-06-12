import { ImageResponse } from "next/og";

export const alt = "Dwell app icon";
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a73e8",
          borderRadius: 40,
        }}
      >
        <svg width="112" height="112" viewBox="0 0 112 112" fill="none">
          <circle cx="56" cy="56" r="41" stroke="#ffffff" strokeWidth="10" />
          <path
            d="M56 29v30l21 13"
            stroke="#ffffff"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
