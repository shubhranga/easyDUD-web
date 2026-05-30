import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CarTaxiFront,
  Bus,
  Plane,
  Car,
  Hotel,
  Bike,
  type LucideIcon,
} from "lucide-react";

export type BookingCategory =
  | "taxi"
  | "bus"
  | "flight"
  | "hotel"
  | "bike"
  | "auto";

export type BookingSection = "ondemand" | "hotels" | "travel";

type Item = {
  id: BookingCategory;
  label: string;
  to: string;
  Icon: LucideIcon;
};

type SectionGroup = {
  section: BookingSection;
  label: string;
  items: Item[];
};

const sectionGroups: SectionGroup[] = [
  {
    section: "ondemand",
    label: "On Demand",
    items: [
      { id: "taxi", label: "Driver", to: "/cab", Icon: CarTaxiFront },
      { id: "bike", label: "Bike", to: "/bike", Icon: Bike },
      { id: "auto", label: "Auto", to: "/auto", Icon: Car },
    ],
  },
  {
    section: "hotels",
    label: "Hotels",
    items: [
      { id: "hotel", label: "Hotel", to: "/hotels", Icon: Hotel },
    ],
  },
  {
    section: "travel",
    label: "Travel",
    items: [
      { id: "flight", label: "Flight", to: "/flights", Icon: Plane },
      { id: "bus", label: "Bus", to: "/bus", Icon: Bus },
      { id: "taxi", label: "Taxi", to: "/cab", Icon: CarTaxiFront },
    ],
  },
];

interface FloatingSidebarProps {
  /** Optional override; otherwise derived from current route. */
  active?: BookingCategory;
  onChange?: (id: BookingCategory) => void;
  /** Optional override; otherwise derived from current route. */
  activeSection?: BookingSection;
  onSectionChange?: (s: BookingSection) => void;
}

function deriveActive(pathname: string): BookingCategory {
  const all = sectionGroups.flatMap((g) => g.items);
  const match = all.find((i) => pathname.startsWith(i.to));
  return match?.id ?? "bus";
}

function deriveSection(pathname: string): BookingSection {
  if (pathname.startsWith("/hotels")) return "hotels";
  if (
    pathname.startsWith("/flights") ||
    pathname.startsWith("/bus") ||
    pathname.startsWith("/cab")
  )
    return "travel";
  return "ondemand"; // /bike, /auto, default
}

export function FloatingSidebar(props: FloatingSidebarProps) {
  const { active: controlled, onChange, onSectionChange } = props;
  const { pathname } = useLocation();
  const active = controlled ?? deriveActive(pathname);
  const activeSection = props.activeSection ?? deriveSection(pathname);

  return (
    // Outer wrapper handles the fixed positioning + the idle float animation
    <motion.aside
      className="fixed left-3 top-1/2 z-30 hidden md:flex flex-col"
      style={{ translateY: "-50%" }}
      // Idle float: continuously bobs up and down
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 3.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
      // On hover, lift the sidebar a bit more and scale up slightly
      whileHover={{
        y: -10,
        scale: 1.03,
        transition: {
          type: "spring",
          stiffness: 280,
          damping: 18,
        },
      }}
    >
      <div
        className="flex flex-col items-center gap-1 rounded-3xl border border-white/40 bg-white/40 backdrop-blur-xl px-2 py-3 shadow-[0_20px_60px_-20px_rgba(60,60,90,0.25),inset_0_1px_0_rgba(255,255,255,0.6)]"
        role="navigation"
        aria-label="Travel categories"
      >
        {sectionGroups.map((group) => {
          const isOpen = group.section === activeSection;
          return (
            <div
              key={group.section}
              className="flex flex-col items-center gap-0"
            >
              {/* Section divider label — only show when group is active */}
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[8px] uppercase tracking-widest text-foreground/30 font-semibold mb-1 px-1"
                  >
                    {group.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Items — collapse when section is inactive */}
              <AnimatePresence>
                {isOpen &&
                  group.items.map(({ id, label, to, Icon }) => {
                    const isActive = active === id;
                    return (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, scale: 0.85, height: 0 }}
                        animate={{ opacity: 1, scale: 1, height: "auto" }}
                        exit={{ opacity: 0, scale: 0.85, height: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      >
                        <Link
                          to={to}
                          aria-label={label}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => onChange?.(id)}
                          className="group relative flex flex-col items-center gap-0.5 px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-2xl"
                        >
                          <motion.span
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 320, damping: 22 }}
                            className="relative flex h-11 w-11 items-center justify-center rounded-2xl"
                          >
                            {/* Active background pill, animates between items */}
                            {isActive && (
                              <motion.span
                                layoutId="sidebar-active-pill"
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/15 via-indigo-500/15 to-purple-500/15 ring-1 ring-indigo-500/30 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.5)]"
                                transition={{ type: "spring", damping: 24, stiffness: 240 }}
                              />
                            )}

                            {/* Hover glow layer */}
                            <span className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10" />

                            <Icon
                              className={
                                "relative h-5 w-5 transition-colors duration-200 " +
                                (isActive
                                  ? "text-indigo-600"
                                  : "text-foreground/60 group-hover:text-foreground")
                              }
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          </motion.span>

                          <span
                            className={
                              "text-[10px] font-medium transition-colors duration-200 " +
                              (isActive ? "text-foreground" : "text-foreground/50")
                            }
                          >
                            {label}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>

              {/* Thin divider between groups — always visible */}
              <span className="my-1 h-px w-6 rounded-full bg-foreground/10" />
            </div>
          );
        })}

        {/* Section toggle dots */}
        <div className="flex flex-col items-center gap-1.5 mt-2 pt-2 border-t border-white/20">
          {sectionGroups.map((group) => (
            <button
              key={group.section}
              onClick={() => onSectionChange?.(group.section)}
              aria-label={`Switch to ${group.label}`}
              className="group relative flex items-center justify-center w-6 h-6"
            >
              <motion.span
                animate={{
                  scale: activeSection === group.section ? 1 : 0.6,
                  backgroundColor:
                    activeSection === group.section
                      ? "rgb(99 102 241)" // indigo-500
                      : "rgb(156 163 175)", // gray-400
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="block w-1.5 h-1.5 rounded-full"
              />
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
