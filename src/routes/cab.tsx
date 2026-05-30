import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MapPin,
  Flag,
  ArrowUpDown,
  Calendar,
  Users,
  Tag,
  CreditCard,
  Clock,
  ArrowRight,
  ShieldCheck,
  Navigation,
  Wallet,
  Headphones,
  Car,
  Gauge,
  Zap,
  Crown,
  Briefcase,
  Sparkles,
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

export const Route = createFileRoute("/cab")({
  head: () => ({
    meta: [
      { title: "Premium Cabs — easyDUD" },
      { name: "description", content: "Book premium rides across your city with transparent pricing and live tracking." },
    ],
  }),
  component: CabPage,
});

type RideId = "economy" | "sedan" | "suv" | "luxury" | "electric";

const RIDES: {
  id: RideId;
  name: string;
  blurb: string;
  seats: number;
  eta: string;
  price: number;
  icon: typeof Car;
}[] = [
  { id: "economy", name: "Economy", blurb: "Affordable everyday", seats: 4, eta: "3 min", price: 149, icon: Car },
  { id: "sedan", name: "Sedan", blurb: "Comfortable & quiet", seats: 4, eta: "4 min", price: 219, icon: Briefcase },
  { id: "suv", name: "SUV", blurb: "Space for the crew", seats: 6, eta: "6 min", price: 329, icon: Gauge },
  { id: "luxury", name: "Luxury", blurb: "Executive class", seats: 4, eta: "8 min", price: 549, icon: Crown },
  { id: "electric", name: "Electric", blurb: "Zero emissions", seats: 4, eta: "5 min", price: 199, icon: Zap },
];

const FEATURES = [
  { icon: ShieldCheck, title: "Verified Drivers", body: "Background-checked, top-rated partners on every trip." },
  { icon: Navigation, title: "Live Tracking", body: "Share your route in real time with friends and family." },
  { icon: Wallet, title: "Safe Payments", body: "Cards, UPI and wallets — all encrypted end-to-end." },
  { icon: Headphones, title: "24/7 Support", body: "A human team on standby whenever you need help." },
];

const RECENT = [
  { city: "Bandra → BKC", fare: 215, when: "Yesterday, 9:14 AM" },
  { city: "Indiranagar → Airport", fare: 642, when: "Mon, 6:30 AM" },
  { city: "Connaught Pl. → Saket", fare: 318, when: "Sun, 8:42 PM" },
  { city: "Powai → Lower Parel", fare: 489, when: "Fri, 7:10 PM" },
];

