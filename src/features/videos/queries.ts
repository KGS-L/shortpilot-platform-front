"use client";

import { useQuery } from "@tanstack/react-query";
import { authStorage } from "@/lib/auth-storage";
import { queryKeys } from "@/lib/query-keys";
import { contentApi } from "./api";

export function useVideos(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.contents.videos(workspaceId),
    queryFn: () => contentApi.listVideos(workspaceId, authStorage.getAccessToken() as string),
    enabled: Boolean(workspaceId && authStorage.getAccessToken()),
  });
}

export function useMediaAssets(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.contents.mediaAssets(workspaceId),
    queryFn: () => contentApi.listMediaAssets(workspaceId, authStorage.getAccessToken() as string),
    enabled: Boolean(workspaceId && authStorage.getAccessToken()),
  });
}
