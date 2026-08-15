import { apiRequest } from "@/lib/api-client";

export type AuditEvent = {
  id: string;
  workspace_id: string;
  actor_user_id: string | null;
  action: string;
  resource_path: string;
  request_id: string | null;
  response_status: number | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export const auditApi = {
  list: (workspaceId: string, token: string) =>
    apiRequest<AuditEvent[]>(`/v1/workspaces/${workspaceId}/audit-events?limit=50`, {}, token),
};
