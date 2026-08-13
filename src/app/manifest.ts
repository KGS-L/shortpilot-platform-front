import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Omnelyo — Create once. Be everywhere.",
    short_name: "Omnelyo",
    description: "Create once. Be everywhere. Transformez vos vidéos en contenus adaptés à chaque plateforme.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7fb",
    theme_color: "#172033",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
