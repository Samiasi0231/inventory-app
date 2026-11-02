import type { SetupInfo } from "./types";

/**
 * Small persisted snapshot of who is logged in. It exists because the backend has no
 * /users/me/ yet: login returns `setup_info` and `registration_complete`, and we keep
 * them so a page reload can still route the user correctly.
 */
export interface AuthSessionData {
  user: SetupInfo;
  registrationComplete: boolean;
}

const KEY = "riinox.session";
const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedValue: AuthSessionData | null = null;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Stable reference between changes, as useSyncExternalStore requires. */
function getSnapshot(): AuthSessionData | null {
  if (typeof window === "undefined") return null;
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? (JSON.parse(raw) as AuthSessionData) : null;
    } catch {
      cachedValue = null;
    }
  }
  return cachedValue;
}

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeToSession(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener(); // another tab logged in / out
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const authSession = {
  get: getSnapshot,

  set(data: AuthSessionData) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* storage unavailable */
    }
    emit();
  },

  /** e.g. authSession.patch({ registrationComplete: true }) after business onboarding. */
  patch(partial: Partial<AuthSessionData>) {
    const current = getSnapshot();
    if (current) authSession.set({ ...current, ...partial });
  },

  clear() {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
    emit();
  },
};
