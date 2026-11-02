const ACCESS_KEY = "riinox.access";
const REFRESH_KEY = "riinox.refresh";

const isBrowser = () => typeof window !== "undefined";

function read(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  if (!isBrowser()) return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode / quota) */
  }
}

export const tokenStorage = {
  getAccessToken: () => read(ACCESS_KEY),
  getRefreshToken: () => read(REFRESH_KEY),
  hasSession: () => Boolean(read(ACCESS_KEY) || read(REFRESH_KEY)),

  setTokens(tokens: { access?: string; refresh?: string }) {
    if (tokens.access) write(ACCESS_KEY, tokens.access);
    if (tokens.refresh) write(REFRESH_KEY, tokens.refresh);
  },

  clearTokens() {
    write(ACCESS_KEY, null);
    write(REFRESH_KEY, null);
  },
};
