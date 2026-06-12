import { ImageResponse } from "next/og";

export const alt = "Dwell clock icon";
export const size = {
  width: 512,
  height: 512,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 112,
        }}
      >
        <svg width="320" height="320" viewBox="0 0 320 320" fill="none">
          <circle cx="160" cy="160" r="118" stroke="#ffffff" strokeWidth="28" />
          <path
            d="M160 82v86l60 38"
            stroke="#ffffff"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
