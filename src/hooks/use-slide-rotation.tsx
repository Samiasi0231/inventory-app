import { useEffect, useState } from "react";
 
/** Auto-advances an active slide index. Respects prefers-reduced-motion. */
export function useSlideRotation(count: number, interval = 5000) {
  const [active, setActive] = useState(0);
 
  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [count, interval]);
 
  return { active, setActive };
}