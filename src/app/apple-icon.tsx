import { ImageResponse } from "next/og";

// Honest Menensoft monogram in the site's accent — not a final logo mark.
export const size = { width: 180, height: 180 };
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
          background: "#0a0a0b",
          color: "#8b8cf8",
          fontSize: 96,
          fontWeight: 700,
          letterSpacing: -3,
          fontFamily: "sans-serif",
        }}
      >
        M
      </div>
    ),
    { ...size },
  );
}
