"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";
import { queryKeys } from "@/lib/query-keys";
import { integrationsApi } from "./api";
import type { SocialPlatform } from "@/features/channels/types";

const hasToken = () => Boolean(authStorage.getAccessToken());
const token = () => authStorage.getAccessToken() as string;

export function useSocialConnections(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.integrations.social(workspaceId),
    queryFn: () => integrationsApi.listSocial(workspaceId, token()),
    enabled: Boolean(workspaceId) && hasToken(),
  });
}

export function useConnectSocial(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (platform: SocialPlatform) => integrationsApi.connectSocial(workspaceId, platform, token()),
    onSuccess: (start) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.social(workspaceId) });
      window.location.assign(start.authorization_url);
    },
  });
}

export function useDisconnectSocial(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (connectionId: string) => integrationsApi.disconnectSocial(workspaceId, connectionId, token()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.integrations.social(workspaceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.channels(workspaceId) });
    },
  });
}

export function useTelegramConnection(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.integrations.telegram(workspaceId),
    queryFn: async () => {
      try {
        return await integrationsApi.getTelegram(workspaceId, token());
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    enabled: Boolean(workspaceId) && hasToken(),
  });
}

export function useLinkTelegram(workspaceId: string) {
  return useMutation({
    mutationFn: () => integrationsApi.linkTelegram(workspaceId, token()),
  });
}

export function useUnlinkTelegram(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => integrationsApi.unlinkTelegram(workspaceId, token()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.integrations.telegram(workspaceId) }),
  });
}
