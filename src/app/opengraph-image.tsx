import { ImageResponse } from "next/og";

export const alt = "Omnelyo — Create once. Be everywhere.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#172033", color: "white" }}>
      <div style={{ display: "flex", fontSize: 76, fontWeight: 900 }}>Omnelyo<span style={{ color: "#84cc16" }}>.</span></div>
      <div style={{ display: "flex", marginTop: 32, maxWidth: 900, fontSize: 52, lineHeight: 1.15, fontWeight: 700 }}>Create once. Be everywhere.</div>
      <div style={{ display: "flex", marginTop: 36, fontSize: 25, color: "#cbd5e1" }}>Une création. Chaque plateforme. Votre voix.</div>
    </div>,
    size,
  );
}
