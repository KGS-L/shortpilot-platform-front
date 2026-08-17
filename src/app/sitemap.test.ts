import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ENV_KEYS = ["NEXT_PUBLIC_ENVIRONMENT", "NEXT_PUBLIC_INDEXING_ENABLED", "NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_APP_URL"] as const;
const savedEnv = new Map<string, string | undefined>();

/** publicEnv est parsé à l'import : on manipule process.env puis on réimporte le module. */
async function importSitemap() {
  vi.resetModules();
  const mod = await import("./sitemap");
  return mod.default;
}

beforeEach(() => {
  for (const key of ENV_KEYS) savedEnv.set(key, process.env[key]);
});

afterEach(() => {
  for (const [key, value] of savedEnv) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  savedEnv.clear();
});

describe("sitemap.ts — maillage interne conditionnel", () => {
  it("prod + indexation activée : exactement 6 URLs préfixées par la base", async () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = "production";
    process.env.NEXT_PUBLIC_INDEXING_ENABLED = "true";
    process.env.NEXT_PUBLIC_SITE_URL = "https://omnelyo.com";
    const sitemap = await importSitemap();
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://omnelyo.com/",
      "https://omnelyo.com/partners",
      "https://omnelyo.com/legal/mentions-legales",
      "https://omnelyo.com/legal/confidentialite",
      "https://omnelyo.com/legal/conditions",
      "https://omnelyo.com/legal/cookies",
    ]);
  });

  it("env par défaut : sitemap vide (aucune URL exposée hors indexation)", async () => {
    for (const key of ENV_KEYS) delete process.env[key];
    const sitemap = await importSitemap();
    expect(sitemap()).toEqual([]);
  });
});
