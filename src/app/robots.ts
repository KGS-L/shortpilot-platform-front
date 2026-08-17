import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (publicEnv.NEXT_PUBLIC_ENVIRONMENT === "production" && publicEnv.NEXT_PUBLIC_INDEXING_ENABLED === "true") {
    return {
      rules: { userAgent: "*", allow: "/" },
      sitemap: new URL("sitemap.xml", getSiteUrl()).toString(),
    };
  }

  return { rules: { userAgent: "*", disallow: "/" } };
}
