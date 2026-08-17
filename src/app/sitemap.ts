import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (publicEnv.NEXT_PUBLIC_ENVIRONMENT !== "production" || publicEnv.NEXT_PUBLIC_INDEXING_ENABLED !== "true") {
    return [];
  }

  const baseUrl = new URL(getSiteUrl());
  const lastModified = new Date();
  return [
    { url: new URL("/", baseUrl).toString(), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: new URL("/partners", baseUrl).toString(), lastModified, changeFrequency: "monthly", priority: 0.5 },
    ...(["mentions-legales", "confidentialite", "conditions", "cookies"] as const).map((slug) => ({
      url: new URL(`/legal/${slug}`, baseUrl).toString(),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
