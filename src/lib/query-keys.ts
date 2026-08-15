export const queryKeys = {
  session: ["session"] as const,
  user: ["session", "user"] as const,
  workspaces: ["session", "workspaces"] as const,
  contents: {
    all: ["contents"] as const,
    videos: (workspaceId: string) => ["contents", workspaceId, "videos"] as const,
    mediaAssets: (workspaceId: string) => ["contents", workspaceId, "media-assets"] as const,
  },
  channels: (workspaceId: string) => ["workspaces", workspaceId, "channels"] as const,
  publications: (workspaceId: string) => ["workspaces", workspaceId, "publications"] as const,
  integrations: {
    social: (workspaceId: string) => ["workspaces", workspaceId, "integrations", "social"] as const,
    telegram: (workspaceId: string) => ["workspaces", workspaceId, "integrations", "telegram"] as const,
  },
  billing: {
    plans: ["billing", "plans"] as const,
    credits: (workspaceId: string) => ["workspaces", workspaceId, "billing", "credits"] as const,
    creditsHistory: (workspaceId: string) => ["workspaces", workspaceId, "billing", "credits-history"] as const,
    usage: (workspaceId: string) => ["workspaces", workspaceId, "billing", "usage"] as const,
  },
};
