import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (publicEnv.NEXT_PUBLIC_ENVIRONMENT === "production" && publicEnv.NEXT_PUBLIC_INDEXING_ENABLED === "true") {
    return { rules: { userAgent: "*", allow: "/" } };
  }

  return { rules: { userAgent: "*", disallow: "/" } };
}
