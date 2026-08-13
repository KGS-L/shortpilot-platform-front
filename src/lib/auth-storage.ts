const ACCESS_TOKEN_KEY = "shortpilot_access_token";
const REFRESH_TOKEN_KEY = "shortpilot_refresh_token";
const WORKSPACE_KEY = "shortpilot_workspace_id";

function browserStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

export const authStorage = {
  getAccessToken: () => browserStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null,
  getWorkspaceId: () => browserStorage()?.getItem(WORKSPACE_KEY) ?? null,
  setWorkspaceId: (workspaceId: string) => browserStorage()?.setItem(WORKSPACE_KEY, workspaceId),
  clearSession: () => {
    const storage = browserStorage();
    storage?.removeItem(ACCESS_TOKEN_KEY);
    storage?.removeItem(REFRESH_TOKEN_KEY);
    storage?.removeItem(WORKSPACE_KEY);
  },
};
