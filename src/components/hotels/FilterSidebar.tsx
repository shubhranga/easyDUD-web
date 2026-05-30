import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export type Filters = {
  maxPrice: number;
  minRating: number;
  amenities: string[];
};

const ALL_AMENITIES = ["Pool", "Spa", "WiFi", "Breakfast", "Gym", "Restaurant"];

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(15,23,42,0.06)", paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: 14,
          color: "#0f172a",
        }}
      >
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ paddingTop: 14 }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterSidebar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const toggleAmenity = (a: string) => {
    const has = filters.amenities.includes(a);
    onChange({
      ...filters,
      amenities: has ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a],
    });
  };

  return (
    <aside
      style={{
        position: "sticky",
        top: 24,
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(15,23,42,0.06)",
        borderRadius: 24,
        padding: 22,
        boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <SlidersHorizontal size={16} color="#2563EB" />
        <h3
          style={{
            margin: 0,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: "#0f172a",
          }}
        >
          Filters
        </h3>
      </div>

      <Section title="Price per night">
        <input
          type="range"
          min={50}
          max={500}
          step={10}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          style={{ width: "100%", accentColor: "#2563EB" }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 6,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: "#64748b",
          }}
        >
          <span>₹50</span>
          <span style={{ color: "#0f172a", fontWeight: 600 }}>Up to ₹{filters.maxPrice}</span>
          <span>₹500</span>
        </div>
      </Section>

      <Section title="Minimum rating">
        <div style={{ display: "flex", gap: 6 }}>
          {[3, 3.5, 4, 4.5].map((r) => {
            const active = filters.minRating === r;
            return (
              <button
                key={r}
                onClick={() => onChange({ ...filters, minRating: r })}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  borderRadius: 12,
                  border: active ? "1px solid #2563EB" : "1px solid rgba(15,23,42,0.08)",
                  background: active ? "#2563EB" : "#fff",
                  color: active ? "#fff" : "#0f172a",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                }}
              >
                {r}+
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Amenities">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ALL_AMENITIES.map((a) => {
            const checked = filters.amenities.includes(a);
            return (
              <label
                key={a}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#0f172a",
                }}
              >
                <span
                  onClick={() => toggleAmenity(a)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    border: checked ? "1px solid #2563EB" : "1px solid rgba(15,23,42,0.18)",
                    background: checked ? "#2563EB" : "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 11,
                    transition: "all 0.2s",
                  }}
                >
                  {checked ? "✓" : ""}
                </span>
                {a}
              </label>
            );
          })}
        </div>
      </Section>

      <button
        onClick={() => onChange({ maxPrice: 500, minRating: 3, amenities: [] })}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 14,
          border: "1px solid rgba(15,23,42,0.08)",
          background: "#fff",
          color: "#0f172a",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        Reset filters
      </button>
    </aside>
  );
}
