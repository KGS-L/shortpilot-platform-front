"use client";

import { useQuery } from "@tanstack/react-query";
import { authStorage } from "@/lib/auth-storage";
import { queryKeys } from "@/lib/query-keys";
import { channelsApi } from "./api";

export function useChannels(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.channels(workspaceId),
    queryFn: () => channelsApi.list(workspaceId, authStorage.getAccessToken() as string),
    enabled: Boolean(workspaceId && authStorage.getAccessToken()),
  });
}

export function useConnectedChannels(workspaceId: string) {
  const query = useChannels(workspaceId);
  return { ...query, data: (query.data ?? []).filter((channel) => channel.status === "active") };
}