function CabPage() {
  const [pickup, setPickup] = useState("Bandra West, Mumbai");
  const [drop, setDrop] = useState("BKC, Mumbai");
  const [date, setDate] = useState("Today");
  const [pax, setPax] = useState("1 passenger");
  const [promo, setPromo] = useState("");
  const [ride, setRide] = useState<RideId>("sedan");
  const [when, setWhen] = useState<"now" | "later">("now");

  const selected = RIDES.find((r) => r.id === ride)!;

  const swap = () => {
    setPickup(drop);
    setDrop(pickup);
  };

  const book = () => {
    toast.success(`${selected.name} requested`, { description: `${pickup} → ${drop} • ETA ${selected.eta}` });
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONT_SANS, color: COLORS.ink }}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          padding: "120px 24px 64px",
          background: GRADIENTS.mesh,
          overflow: "hidden",
        }}
      >
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(96,165,250,0.45), transparent 70%)",
            filter: "blur(20px)",
          }}
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: -80,
            left: -60,
            width: 320,
            height: 320,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(167,139,250,0.35), transparent 70%)",
            filter: "blur(10px)",
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
              <FloatingBadge label="Live • 1,284 drivers nearby" tone="blue" />
              <FloatingBadge icon={Sparkles} label="Surge free until 9 PM" tone="neutral" />
            </div>
            <h1
              style={{
                fontFamily: FONT_SERIF,
                fontSize: "clamp(40px, 6vw, 72px)",
                lineHeight: 1.02,
                margin: 0,
                letterSpacing: "-0.025em",
                color: COLORS.ink,
              }}
            >
              Premium rides<br />
              <span
                style={{
                  background: GRADIENTS.primary,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                across your city
              </span>
            </h1>
            <p
              style={{
                marginTop: 18,
                maxWidth: 520,
                fontSize: 17,
                lineHeight: 1.55,
                color: COLORS.inkMuted,
              }}
            >
              Book comfortable rides with transparent pricing, verified drivers and real-time tracking.
              From quick city hops to airport runs — beautifully simple.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 28 }}>
              {[
                { k: "4.92", v: "Driver rating" },
                { k: "1.2M+", v: "Rides this month" },
                { k: "120s", v: "Avg arrival" },
              ].map((s) => (
                <div key={s.v}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 26, lineHeight: 1 }}>{s.k}</div>
                  <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 4 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKING CARD */}
          <GlassCard padding={26} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div style={{ display: "flex", gap: 8, padding: 4, background: "rgba(11,16,32,0.04)", borderRadius: RADII.pill, marginBottom: 18 }}>
              {(["now", "later"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setWhen(opt)}
                  style={{
                    flex: 1,
                    border: "none",
                    background: when === opt ? "#fff" : "transparent",
                    color: when === opt ? COLORS.ink : COLORS.inkMuted,
                    boxShadow: when === opt ? SHADOWS.soft : "none",
                    padding: "10px 14px",
                    borderRadius: RADII.pill,
                    fontFamily: FONT_SANS,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {opt === "now" ? "Ride now" : "Schedule"}
                </button>
              ))}
            </div>

            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10 }}>
              <AnimatedInput icon={MapPin} label="Pickup" value={pickup} onChange={setPickup} />
              <AnimatedInput icon={Flag} label="Destination" value={drop} onChange={setDrop} />
              <motion.button
                onClick={swap}
                whileTap={{ rotate: 180 }}
                aria-label="Swap pickup and destination"
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
                <ArrowUpDown size={16} color={COLORS.blue} />
              </motion.button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <AnimatedInput icon={Calendar} label="When" value={date} onChange={setDate} />
              <AnimatedInput icon={Users} label="Passengers" value={pax} onChange={setPax} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <AnimatedInput icon={Tag} label="Promo code" value={promo} onChange={setPromo} placeholder="WELCOME10" />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: RADII.md,
                  background: "#fff",
                  border: `1px solid ${COLORS.hairline}`,
                }}
              >
                <CreditCard size={18} color={COLORS.blue} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em" }}>Pay with</span>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>•••• 4242</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: COLORS.inkSoft }}>Estimated fare</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 28, lineHeight: 1 }}>₹{selected.price}</div>
              </div>
              <GradientButton icon={ArrowRight} onClick={book}>Search rides</GradientButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CATEGORY SELECTOR */}
      <section style={{ padding: "72px 24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeading eyebrow="Choose your ride" title="A fleet for every moment" subtitle="From quick errands to executive transfers — pick the comfort that fits the trip." />

          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {RIDES.map((r) => {
              const Icon = r.icon;
              const active = r.id === ride;
              return (
                <motion.button
                  key={r.id}
                  onClick={() => setRide(r.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22 }}
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    border: active ? `1.5px solid ${COLORS.blue}` : `1px solid ${COLORS.hairline}`,
                    background: active ? "#fff" : "rgba(255,255,255,0.7)",
                    boxShadow: active ? SHADOWS.glow : SHADOWS.soft,
                    borderRadius: RADII.lg,
                    padding: 20,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="cab-ride-glow"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: GRADIENTS.primarySoft,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        display: "grid",
                        placeItems: "center",
                        background: active ? GRADIENTS.primary : "rgba(37,99,235,0.10)",
                        color: active ? "#fff" : COLORS.blue,
                        marginBottom: 14,
                      }}
                    >
                      <Icon size={22} strokeWidth={2.2} />
                    </div>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 22 }}>{r.name}</div>
                    <div style={{ fontSize: 13, color: COLORS.inkMuted, marginTop: 2 }}>{r.blurb}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 12, color: COLORS.inkSoft }}>
                      <span><Clock size={12} style={{ marginRight: 4, verticalAlign: -2 }} />{r.eta}</span>
                      <span>{r.seats} seats</span>
                      <span style={{ color: COLORS.ink, fontWeight: 600 }}>₹{r.price}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIVE RIDE PANEL */}
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
              <AnimatedMap tone="blue" />
              <div style={{ position: "absolute", top: 18, left: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <FloatingBadge label="Driver 2.1 km away" />
                <FloatingBadge icon={Clock} label="ETA 4 min" tone="neutral" />
              </div>
              <div style={{ position: "absolute", bottom: 18, right: 18 }}>
                <FloatingBadge icon={Sparkles} label="No surge" tone="green" />
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
                <span style={{ width: 10, height: 10, borderRadius: 999, background: COLORS.blue }} />
                <span style={{ width: 2, flex: 1, background: "linear-gradient(180deg,#2563EB,#60A5FA)", margin: "4px 0" }} />
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "#0B1020" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{pickup}</div>
                <div style={{ fontSize: 12, color: COLORS.inkSoft, marginBottom: 16 }}>Pickup point</div>
                <div style={{ fontWeight: 600 }}>{drop}</div>
                <div style={{ fontSize: 12, color: COLORS.inkSoft }}>Destination</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 22,
                padding: 16,
                borderRadius: RADII.md,
                background: GRADIENTS.primarySoft,
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 12,
              }}
            >
              {[
                { k: "Distance", v: "8.4 km" },
                { k: "Duration", v: "22 min" },
                { k: "Fare", v: `₹${selected.price}` },
              ].map((x) => (
                <div key={x.k}>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.06em" }}>{x.k}</div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 20 }}>{x.v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20 }}>
              <GradientButton full icon={ArrowRight} onClick={book}>Confirm {selected.name}</GradientButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "96px 24px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeading eyebrow="Why riders choose us" title="Premium where it matters" />
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
                      background: GRADIENTS.primarySoft,
                      color: COLORS.blue,
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

      {/* RECENT */}
      <section style={{ padding: "72px 24px 120px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHeading eyebrow="Pick up where you left" title="Recent rides" />
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 12,
              scrollbarWidth: "none",
            }}
          >
            {RECENT.map((r) => (
              <motion.div
                key={r.city}
                whileHover={{ y: -4 }}
                style={{
                  minWidth: 280,
                  background: "#fff",
                  border: `1px solid ${COLORS.hairline}`,
                  borderRadius: RADII.lg,
                  padding: 20,
                  boxShadow: SHADOWS.soft,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <FloatingBadge icon={MapPin} label="Completed" tone="green" />
                  <span style={{ fontSize: 12, color: COLORS.inkSoft }}>{r.when}</span>
                </div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 20 }}>{r.city}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <span style={{ fontWeight: 600 }}>₹{r.fare}</span>
                  <button
                    onClick={() => toast.info("Rebooking…", { description: r.city })}
                    style={{
                      border: `1px solid ${COLORS.blue}`,
                      color: COLORS.blue,
                      background: "transparent",
                      borderRadius: 999,
                      padding: "8px 14px",
                      fontFamily: FONT_SANS,
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Rebook
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* MOBILE STICKY CTA */}
      <div
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 50,
          display: "none",
        }}
        className="mobility-sticky"
      >
        <GlassCard padding={14} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em" }}>{selected.name}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 20, lineHeight: 1 }}>₹{selected.price}</div>
          </div>
          <GradientButton icon={ArrowRight} onClick={book}>Book</GradientButton>
        </GlassCard>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          .mobility-sticky { display: block !important; }
        }
      `}</style>
    </div>
  );
}
