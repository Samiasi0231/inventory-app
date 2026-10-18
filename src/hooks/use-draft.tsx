"use client";

import { useState } from "react";

export function useDraft<T extends object>(saved: T | undefined) {
  const [edits, setEdits] = useState<Partial<T>>({});

  return {
    value: saved ? ({ ...saved, ...edits } as T) : null,
    dirty: Object.keys(edits).length > 0,
    set<K extends keyof T>(key: K, next: T[K]) {
      setEdits((current) => ({ ...current, [key]: next }));
    },
    reset() {
      setEdits({});
    },
  };
}
