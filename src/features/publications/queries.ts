"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authStorage } from "@/lib/auth-storage";
import { queryKeys } from "@/lib/query-keys";
import { publicationsApi } from "./api";
import type { PublicationBatchCreate, PublicationStatus } from "./types";

export function usePublications(workspaceId: string, status?: PublicationStatus) {
  return useQuery({
    queryKey: [...queryKeys.publications(workspaceId), status ?? "all"],
    queryFn: () => publicationsApi.list(workspaceId, authStorage.getAccessToken() as string, status),
    enabled: Boolean(workspaceId && authStorage.getAccessToken()),
  });
}

function useInvalidatePublications(workspaceId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.publications(workspaceId) });
}

export function useCreatePublications(workspaceId: string) {
  const invalidate = useInvalidatePublications(workspaceId);
  return useMutation({
    mutationFn: (body: PublicationBatchCreate) =>
      publicationsApi.createBatch(workspaceId, body, authStorage.getAccessToken() as string),
    onSuccess: invalidate,
  });
}

export function useBatchPublishPublications(workspaceId: string) {
  const invalidate = useInvalidatePublications(workspaceId);
  return useMutation({
    mutationFn: (publicationIds: string[]) =>
      publicationsApi.batchPublish(workspaceId, publicationIds, authStorage.getAccessToken() as string),
    onSuccess: invalidate,
  });
}

export function useCancelPublication(workspaceId: string) {
  const invalidate = useInvalidatePublications(workspaceId);
  return useMutation({
    mutationFn: (publicationId: string) =>
      publicationsApi.cancel(workspaceId, publicationId, authStorage.getAccessToken() as string),
    onSuccess: invalidate,
  });
}

export function usePublishPublication(workspaceId: string) {
  const invalidate = useInvalidatePublications(workspaceId);
  return useMutation({
    mutationFn: (publicationId: string) =>
      publicationsApi.publish(workspaceId, publicationId, authStorage.getAccessToken() as string),
    onSuccess: invalidate,
  });
}
