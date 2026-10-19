"use client";
 
import { useEffect, useState } from "react";
 
/** true while the media query matches (false on the server / first render). */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
 
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
 
  return matches;
}