export const queryKeys = {
  session: ["session"] as const,
  user: ["session", "user"] as const,
  workspaces: ["session", "workspaces"] as const,
  contents: {
    all: ["contents"] as const,
    videos: (workspaceId: string) => ["contents", workspaceId, "videos"] as const,
    mediaAssets: (workspaceId: string) => ["contents", workspaceId, "media-assets"] as const,
  },
};
