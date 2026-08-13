const ACCESS_TOKEN_KEY = "omnelyo_access_token";
const REFRESH_TOKEN_KEY = "omnelyo_refresh_token";
const WORKSPACE_KEY = "omnelyo_workspace_id";
const LEGACY_KEYS = {
  accessToken: "shortpilot_access_token",
  refreshToken: "shortpilot_refresh_token",
  workspace: "shortpilot_workspace_id",
} as const;

function browserStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

export const authStorage = {
  getAccessToken: () => migrateValue(ACCESS_TOKEN_KEY, LEGACY_KEYS.accessToken),
  getWorkspaceId: () => migrateValue(WORKSPACE_KEY, LEGACY_KEYS.workspace),
  setTokens: (accessToken: string, refreshToken: string) => {
    const storage = browserStorage();
    storage?.setItem(ACCESS_TOKEN_KEY, accessToken);
    storage?.setItem(REFRESH_TOKEN_KEY, refreshToken);
    storage?.removeItem(LEGACY_KEYS.accessToken);
    storage?.removeItem(LEGACY_KEYS.refreshToken);
  },
  setWorkspaceId: (workspaceId: string) => browserStorage()?.setItem(WORKSPACE_KEY, workspaceId),
  clearSession: () => {
    const storage = browserStorage();
    storage?.removeItem(ACCESS_TOKEN_KEY);
    storage?.removeItem(REFRESH_TOKEN_KEY);
    storage?.removeItem(WORKSPACE_KEY);
    Object.values(LEGACY_KEYS).forEach((key) => storage?.removeItem(key));
  },
};

function migrateValue(key: string, legacyKey: string) {
  const storage = browserStorage();
  if (!storage) return null;
  const current = storage.getItem(key);
  if (current) return current;
  const legacy = storage.getItem(legacyKey);
  if (legacy) {
    storage.setItem(key, legacy);
    storage.removeItem(legacyKey);
  }
  return legacy;
}
