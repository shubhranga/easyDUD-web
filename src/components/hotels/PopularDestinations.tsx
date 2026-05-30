import { motion } from "framer-motion";
import { POPULAR_CITIES } from "@/lib/hotels-data";

export function PopularDestinations({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (city: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#64748b",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
        }}
      >
        Popular destinations
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {["All", ...POPULAR_CITIES].map((city) => {
          const isActive = active === city;
          return (
            <motion.button
              key={city}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(city)}
              style={{
                border: isActive ? "1px solid #2563EB" : "1px solid rgba(15,23,42,0.08)",
                background: isActive ? "#2563EB" : "#fff",
                color: isActive ? "#fff" : "#0f172a",
                padding: "8px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                boxShadow: isActive
                  ? "0 8px 18px rgba(37,99,235,0.25)"
                  : "0 1px 2px rgba(15,23,42,0.04)",
                transition: "all 0.2s ease",
              }}
            >
              {city}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
