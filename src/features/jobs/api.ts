import { apiRequest } from "@/lib/api-client";
import type { Job, JobType } from "./types";

export const jobsApi = {
  list: (workspaceId: string, token: string, params?: { status?: string; type?: JobType }) => {
    const search = new URLSearchParams({ limit: "100" });
    if (params?.status) search.set("status", params.status);
    if (params?.type) search.set("type", params.type);
    return apiRequest<Job[]>(`/v1/workspaces/${workspaceId}/jobs?${search}`, {}, token);
  },

  create: (
    workspaceId: string,
    body: { type: JobType; video_id?: string; payload?: Record<string, unknown> },
    token: string,
  ) =>
    apiRequest<Job>(`/v1/workspaces/${workspaceId}/jobs`, {
      method: "POST",
      body: JSON.stringify(body),
    }, token),

  cancel: (workspaceId: string, jobId: string, token: string) =>
    apiRequest<Job>(`/v1/workspaces/${workspaceId}/jobs/${jobId}/cancel`, { method: "POST" }, token),

  retry: (workspaceId: string, jobId: string, token: string) =>
    apiRequest<Job>(`/v1/workspaces/${workspaceId}/jobs/${jobId}/retry`, { method: "POST" }, token),
};
