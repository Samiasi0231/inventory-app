import { useCallback, useEffect, useState } from "react";
 
export function useCountdown(initial = 0) {
  const [seconds, setSeconds] = useState(initial);
 
  useEffect(() => {
    if (seconds <= 0) return;
    const id = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds]);
 
  const start = useCallback((value: number) => setSeconds(value), []);
 
  return { seconds, start };
}