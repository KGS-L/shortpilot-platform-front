import { publicEnv } from "@/lib/env";

/** URL racine du site (avec slash final) : domaine public d'abord, puis URL d'app, puis local. */
export function getSiteUrl(): string {
  return new URL("/", publicEnv.NEXT_PUBLIC_SITE_URL ?? publicEnv.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").toString();
}
