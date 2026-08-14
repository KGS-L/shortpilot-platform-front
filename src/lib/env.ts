import { z } from "zod";

export const publicEnv = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8000"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "staging", "production", "test"]).default("development"),
  NEXT_PUBLIC_INDEXING_ENABLED: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().default(""),
}).parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  NEXT_PUBLIC_INDEXING_ENABLED: process.env.NEXT_PUBLIC_INDEXING_ENABLED,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
});
