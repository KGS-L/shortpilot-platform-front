import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import { publicEnv } from "@/lib/env";
import { getSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription = "Collez un lien. Recevez un Short raconté — histoire nouvelle, voix off — publié sur vos 4 réseaux. 3 créations offertes, sans carte bancaire.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "Omnelyo",
  title: { default: "Omnelyo — La vidéo qui raconte", template: "%s · Omnelyo" },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Omnelyo",
    title: "Omnelyo — La vidéo qui raconte",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Omnelyo — La vidéo qui raconte",
    description: siteDescription,
  },
  robots: publicEnv.NEXT_PUBLIC_ENVIRONMENT === "production" && publicEnv.NEXT_PUBLIC_INDEXING_ENABLED === "true"
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col"><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
