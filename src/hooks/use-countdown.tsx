"use client";

import { useCallback, useEffect, useState } from "react";

/** Resend-code cooldown: `start()` begins the countdown, `isRunning` disables the button. */
export function useCountdown(defaultSeconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  const start = useCallback(
    (seconds: number = defaultSeconds) => setSecondsLeft(seconds),
    [defaultSeconds],
  );

  return { secondsLeft, isRunning: secondsLeft > 0, start };
}
