import { apiRequest } from "@/lib/api-client";

export const workspacesApi = {
  rename: (workspaceId: string, name: string, token: string) =>
    apiRequest<{ id: string; name: string }>(`/v1/workspaces/${workspaceId}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }, token),
};
