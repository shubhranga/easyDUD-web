import { useEffect, useRef, useState } from "react";

/**
 * Tracks the currently-active page section using a single IntersectionObserver.
 *
 * @param sectionIds – ordered list of section `id` attributes to observe.
 *   When multiple sections intersect simultaneously the *first* id in this
 *   array wins (i.e. the topmost section in reading order).
 * @returns The `id` of the active section, or `""` if none intersect.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState<string>("");
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleRef.current.add(entry.target.id);
          } else {
            visibleRef.current.delete(entry.target.id);
          }
        }

        // Resolve: first id in the caller-provided order wins.
        const topmost = sectionIds.find((id) => visibleRef.current.has(id));
        setActiveSection(topmost ?? "");
      },
      { threshold: 0.4, rootMargin: "-10% 0px -40% 0px" },
    );

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
