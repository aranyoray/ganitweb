import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GanitAR — Math you can walk around";
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
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #FFF8EE 0%, #FFE4B5 55%, #FFD66B 100%)",
          color: "#18324A",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            opacity: 0.7,
          }}
        >
          GanitAR
        </div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            fontSize: 108,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          <span>Math you can</span>
          <span>walk around.</span>
        </div>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            fontSize: 32,
            color: "#73675C",
            maxWidth: 900,
          }}
        >
          Tap piles to combine, scan or speak a problem, print a worksheet.
          On-device AR math for iPhone &amp; iPad. Free.
        </div>
      </div>
    ),
    size,
  );
}
