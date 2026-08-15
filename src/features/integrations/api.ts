import { apiRequest } from "@/lib/api-client";
import type { SocialPlatform } from "@/features/channels/types";
import type { SocialConnection, SocialConnectStart, TelegramConnection, TelegramLink } from "./types";

export const integrationsApi = {
  listSocial: (workspaceId: string, token: string) =>
    apiRequest<SocialConnection[]>(`/v1/workspaces/${workspaceId}/integrations/social`, {}, token),

  connectSocial: (workspaceId: string, platform: SocialPlatform, token: string) =>
    apiRequest<SocialConnectStart>(`/v1/workspaces/${workspaceId}/integrations/social/${platform}/connect`, {
      method: "POST",
    }, token),

  disconnectSocial: (workspaceId: string, connectionId: string, token: string) =>
    apiRequest<void>(`/v1/workspaces/${workspaceId}/integrations/social/${connectionId}`, {
      method: "DELETE",
    }, token),

  getTelegram: (workspaceId: string, token: string) =>
    apiRequest<TelegramConnection>(`/v1/workspaces/${workspaceId}/integrations/telegram`, {}, token),

  linkTelegram: (workspaceId: string, token: string) =>
    apiRequest<TelegramLink>(`/v1/workspaces/${workspaceId}/integrations/telegram/link`, {
      method: "POST",
    }, token),

  unlinkTelegram: (workspaceId: string, token: string) =>
    apiRequest<void>(`/v1/workspaces/${workspaceId}/integrations/telegram`, {
      method: "DELETE",
    }, token),
};
