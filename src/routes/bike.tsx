import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MapPin,
  Flag,
  ArrowUpDown,
  Tag,
  Clock,
  ArrowRight,
  Bike,
  Zap,
  Gauge,
  Truck,
  ShieldCheck,
  Leaf,
  Wallet,
  TimerReset,
  Sparkles,
  Building2,
  Plane,
  ShoppingBag,
  GraduationCap,
  Landmark,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  AnimatedInput,
  AnimatedMap,
  COLORS,
  FloatingBadge,
  FONT_SANS,
  FONT_SERIF,
  GRADIENTS,
  GlassCard,
  GradientButton,
  RADII,
  SHADOWS,
  SectionHeading,
} from "@/components/mobility/shared";

export const Route = createFileRoute("/bike")({
  head: () => ({
    meta: [
      { title: "Bike Rides — easyDUD" },
      { name: "description", content: "Fast, affordable bike rides — beat traffic, ride green, arrive on time." },
    ],
  }),
  component: BikePage,
});

type BikeId = "standard" | "electric" | "sports" | "scooter" | "delivery";
const BIKES: { id: BikeId; name: string; eta: string; price: number; speed: string; eco: boolean; icon: typeof Bike }[] = [
  { id: "standard", name: "Standard", eta: "2 min", price: 49, speed: "60 km/h", eco: false, icon: Bike },
  { id: "electric", name: "Electric", eta: "3 min", price: 59, speed: "70 km/h", eco: true, icon: Zap },
  { id: "sports", name: "Sports", eta: "4 min", price: 99, speed: "120 km/h", eco: false, icon: Gauge },
  { id: "scooter", name: "Scooter", eta: "2 min", price: 39, speed: "50 km/h", eco: true, icon: Bike },
  { id: "delivery", name: "Delivery", eta: "5 min", price: 79, speed: "60 km/h", eco: false, icon: Truck },
];

const FEATURES = [
  { icon: Wallet, title: "Cheaper rides", body: "Up to 60% lower than cabs for the same distance." },
  { icon: TimerReset, title: "Beat traffic", body: "Slip through congestion and reclaim your day." },
  { icon: Leaf, title: "Eco friendly", body: "Electric options to keep your footprint light." },
  { icon: ShieldCheck, title: "Instant booking", body: "A captain in under 3 minutes, every time." },
];

const PLACES = [
  { icon: Landmark, label: "Metro Station", note: "5 min" },
  { icon: Plane, label: "Airport", note: "28 min" },
  { icon: ShoppingBag, label: "City Mall", note: "10 min" },
  { icon: GraduationCap, label: "University", note: "12 min" },
  { icon: Building2, label: "Old Town", note: "14 min" },
  { icon: Briefcase, label: "Business Hub", note: "9 min" },
];

