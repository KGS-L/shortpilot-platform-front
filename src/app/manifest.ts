import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Omnelyo — La vidéo qui raconte.",
    short_name: "Omnelyo",
    description: "Collez un lien. Recevez un Short raconté — histoire nouvelle, voix off — publié sur vos 4 réseaux.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBFAF6",
    theme_color: "#172033",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
