import { apiRequest, parseApiError } from "@/lib/api-client";
import { publicEnv } from "@/lib/env";
import type { IngestJob, MediaAsset, UploadProgress, Video } from "./types";

export const contentApi = {
  listVideos: (workspaceId: string, token: string) =>
    apiRequest<Video[]>(`/v1/workspaces/${workspaceId}/videos?limit=100`, {}, token),

  listMediaAssets: (workspaceId: string, token: string) =>
    apiRequest<MediaAsset[]>(`/v1/workspaces/${workspaceId}/media-assets?limit=100`, {}, token),

  importUrl: (workspaceId: string, sourceUrl: string, title: string | null, token: string) =>
    apiRequest<IngestJob>(`/v1/workspaces/${workspaceId}/jobs`, {
      method: "POST",
      body: JSON.stringify({
        type: "ingest",
        payload: { source_url: sourceUrl, ...(title ? { title } : {}) },
      }),
    }, token),

  upload: (
    workspaceId: string,
    file: File,
    token: string,
    onProgress: (progress: UploadProgress) => void,
  ) => new Promise<Video | MediaAsset>((resolve, reject) => {
    const isImage = file.type.startsWith("image/");
    const resource = isImage ? "media-assets" : "videos";
    const request = new XMLHttpRequest();
    request.open("POST", `${publicEnv.NEXT_PUBLIC_API_URL}/v1/workspaces/${workspaceId}/${resource}/upload`);
    request.setRequestHeader("Authorization", `Bearer ${token}`);
    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      onProgress({ loaded: event.loaded, total: event.total, percent: Math.round((event.loaded / event.total) * 100) });
    });
    request.addEventListener("load", async () => {
      if (request.status >= 200 && request.status < 300) {
        try {
          resolve(JSON.parse(request.responseText) as Video | MediaAsset);
        } catch {
          reject(new Error("La réponse de l’API est illisible."));
        }
        return;
      }
      reject(await parseApiError(new Response(request.responseText, {
        status: request.status,
        headers: { "Content-Type": request.getResponseHeader("Content-Type") ?? "application/json" },
      })));
    });
    request.addEventListener("error", () => reject(new Error("Connexion à l’API impossible pendant l’envoi.")));
    request.addEventListener("abort", () => reject(new Error("L’envoi a été annulé.")));
    const body = new FormData();
    body.append("file", file);
    request.send(body);
  }),
};
