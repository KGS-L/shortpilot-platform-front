import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ENV_KEYS = ["NEXT_PUBLIC_ENVIRONMENT", "NEXT_PUBLIC_INDEXING_ENABLED", "NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_APP_URL"] as const;
const savedEnv = new Map<string, string | undefined>();

/** publicEnv est parsé à l'import : on manipule process.env puis on réimporte le module. */
async function importRobots() {
  vi.resetModules();
  const mod = await import("./robots");
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

describe("robots.ts — indexation conditionnelle", () => {
  it("prod + indexation activée : Allow / + ligne Sitemap sur l'URL de production", async () => {
    process.env.NEXT_PUBLIC_ENVIRONMENT = "production";
    process.env.NEXT_PUBLIC_INDEXING_ENABLED = "true";
    process.env.NEXT_PUBLIC_SITE_URL = "https://omnelyo.com";
    const robots = await importRobots();
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://omnelyo.com/sitemap.xml",
    });
  });

  it("env par défaut : Disallow / et aucune propriété sitemap", async () => {
    for (const key of ENV_KEYS) delete process.env[key];
    const robots = await importRobots();
    const output = robots();
    expect(output.rules).toEqual({ userAgent: "*", disallow: "/" });
    expect("sitemap" in output).toBe(false);
  });
});
