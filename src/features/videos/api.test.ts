import { afterEach, describe, expect, it, vi } from "vitest";
import { publicEnv } from "@/lib/env";
import { contentApi } from "./api";

afterEach(() => vi.unstubAllGlobals());

describe("contentApi", () => {
  it("liste les deux collections réelles du workspace", async () => {
    const fetchMock = vi.fn().mockImplementation(async () => new Response("[]", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetchMock);

    await Promise.all([
      contentApi.listVideos("workspace-1", "token"),
      contentApi.listMediaAssets("workspace-1", "token"),
    ]);

    const baseUrl = publicEnv.NEXT_PUBLIC_API_URL;
    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/v1/workspaces/workspace-1/videos?limit=100`,
      expect.objectContaining({ cache: "no-store" }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/v1/workspaces/workspace-1/media-assets?limit=100`,
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("importe une URL avec un unique job ingest", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "job-1" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetchMock);

    await contentApi.importUrl("workspace-1", "https://example.com/video.mp4", "Ma vidéo", "secret-token");

    const baseUrl = publicEnv.NEXT_PUBLIC_API_URL;
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(`${baseUrl}/v1/workspaces/workspace-1/jobs`);
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("Authorization")).toBe("Bearer secret-token");
    expect(JSON.parse(init.body as string)).toEqual({
      type: "ingest",
      payload: { source_url: "https://example.com/video.mp4", title: "Ma vidéo" },
    });
  });
});
