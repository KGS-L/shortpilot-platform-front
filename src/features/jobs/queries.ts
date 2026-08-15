"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authStorage } from "@/lib/auth-storage";
import { jobsApi } from "./api";

const jobsKey = (workspaceId: string, status?: string) => ["workspaces", workspaceId, "jobs", status ?? "all"] as const;

export function useWorkspaceJobs(workspaceId: string, status?: string) {
  return useQuery({
    queryKey: jobsKey(workspaceId, status),
    queryFn: () => jobsApi.list(workspaceId, authStorage.getAccessToken() as string, status ? { status } : undefined),
    enabled: Boolean(workspaceId && authStorage.getAccessToken()),
  });
}

export function useJobAction(workspaceId: string) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId, "jobs"] });
  const cancel = useMutation({
    mutationFn: (jobId: string) => jobsApi.cancel(workspaceId, jobId, authStorage.getAccessToken() as string),
    onSuccess: invalidate,
  });
  const retry = useMutation({
    mutationFn: (jobId: string) => jobsApi.retry(workspaceId, jobId, authStorage.getAccessToken() as string),
    onSuccess: invalidate,
  });
  return { cancel, retry };
}

export const jobStatusLabels: Record<string, string> = {
  queued: "En attente",
  running: "En cours",
  succeeded: "Réussi",
  failed: "Échec",
  cancelled: "Annulé",
};

export const jobTypeLabels: Record<string, string> = {
  ingest: "Import",
  process: "Traitement",
  render: "Rendu",
  publish: "Publication",
};
