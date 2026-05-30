import { Star } from "lucide-react";
import type { Hotel } from "@/lib/hotels-data";

export function RecentlyViewed({ items }: { items: Hotel[] }) {
  if (items.length === 0) return null;
  return (
    <section style={{ marginTop: 56 }}>
      <h3
        style={{
          margin: "0 0 16px",
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: 24,
          color: "#0f172a",
          letterSpacing: "-0.01em",
        }}
      >
        Recently viewed
      </h3>
      <div
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          paddingBottom: 8,
          scrollSnapType: "x mandatory",
        }}
      >
        {items.map((h) => (
          <div
            key={h.id}
            style={{
              minWidth: 240,
              maxWidth: 240,
              background: "#fff",
              border: "1px solid rgba(15,23,42,0.06)",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 4px 14px rgba(15,23,42,0.04)",
              scrollSnapAlign: "start",
            }}
          >
            <img
              src={h.image}
              alt={h.name}
              loading="lazy"
              style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: 12 }}>
              <div
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {h.name}
              </div>
              <div
                style={{
                  marginTop: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "#64748b",
                }}
              >
                <span>{h.city}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <Star size={11} fill="#f59e0b" color="#f59e0b" />
                  {h.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
