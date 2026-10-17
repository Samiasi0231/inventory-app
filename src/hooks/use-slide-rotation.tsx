"use client";
 
import { useEffect, useState } from "react";
 
/**
 * Auto-advances an active slide index.
 * Uses a timeout keyed on `active`, so the full interval always elapses after
 * any change — including a manual selection. Respects prefers-reduced-motion.
 */
export function useSlideRotation(count: number, interval = 5000, initial = 0) {
  const [active, setActive] = useState(initial);
 
  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
 
    const id = window.setTimeout(() => setActive((i) => (i + 1) % count), interval);
    return () => window.clearTimeout(id);
  }, [active, count, interval]);
 
  return { active, setActive };
}