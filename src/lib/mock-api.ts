export const wait = (ms = 600) => new Promise((r) => setTimeout(r, ms));

/**
 * Tiny module-level store for mock data, so list pages and detail pages see the same
 * records while you navigate (plain useState would reset on every navigation).
 * Delete when the real API / TanStack Query is in place.
 */
export function createListStore<T>(initial: T[]) {
  let items = initial;
  const listeners = new Set<() => void>();
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => items,
    set(next: T[]) {
      items = next;
      listeners.forEach((l) => l());
    },
  };
}