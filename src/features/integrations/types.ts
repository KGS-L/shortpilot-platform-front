import type { SocialPlatform } from "@/features/channels/types";

export type SocialConnectionStatus = "active" | "expired" | "revoked";

export type SocialConnection = {
  id: string;
  workspace_id: string;
  platform: SocialPlatform;
  provider_account_id: string;
  scopes: string[];
  expires_at: string | null;
  status: SocialConnectionStatus;
  last_verified_at: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SocialConnectStart = {
  authorization_url: string;
  expires_in: number;
};

export type TelegramConnection = {
  telegram_user_id: string;
  telegram_chat_id: string;
  status: "active" | "revoked";
  linked_at: string;
  revoked_at: string | null;
};

export type TelegramLink = {
  url: string;
  expires_in: number;
  instructions: string[];
};

export const connectablePlatforms: SocialPlatform[] = ["youtube", "tiktok", "instagram", "facebook"];
