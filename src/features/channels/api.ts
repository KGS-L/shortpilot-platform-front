import { apiRequest } from "@/lib/api-client";
import type { Channel, ChannelStatus } from "./types";

export const channelsApi = {
  list: (workspaceId: string, token: string, status?: ChannelStatus) => {
    const params = new URLSearchParams({ limit: "100" });
    if (status) params.set("status", status);
    return apiRequest<Channel[]>(`/v1/workspaces/${workspaceId}/channels?${params}`, {}, token);
  },
};
