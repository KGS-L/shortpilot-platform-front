import { apiRequest } from "@/lib/api-client";
import type { CheckoutResponse, CheckoutStart, CreditEntry, CreditSummary, Plan, UsageSummary } from "./types";

export const billingApi = {
  listPlans: () => apiRequest<Plan[]>("/v1/billing/plans"),

  creditSummary: (workspaceId: string, token: string) =>
    apiRequest<CreditSummary>(`/v1/workspaces/${workspaceId}/billing/credits`, {}, token),

  creditHistory: (workspaceId: string, token: string) =>
    apiRequest<CreditEntry[]>(`/v1/workspaces/${workspaceId}/billing/credits/history?limit=50`, {}, token),

  usage: (workspaceId: string, token: string) =>
    apiRequest<UsageSummary>(`/v1/workspaces/${workspaceId}/billing/usage`, {}, token),

  checkout: (workspaceId: string, body: CheckoutStart, token: string) =>
    apiRequest<CheckoutResponse>(`/v1/workspaces/${workspaceId}/billing/checkout`, {
      method: "POST",
      headers: { "X-Idempotency-Key": crypto.randomUUID() },
      body: JSON.stringify(body),
    }, token),

  portal: (workspaceId: string, token: string) =>
    apiRequest<{ url: string }>(`/v1/workspaces/${workspaceId}/billing/portal`, {
      method: "POST",
    }, token),
};
