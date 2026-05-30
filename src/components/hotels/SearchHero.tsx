import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Users, Search } from "lucide-react";
import { TravelTabs } from "@/components/TravelTabs";

const fieldWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "12px 16px",
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(15,23,42,0.06)",
  borderRadius: 16,
  flex: 1,
  minWidth: 180,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#64748b",
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  outline: "none",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  color: "#0f172a",
  fontWeight: 500,
  width: "100%",
};

export function SearchHero({
  onSearch,
}: {
  onSearch: (q: { destination: string; checkIn: string; checkOut: string; guests: number }) => void;
}) {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  return (
    <section
      style={{
        position: "relative",
        background:
          "radial-gradient(1200px 500px at 80% -10%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(900px 400px at 0% 0%, rgba(168,85,247,0.10), transparent 60%), linear-gradient(180deg,#f8fafc 0%, #ffffff 100%)",
        padding: "56px 24px 88px",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <TravelTabs />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: "center",
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(36px, 6vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#0f172a",
            margin: 0,
          }}
        >
          Find your next <em style={{ color: "#2563EB", fontStyle: "italic" }}>perfect stay</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: "center",
            marginTop: 16,
            color: "#475569",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            maxWidth: 560,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.55,
          }}
        >
          Hand-picked hotels across 200+ destinations — booked in seconds, with
          flexible cancellation and the prices locals trust.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={(e) => {
            e.preventDefault();
            onSearch({ destination, checkIn, checkOut, guests });
          }}
          style={{
            marginTop: 36,
            padding: 12,
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow: "0 30px 80px -20px rgba(15,23,42,0.18)",
            borderRadius: 28,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "stretch",
          }}
        >
          <div style={fieldWrap}>
            <MapPin size={18} color="#2563EB" />
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Destination</div>
              <input
                style={inputStyle}
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div style={fieldWrap}>
            <CalendarDays size={18} color="#2563EB" />
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Check-in</div>
              <input
                type="date"
                style={inputStyle}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
          </div>

          <div style={fieldWrap}>
            <CalendarDays size={18} color="#2563EB" />
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Check-out</div>
              <input
                type="date"
                style={inputStyle}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div style={{ ...fieldWrap, maxWidth: 160 }}>
            <Users size={18} color="#2563EB" />
            <div style={{ flex: 1 }}>
              <div style={labelStyle}>Guests</div>
              <input
                type="number"
                min={1}
                max={20}
                style={inputStyle}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            style={{
              border: "none",
              cursor: "pointer",
              padding: "0 28px",
              borderRadius: 18,
              background: "linear-gradient(135deg,#2563EB,#1d4ed8)",
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 12px 28px rgba(37,99,235,0.35)",
            }}
          >
            <Search size={18} />
            Search
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
