import { ImageResponse } from "next/og";

export const alt = "Omnelyo — La vidéo qui raconte.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: 80, background: "#FBFAF6", color: "#172033" }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 104, fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.05em" }}>
          <div style={{ display: "flex" }}>La vidéo</div>
          <div style={{ display: "flex" }}>qui&nbsp;<span style={{ borderBottom: "16px solid #A3E635", paddingBottom: 4 }}>raconte</span>.</div>
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em" }}>Omnelyo<span style={{ color: "#F97316" }}>.</span></div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 24, lineHeight: 1.4, color: "#475569", maxWidth: 920 }}>Collez un lien. Recevez un Short raconté — histoire nouvelle, voix off, publié sur vos 4 réseaux.</div>
      </div>
    ),
    size,
  );
}
