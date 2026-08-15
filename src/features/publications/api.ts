import { apiRequest } from "@/lib/api-client";
import type { Job } from "@/features/jobs/types";
import type { Publication, PublicationBatchCreate, PublicationStatus } from "./types";

export const publicationsApi = {
  list: (workspaceId: string, token: string, status?: PublicationStatus) => {
    const params = new URLSearchParams({ limit: "100" });
    if (status) params.set("status", status);
    return apiRequest<Publication[]>(`/v1/workspaces/${workspaceId}/publications?${params}`, {}, token);
  },

  createBatch: (workspaceId: string, body: PublicationBatchCreate, token: string) =>
    apiRequest<Publication[]>(`/v1/workspaces/${workspaceId}/publications/batch`, {
      method: "POST",
      body: JSON.stringify(body),
    }, token),

  batchPublish: (workspaceId: string, publicationIds: string[], token: string) =>
    apiRequest<Job[]>(`/v1/workspaces/${workspaceId}/publications/batch/publish`, {
      method: "POST",
      body: JSON.stringify({ publication_ids: publicationIds }),
    }, token),

  cancel: (workspaceId: string, publicationId: string, token: string) =>
    apiRequest<Publication>(`/v1/workspaces/${workspaceId}/publications/${publicationId}/cancel`, {
      method: "POST",
    }, token),

  publish: (workspaceId: string, publicationId: string, token: string) =>
    apiRequest<Job>(`/v1/workspaces/${workspaceId}/publications/${publicationId}/publish`, {
      method: "POST",
    }, token),

  update: (
    workspaceId: string,
    publicationId: string,
    body: { title?: string; description?: string | null; visibility?: string; scheduled_at?: string | null },
    token: string,
  ) =>
    apiRequest<Publication>(`/v1/workspaces/${workspaceId}/publications/${publicationId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }, token),
};
