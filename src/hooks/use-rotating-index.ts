import { useEffect, useState } from "react";

/**
 * Cycles through items[] every intervalMs. Pauses when document is hidden,
 * resets cleanly when items change, and skips work for single-item arrays.
 */
export function useRotatingIndex(length: number, intervalMs = 4000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) return;
    setIndex(0);
    let id: number | undefined;
    const start = () => {
      id = window.setInterval(
        () => setIndex((p) => (p + 1) % length),
        intervalMs,
      );
    };
    const stop = () => {
      if (id !== undefined) window.clearInterval(id);
      id = undefined;
    };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [length, intervalMs]);

  return index;
}
