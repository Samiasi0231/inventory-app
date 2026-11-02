"use client";
// The forgot-password flow spans three pages (email -> code -> new password). It used to live only
// in React memory (the onboarding context), so ANY full page reload wiped it and the guards sent the
// user back to the start. This keeps the email and the emailed code in sessionStorage instead:
// it survives reloads and dev-server refreshes, and it disappears when the tab is closed.

import { useSyncExternalStore } from "react";

export interface ForgotFlowState {
  email: string;
  /** The 6-digit code from the email. It is the `token` for reset_password_confirm. */
  code: string | null;
}

const KEY = "riinox.forgot-flow";
const EMPTY: ForgotFlowState = { email: "", code: null };
const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedValue: ForgotFlowState = EMPTY;

/** Stable reference between changes, as useSyncExternalStore requires. */
function getSnapshot(): ForgotFlowState {
  if (typeof window === "undefined") return EMPTY;

  let raw: string | null = null;
  try {
    raw = window.sessionStorage.getItem(KEY);
  } catch {
    raw = null;
  }

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<ForgotFlowState>) } : EMPTY;
    } catch {
      cachedValue = EMPTY;
    }
  }
  return cachedValue;
}

function getServerSnapshot(): ForgotFlowState {
  return EMPTY;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function write(state: ForgotFlowState) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
  emit();
}

export const forgotFlow = {
  /** Always read the latest value (in event handlers and effects). */
  get: getSnapshot,

  /** A new "send me a code" request starts the flow over and drops any earlier code. */
  start(email: string) {
    write({ email, code: null });
  },

  setCode(code: string) {
    write({ ...getSnapshot(), code });
  },

  clear() {
    try {
      window.sessionStorage.removeItem(KEY);
    } catch {
      /* storage unavailable */
    }
    emit();
  },
};

/** For rendering (e.g. "code sent to ..."). */
export function useForgotFlow(): ForgotFlowState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}