import { Plane, CarTaxiFront, Bike, Hotel, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "@tanstack/react-router";

type Tab = { id: string; label: string; icon: LucideIcon; route: string };

const tabs: Tab[] = [
  { id: "flights", label: "Flights", icon: Plane, route: "/flights" },
  { id: "cab", label: "Cab", icon: CarTaxiFront, route: "/cab" },
  { id: "bike", label: "Bike", icon: Bike, route: "/bike" },
  { id: "hotels", label: "Hotels", icon: Hotel, route: "/hotels" },
];

export function TravelTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      role="tablist"
      aria-label="Travel categories"
      style={{
        display: "inline-flex",
        gap: 6,
        padding: 6,
        borderRadius: 24,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        flexWrap: "wrap",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = location.pathname === tab.route;

        return (
          <motion.button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => navigate({ to: tab.route })}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{
              position: "relative",
              border: "none",
              background: "transparent",
              color: active ? "#fff" : "#0f172a",
              borderRadius: 18,
              padding: "12px 20px",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "-0.01em",
              outline: "none",
              transition: "color 0.25s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.25)")}
            onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            {active && (
              <motion.span
                layoutId="travel-tab-pill"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 18,
                  background: "linear-gradient(135deg,#2563EB,#3b82f6)",
                  boxShadow: "0 8px 22px rgba(37,99,235,0.35)",
                  zIndex: 0,
                }}
              />
            )}
            <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, zIndex: 1 }}>
              <Icon size={18} strokeWidth={2} />
              <span>{tab.label}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
