import { motion } from "framer-motion";
import { scrollToSection } from "@/utils/scrollTo";

interface SectionDotNavProps {
  sectionIds: string[];
  activeSection: string;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  services: "Our Services",
  offers: "What We Offer",
  pricing: "Plans & Pricing",
  download: "Download App",
};

/**
 * Floating vertical dot navigation anchored to the right side of the viewport.
 * Each dot scrolls to its section on click. The active dot is highlighted
 * and a tooltip label appears on hover.
 *
 * Hidden on mobile (< md breakpoint).
 */
export function SectionDotNav({ sectionIds, activeSection }: SectionDotNavProps) {
  return (
    <nav
      aria-label="Page sections"
      className="fixed right-4 top-1/2 z-30 hidden md:flex flex-col items-center gap-3"
      style={{ transform: "translateY(-50%)" }}
    >
      {sectionIds.map((id) => {
        const isActive = activeSection === id;
        const label = SECTION_LABELS[id] ?? id;

        return (
          <button
            key={id}
            type="button"
            aria-label={`Scroll to ${label}`}
            aria-current={isActive ? "location" : undefined}
            onClick={() => scrollToSection(id)}
            className="group relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-full"
          >
            {/* Tooltip on hover */}
            <span className="pointer-events-none absolute right-7 whitespace-nowrap rounded-lg bg-foreground/90 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-lg">
              {label}
            </span>

            {/* Dot */}
            <motion.span
              className="block rounded-full transition-all duration-300"
              animate={{
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
                backgroundColor: isActive
                  ? "rgb(59, 130, 246)"    /* blue-500 */
                  : "rgba(148, 163, 184, 0.5)", /* slate-400/50 */
                boxShadow: isActive
                  ? "0 0 12px rgba(59, 130, 246, 0.5)"
                  : "0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />

            {/* Active ring pulse */}
            {isActive && (
              <motion.span
                className="absolute rounded-full border-2 border-blue-400/40"
                initial={{ width: 12, height: 12, opacity: 0.8 }}
                animate={{ width: 22, height: 22, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
