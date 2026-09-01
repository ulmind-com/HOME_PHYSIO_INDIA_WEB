const STORAGE_KEYS = {
  accessToken: "hpi_web.access_token",
  refreshToken: "hpi_web.refresh_token",
};

export const tokenStore = {
  getAccess: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.accessToken);
  },
  getRefresh: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.refreshToken);
  },
  set: (access: string, refresh: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.accessToken, access);
    localStorage.setItem(STORAGE_KEYS.refreshToken, refresh);
  },
  setAccess: (access: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.accessToken, access);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
  },
};
