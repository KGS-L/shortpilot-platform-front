import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest } from "./api-client";

afterEach(() => vi.unstubAllGlobals());

describe("apiRequest", () => {
  it.each([
    [401, "Votre session a expiré"],
    [403, "permission"],
    [404, "introuvable"],
    [409, "conflit"],
    [422, "pas valides"],
    [429, "Trop de requêtes"],
  ])("expose un message explicite pour le statut %i", async (status, message) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status })));

    await expect(apiRequest("/test")).rejects.toMatchObject({ status, message: expect.stringContaining(message) });
  });

  it("conserve le détail métier renvoyé par FastAPI", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ detail: "Quota de stockage atteint." }),
      { status: 429, headers: { "Content-Type": "application/json" } },
    )));

    await expect(apiRequest("/test")).rejects.toEqual(new ApiError(429, "Quota de stockage atteint."));
  });

  it("aplatit les erreurs de validation FastAPI", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ detail: [{ loc: ["body", "url"], msg: "URL invalide" }] }),
      { status: 422, headers: { "Content-Type": "application/json" } },
    )));

    await expect(apiRequest("/test")).rejects.toMatchObject({ status: 422, message: "URL invalide" });
  });
});