function BikePage() {
  const [pickup, setPickup] = useState("Koramangala 5th Block");
  const [drop, setDrop] = useState("Indiranagar Metro");
  const [promo, setPromo] = useState("");
  const [bike, setBike] = useState<BikeId>("electric");

  const selected = BIKES.find((b) => b.id === bike)!;

  const swap = () => {
    setPickup(drop);
    setDrop(pickup);
  };

  const book = () => {
    toast.success(`${selected.name} ride requested`, { description: `${pickup} → ${drop} • ETA ${selected.eta}` });
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONT_SANS, color: COLORS.ink }}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          padding: "120px 24px 64px",
          background: GRADIENTS.meshBike,
          overflow: "hidden",
        }}
      >
        <motion.div
          aria-hidden
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: -100,
            left: -80,
            width: 360,
            height: 360,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(132,204,22,0.35), transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <motion.div
          aria-hidden
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(34,211,238,0.30), transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
              <FloatingBadge label="Captains online nearby" tone="green" />
              <FloatingBadge icon={Leaf} label="EV fleet available" tone="green" />
            </div>
            <h1
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(40px, 6vw, 72px)",
                lineHeight: 1.02,
                margin: 0,
                letterSpacing: "-0.025em",
              }}
            >
              Fast rides for<br />
              <span
                style={{
                  background: "linear-gradient(135deg,#16a34a,#84cc16 60%,#22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                every street
              </span>
            </h1>
            <p style={{ marginTop: 18, maxWidth: 520, fontSize: 17, lineHeight: 1.55, color: COLORS.inkMuted }}>
              Book bikes instantly for affordable, traffic-free travel. Helmets included,
              captains rated, and an electric fleet that's kinder to the city.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 28 }}>
              {[
                { k: "₹39", v: "Starting fare" },
                { k: "2 min", v: "Avg pickup" },
                { k: "4.9★", v: "Captain rating" },
              ].map((s) => (
                <div key={s.v}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 26, lineHeight: 1 }}>{s.k}</div>
                  <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 4 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING PANEL */}
          <GlassCard padding={26} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <FloatingBadge icon={ShieldCheck} label="Helmet included" tone="green" />
              <FloatingBadge icon={Clock} label={`ETA ${selected.eta}`} tone="neutral" />
            </div>

            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
              <AnimatedInput icon={MapPin} label="Pickup" value={pickup} onChange={setPickup} />
              <AnimatedInput icon={Flag} label="Drop" value={drop} onChange={setDrop} />
              <motion.button
                onClick={swap}
                whileTap={{ rotate: 180 }}
                aria-label="Swap"
                style={{
                  position: "absolute",
                  right: 16,
                  top: "calc(50% - 18px)",
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  border: `1px solid ${COLORS.hairline}`,
                  background: "#fff",
                  boxShadow: SHADOWS.soft,
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                }}
              >
                <ArrowUpDown size={16} color="#16a34a" />
              </motion.button>
            </div>

            <div style={{ marginTop: 10 }}>
              <AnimatedInput icon={Tag} label="Promo" value={promo} onChange={setPromo} placeholder="RIDE10" />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
              {["Metro", "Airport", "Office", "Home"].map((q) => (
                <button
                  key={q}
                  onClick={() => setDrop(q)}
                  style={{
                    border: `1px solid ${COLORS.hairline}`,
                    background: "#fff",
                    borderRadius: 999,
                    padding: "8px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: FONT_SANS,
                    cursor: "pointer",
                    color: COLORS.ink,
                  }}
                >
                  {q}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: COLORS.inkSoft }}>Estimated fare</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 28, lineHeight: 1 }}>₹{selected.price}</div>
              </div>
              <GradientButton tone="green" icon={ArrowRight} onClick={book}>Book instantly</GradientButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* BIKE CATEGORY */}
      <section style={{ padding: "72px 24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeading eyebrow="Pick your ride" title="Built for every street" subtitle="From quick errands to long sprints — a bike for every kind of day." />
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {BIKES.map((b) => {
              const Icon = b.icon;
              const active = b.id === bike;
              return (
                <motion.button
                  key={b.id}
                  onClick={() => setBike(b.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22 }}
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    border: active ? "1.5px solid #16a34a" : `1px solid ${COLORS.hairline}`,
                    background: active ? "#fff" : "rgba(255,255,255,0.7)",
                    boxShadow: active ? SHADOWS.glowBike : SHADOWS.soft,
                    borderRadius: RADII.lg,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      background: active ? "linear-gradient(135deg,#16a34a,#84cc16)" : "rgba(22,163,74,0.10)",
                      color: active ? "#fff" : "#15803d",
                      marginBottom: 14,
                    }}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: FONT_SERIF, fontSize: 22 }}>{b.name}</span>
                    {b.eco && <FloatingBadge icon={Leaf} label="Eco" tone="green" />}
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 10, fontSize: 12, color: COLORS.inkSoft, flexWrap: "wrap" }}>
                    <span><Gauge size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{b.speed}</span>
                    <span><Clock size={12} style={{ verticalAlign: -2, marginRight: 4 }} />{b.eta}</span>
                  </div>
                  <div style={{ marginTop: 12, fontWeight: 700, color: COLORS.ink }}>₹{b.price}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRACKING */}
      <section style={{ padding: "72px 24px 0" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)",
            gap: 24,
          }}
        >
          <GlassCard padding={0} style={{ overflow: "hidden", minHeight: 360 }}>
            <div style={{ position: "relative", height: "100%", minHeight: 360 }}>
              <AnimatedMap tone="green" />
              <motion.div
                style={{ position: "absolute", left: "50%", top: "50%", marginLeft: -18, marginTop: -18 }}
                animate={{ x: [-80, 90, -80], y: [40, -30, 40], rotate: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: "linear-gradient(135deg,#16a34a,#84cc16)",
                    display: "grid",
                    placeItems: "center",
                    boxShadow: SHADOWS.glowBike,
                  }}
                >
                  <Bike size={20} color="#fff" />
                </div>
              </motion.div>
              <div style={{ position: "absolute", top: 18, left: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <FloatingBadge label="Captain en route" tone="green" />
                <FloatingBadge icon={Sparkles} label="0g CO₂" tone="neutral" />
              </div>
            </div>
          </GlassCard>

          <GlassCard padding={28}>
            <div style={{ fontSize: 12, color: COLORS.inkSoft, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>Trip preview</div>
            <h3 style={{ fontFamily: FONT_SERIF, fontSize: 26, margin: "8px 0 18px", lineHeight: 1.15 }}>
              {selected.name} • {selected.eta}
            </h3>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: "#16a34a" }} />
                <span style={{ width: 2, flex: 1, background: "linear-gradient(180deg,#16a34a,#84cc16)", margin: "4px 0" }} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#0B1020" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{pickup}</div>
                <div style={{ fontSize: 12, color: COLORS.inkSoft, marginBottom: 16 }}>Pickup</div>
                <div style={{ fontWeight: 600 }}>{drop}</div>
                <div style={{ fontSize: 12, color: COLORS.inkSoft }}>Drop</div>
              </div>
            </div>
            <div
              style={{
                marginTop: 22,
                padding: 16,
                borderRadius: RADII.md,
                background: "linear-gradient(135deg, rgba(22,163,74,0.10), rgba(132,204,22,0.05))",
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              {[
                { k: "Distance", v: "4.2 km" },
                { k: "Duration", v: "14 min" },
                { k: "Fare", v: `₹${selected.price}` },
              ].map((x) => (
                <div key={x.k}>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.06em" }}>{x.k}</div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 20 }}>{x.v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}>
              <GradientButton tone="green" full icon={ArrowRight} onClick={book}>Book {selected.name}</GradientButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "96px 24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeading eyebrow="Why ride with us" title="Quick, green and yours" />
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: "#fff",
                    border: `1px solid ${COLORS.hairline}`,
                    borderRadius: RADII.lg,
                    padding: 24,
                    boxShadow: SHADOWS.soft,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, rgba(22,163,74,0.12), rgba(132,204,22,0.06))",
                      color: "#15803d",
                      display: "grid",
                      placeItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 20 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: COLORS.inkMuted, marginTop: 6, lineHeight: 1.5 }}>{f.body}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUICK DESTINATIONS */}
      <section style={{ padding: "72px 24px 120px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeading eyebrow="Hop on" title="Quick destinations" subtitle="The places riders go most — tap to set as your drop." />
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 14,
            }}
          >
            {PLACES.map((p) => {
              const Icon = p.icon;
              return (
                <motion.button
                  key={p.label}
                  whileHover={{ y: -4, boxShadow: SHADOWS.glowBike }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setDrop(p.label);
                    toast.success(`Drop set to ${p.label}`);
                  }}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${COLORS.hairline}`,
                    background: "#fff",
                    borderRadius: RADII.lg,
                    padding: 18,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    fontFamily: FONT_SANS,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      display: "grid",
                      placeItems: "center",
                      background: "linear-gradient(135deg, rgba(22,163,74,0.10), rgba(132,204,22,0.06))",
                      color: "#15803d",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{p.label}</div>
                    <div style={{ fontSize: 12, color: COLORS.inkSoft }}>{p.note}</div>
                  </div>
                  <ArrowRight size={16} color="#16a34a" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
