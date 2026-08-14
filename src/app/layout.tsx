import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";
import { publicEnv } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL ?? publicEnv.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  applicationName: "Omnelyo",
  title: { default: "Omnelyo — Create once. Be everywhere.", template: "%s · Omnelyo" },
  description: "Create once. Be everywhere. Transformez vos vidéos en contenus adaptés à chaque plateforme.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Omnelyo",
    title: "Omnelyo — Create once. Be everywhere.",
    description: "Transformez vos vidéos en contenus adaptés à chaque plateforme.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omnelyo — Create once. Be everywhere.",
    description: "Transformez vos vidéos en contenus adaptés à chaque plateforme.",
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
