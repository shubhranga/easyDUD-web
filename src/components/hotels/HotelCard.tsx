import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import type { Hotel } from "@/lib/hotels-data";

export function HotelCard({ hotel, onView }: { hotel: Hotel; onView?: (h: Hotel) => void }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      style={{
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 6px 24px rgba(15,23,42,0.06)",
        border: "1px solid rgba(15,23,42,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3" }}>
        <motion.img
          src={hotel.image}
          alt={hotel.name}
          loading="lazy"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.45) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {hotel.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                padding: "5px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.92)",
                color: "#0f172a",
                backdropFilter: "blur(8px)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "5px 10px",
            background: "rgba(255,255,255,0.92)",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            color: "#0f172a",
          }}
        >
          <Star size={12} fill="#f59e0b" color="#f59e0b" />
          {hotel.rating}
        </div>
      </div>

      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div>
          <h3
            style={{
              margin: 0,
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 20,
              lineHeight: 1.2,
              color: "#0f172a",
              letterSpacing: "-0.01em",
            }}
          >
            {hotel.name}
          </h3>
          <div
            style={{
              marginTop: 4,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              color: "#64748b",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <MapPin size={12} />
            {hotel.city}, {hotel.country}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: "#475569",
          }}
        >
          {hotel.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              style={{
                padding: "3px 8px",
                background: "#f1f5f9",
                borderRadius: 999,
              }}
            >
              {a}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(15,23,42,0.06)",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              From
            </div>
            <div
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: 22,
                color: "#0f172a",
              }}
            >
              ₹{hotel.price}
              <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Sans',sans-serif" }}>
                {" "}
                / night
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onView?.(hotel)}
            style={{
              border: "none",
              padding: "10px 18px",
              borderRadius: 14,
              background: "linear-gradient(135deg,#2563EB,#1d4ed8)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(37,99,235,0.3)",
            }}
          >
            View
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export function HotelCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        border: "1px solid rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          aspectRatio: "4/3",
          background:
            "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s linear infinite",
        }}
      />
      <div style={{ padding: 18 }}>
        <div
          style={{
            height: 18,
            borderRadius: 6,
            background:
              "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s linear infinite",
            width: "70%",
          }}
        />
        <div
          style={{
            marginTop: 10,
            height: 12,
            borderRadius: 6,
            background:
              "linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s linear infinite",
            width: "45%",
          }}
        />
      </div>
    </div>
  );
}
