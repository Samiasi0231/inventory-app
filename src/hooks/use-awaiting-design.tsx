"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/toast";

/** Returns a notifier for actions whose screen or flow has no design yet. */
export function useAwaitingDesign() {
  const toast = useToast();

  return useCallback(
    (feature: string) =>
      toast.add({
        type: "info",
        title: "Waiting for designers",
        description: `${feature} hasn't been designed yet.`,
      }),
    [toast],
  );
}
