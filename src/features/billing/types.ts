export type Plan = {
  code: string;
  name: string;
  monthly_credits: number;
  social_connections_limit: number;
  workspaces_limit: number;
  members_per_workspace_limit: number;
  concurrent_jobs_limit: number;
  source_minutes_monthly_limit: number;
  publications_monthly_limit: number;
  storage_bytes_limit: number;
  retention_days: number;
};

export type PurchaseCode = "CREATOR_MONTHLY" | "PRO_MONTHLY" | "TOPUP";

export type CreditSummary = {
  workspace_id: string;
  plan: Plan;
  balance: number;
  period_start: string;
  period_end: string;
};

export type CreditEntry = {
  id: string;
  entry_type: string;
  amount: number;
  description: string | null;
  expires_at: string | null;
  created_at: string;
};

export type UsageSummary = {
  source_seconds: number;
  source_seconds_limit: number;
  publications: number;
  publications_limit: number;
  storage_bytes: number;
  storage_bytes_limit: number;
  retention_days: number;
};

export type CheckoutStart = {
  purchase_code: PurchaseCode;
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  provider?: "dodo" | "moneyfusion";
  promo_code?: string;
};

export type CheckoutResponse = {
  payment_intent_id: string;
  checkout_url: string;
};

/** Les plans sans achat en ligne (ex. Gratuit) n'ont pas de code checkout. */
export function purchaseCodeForPlan(plan: Plan): PurchaseCode | null {
  if (plan.code === "CREATOR") return "CREATOR_MONTHLY";
  if (plan.code === "PRO") return "PRO_MONTHLY";
  return null;
}
