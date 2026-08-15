export type SocialPlatform = "youtube" | "tiktok" | "facebook" | "instagram";

export type ChannelStatus = "active" | "disconnected" | "revoked";

export type Channel = {
  id: string;
  workspace_id: string;
  platform: SocialPlatform;
  external_id: string;
  name: string;
  handle: string | null;
  avatar_url: string | null;
  status: ChannelStatus;
  created_at: string;
  updated_at: string;
};

export const platformLabels: Record<SocialPlatform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
  instagram: "Instagram",
};
