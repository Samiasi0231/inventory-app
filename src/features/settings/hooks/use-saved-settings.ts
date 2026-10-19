"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Local demo persistence, matching the rest of the app's mock service layer. */
export function useSavedSettings<T>(key: string, defaults: T) {
  const storageKey = `riinox:settings:${key}`;
  const snapshot = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(storageKey);
      } catch {
        return null;
      }
    },
    () => null,
  );
  let value = defaults;
  if (snapshot) {
    try {
      value = JSON.parse(snapshot) as T;
    } catch {
      /* Use defaults when saved data is invalid. */
    }
  }
  function save(next: T) {
    localStorage.setItem(storageKey, JSON.stringify(next));
    listeners.forEach((listener) => listener());
  }
  return { value, save };
}
