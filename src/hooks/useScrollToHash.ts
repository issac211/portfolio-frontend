import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls the viewport to a `#hash` anchor whenever the URL hash changes.
 *
 * Replaces the inline `useEffect` in pages that use anchor-based navigation.
 * Waits one animation frame before scrolling so the DOM has settled after
 * React's render cycle (critical when the target section renders async data).
 *
 * @param dependency - Extra value to re-run the effect when it changes
 *   (e.g., `isLoading` — so scroll fires after skeleton resolves to real content).
 */
export function useScrollToHash(dependency?: unknown) {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = hash.slice(1); // strip leading "#"

    // rAF defers scroll until after React has committed the latest render,
    // preventing scroll targeting a not-yet-painted element.
    const raf = requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [hash, dependency]);
}
