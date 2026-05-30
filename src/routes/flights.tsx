import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Plane,
  Search,
  ArrowRight,
  ArrowLeftRight,
  Calendar,
  Users,
  ShieldCheck,
  Sparkles,
  Clock,
  TrendingDown,
  MapPin,
  Headphones,
  Smartphone,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import flightsBg from "@/assets/flights-bg.jpg";
import emblem from "@/assets/easydud-emblem.png";

export const Route = createFileRoute("/flights")({
  head: () => ({
    meta: [
      { title: "Flights — Compare airfares & book smarter | Easy Dud" },
      {
        name: "description",
        content:
          "Search and compare flights from IndiGo, Air India, Vistara and more. Live prices, flexible dates, secure booking on Easy Dud.",
      },
      { property: "og:title", content: "Flights — Easy Dud" },
      {
        property: "og:description",
        content: "Premium flight search with live prices and flexible dates.",
      },
    ],
  }),
  component: FlightsPage,
});

/* ---------- Airline brand marks (text-based, brand-coloured) ---------- */
function AirlineLogo({ code }: { code: "indigo" | "airindia" | "vistara" }) {
  if (code === "indigo")
    return (
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#011F68] text-white">
          <Plane size={18} className="-rotate-45" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-tight text-[#011F68]">
            IndiGo
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">6E</div>
        </div>
      </div>
    );
  if (code === "airindia")
    return (
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#C8102E] to-[#7A0B1F] text-white">
          <span className="text-base font-black">AI</span>
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-bold tracking-tight text-[#C8102E]">
            Air India
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Vista
          </div>
        </div>
      </div>
    );
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[#4B1F6A] to-[#2E0E47] text-[#E2C275]">
        <Sparkles size={16} />
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight text-[#4B1F6A]">
          Vistara
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
          UK
        </div>
      </div>
    </div>
  );
}

/* ---------- Animated route arc ---------- */
function RouteArc() {
  return (
    <svg
      viewBox="0 0 400 120"
      className="h-20 w-full"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="arc" x1="0" x2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="90" r="5" fill="#60A5FA" />
      <circle cx="380" cy="90" r="5" fill="#A78BFA" />
      <path
        d="M20 90 Q 200 -20 380 90"
        stroke="url(#arc)"
        strokeWidth="2"
        strokeDasharray="4 6"
      />
      <motion.g
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ offsetPath: "path('M20 90 Q 200 -20 380 90')" }}
      >
        <Plane size={18} className="-translate-x-2 -translate-y-2 text-blue-600" />
      </motion.g>
    </svg>
  );
}

/* ---------- Bento tile wrapper ---------- */
function Tile({
  className = "",
  children,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={`group relative rounded-3xl border border-white/60 bg-white/85 p-6 shadow-[0_10px_40px_-12px_rgba(15,23,42,0.15)] backdrop-blur-xl transition-shadow hover:shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Page ---------- */
function FlightsPage() {
  const [trip, setTrip] = useState<"oneway" | "roundtrip">("roundtrip");

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Cinematic moving background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[820px] overflow-hidden">
        <motion.img
          src={flightsBg}
          alt=""
          width={1920}
          height={1080}
          initial={{ scale: 1.1, x: 0 }}
          animate={{ scale: 1.18, x: -30 }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/40 to-slate-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_60%)]" />
        {/* Drifting particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/60"
            style={{ left: `${(i * 83) % 100}%`, top: `${(i * 47) % 90}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Navbar />
        <FloatingSidebar />

        <main className="mx-auto max-w-[1320px] px-6 pb-24 pt-8 md:pl-24">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3 text-white/90">
            <img src={emblem} alt="Easy Dud" className="h-10 w-10" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em]">
              Easy Dud · Flights
            </span>
          </div>

          {/* ============ BENTO GRID ============ */}
          <div className="grid grid-cols-12 gap-4 md:gap-5">
            {/* HERO SEARCH TILE */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="col-span-12 rounded-[28px] border border-white/40 bg-white/95 p-6 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)] backdrop-blur-2xl md:p-10"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <Sparkles size={12} /> Live prices · 500+ airlines
                  </div>
                  <h1 className="mt-4 text-[40px] font-light leading-[1.05] tracking-tight text-slate-900 md:text-[56px]">
                    Find the best flights{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text italic text-transparent">
                      for every journey
                    </span>
                    .
                  </h1>
                  <p className="mt-3 max-w-lg text-slate-600">
                    Compare airlines, fares and dates side-by-side. Trusted carriers,
                    transparent pricing, zero hassle.
                  </p>

                  {/* Trust strip */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-600" /> Secure booking
                    </span>
                    <span className="flex items-center gap-1.5">
                      <TrendingDown size={14} className="text-blue-600" /> Best fares
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-purple-600" /> Free cancellation*
                    </span>
                  </div>

                  <div className="mt-6">
                    <RouteArc />
                  </div>
                </div>

                {/* Search form */}
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-5">
                  <div className="mb-4 inline-flex rounded-full bg-slate-100 p-1 text-xs font-semibold">
                    {(["roundtrip", "oneway"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTrip(t)}
                        className={`relative rounded-full px-4 py-1.5 transition-colors ${
                          trip === t ? "text-white" : "text-slate-600"
                        }`}
                      >
                        {trip === t && (
                          <motion.span
                            layoutId="trip-pill"
                            className="absolute inset-0 rounded-full bg-slate-900"
                          />
                        )}
                        <span className="relative capitalize">
                          {t === "roundtrip" ? "Round trip" : "One way"}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
                      <Field icon={<MapPin size={14} />} label="From" value="Mumbai (BOM)" />
                      <button className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:rotate-180 hover:text-slate-900">
                        <ArrowLeftRight size={14} />
                      </button>
                      <Field icon={<MapPin size={14} />} label="To" value="Delhi (DEL)" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field
                        icon={<Calendar size={14} />}
                        label="Depart"
                        value="Fri, 22 May"
                        boxed
                      />
                      <Field
                        icon={<Calendar size={14} />}
                        label="Return"
                        value={trip === "roundtrip" ? "Mon, 25 May" : "—"}
                        boxed
                        muted={trip === "oneway"}
                      />
                    </div>
                    <Field
                      icon={<Users size={14} />}
                      label="Travellers & Class"
                      value="1 Adult · Economy"
                      boxed
                    />

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30"
                    >
                      <Search size={16} />
                      Search flights
                      <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* FEATURED DEALS — large tile */}
            <Tile className="col-span-12 lg:col-span-8" delay={0.05}>
              <TileHeader
                eyebrow="Today's deals"
                title="Featured flights"
                sub="Hand-picked fares across India's top carriers."
              />
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {DEALS.map((d, i) => (
                  <DealCard key={i} {...d} />
                ))}
              </div>
            </Tile>

            {/* TRUST */}
            <Tile className="col-span-12 lg:col-span-4" delay={0.1}>
              <TileHeader eyebrow="Why Easy Dud" title="Booked with confidence" />
              <ul className="mt-5 space-y-4">
                {[
                  { icon: ShieldCheck, t: "Secure checkout", s: "256-bit encrypted payments" },
                  { icon: Wallet, t: "No hidden fees", s: "What you see is what you pay" },
                  { icon: Headphones, t: "24/7 support", s: "Real humans, real fast" },
                  { icon: CheckCircle2, t: "Flexible cancellation", s: "On select routes & fares" },
                ].map(({ icon: I, t, s }) => (
                  <li key={t} className="flex gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700">
                      <I size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t}</div>
                      <div className="text-xs text-slate-500">{s}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Tile>

            {/* AIRLINE COMPARISON */}
            <Tile className="col-span-12 lg:col-span-7" delay={0.15}>
              <TileHeader
                eyebrow="Compare"
                title="IndiGo · Air India · Vistara"
                sub="A quick look at what each carrier brings on the BOM → DEL route."
              />
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
                      <th className="py-2 font-medium">Carrier</th>
                      <th className="py-2 font-medium">From</th>
                      <th className="py-2 font-medium">Baggage</th>
                      <th className="py-2 font-medium">On-time</th>
                      <th className="py-2 font-medium">Flex</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { c: "indigo", p: "₹4,299", b: "7 + 15 kg", o: "92%", f: "Standard" },
                      { c: "airindia", p: "₹5,180", b: "8 + 25 kg", o: "88%", f: "Generous" },
                      { c: "vistara", p: "₹6,420", b: "7 + 20 kg", o: "94%", f: "Premium" },
                    ].map((r) => (
                      <tr key={r.c} className="hover:bg-slate-50/50">
                        <td className="py-3 pr-2">
                          <AirlineLogo code={r.c as "indigo" | "airindia" | "vistara"} />
                        </td>
                        <td className="py-3 pr-2 font-semibold text-slate-900">{r.p}</td>
                        <td className="py-3 pr-2 text-slate-600">{r.b}</td>
                        <td className="py-3 pr-2 text-slate-600">{r.o}</td>
                        <td className="py-3 text-slate-600">{r.f}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tile>

            {/* FLEXIBLE DATES */}
            <Tile className="col-span-12 lg:col-span-5" delay={0.2}>
              <TileHeader
                eyebrow="Flexible dates"
                title="Cheaper days nearby"
                sub="BOM → DEL · next 7 days"
              />
              <div className="mt-5 flex items-end gap-2">
                {[
                  { d: "Mon", p: 4299, low: true },
                  { d: "Tue", p: 4680 },
                  { d: "Wed", p: 5120 },
                  { d: "Thu", p: 4420 },
                  { d: "Fri", p: 6180, high: true },
                  { d: "Sat", p: 5640 },
                  { d: "Sun", p: 4880 },
                ].map((x, i) => {
                  const h = 30 + ((x.p - 4000) / 3000) * 90;
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="text-[10px] font-semibold text-slate-500">
                        ₹{(x.p / 1000).toFixed(1)}k
                      </div>
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: h }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.05 }}
                        className={`w-full rounded-md ${
                          x.low
                            ? "bg-gradient-to-t from-emerald-500 to-emerald-300"
                            : x.high
                              ? "bg-gradient-to-t from-rose-400 to-rose-200"
                              : "bg-gradient-to-t from-blue-500 to-indigo-300"
                        }`}
                      />
                      <div className="text-[11px] text-slate-600">{x.d}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <TrendingDown size={12} /> Lowest on Monday
                </span>
                <button className="font-semibold text-blue-700 hover:underline">
                  Switch dates →
                </button>
              </div>
            </Tile>

            {/* POPULAR ROUTES */}
            <Tile className="col-span-12 lg:col-span-6" delay={0.25}>
              <TileHeader
                eyebrow="Trending"
                title="Popular routes"
                sub="Where travellers are heading this week."
              />
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  ["Mumbai", "Delhi", "₹4,299"],
                  ["Bengaluru", "Dubai", "₹14,560"],
                  ["Delhi", "London", "₹42,800"],
                  ["Chennai", "Singapore", "₹18,240"],
                  ["Kolkata", "Bangkok", "₹12,990"],
                  ["Hyderabad", "Goa", "₹3,180"],
                  ["Pune", "Jaipur", "₹3,820"],
                ].map(([a, b, p]) => (
                  <motion.button
                    key={`${a}-${b}`}
                    whileHover={{ y: -2 }}
                    className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:shadow-sm"
                  >
                    <span>{a}</span>
                    <ArrowRight size={12} className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    <span>{b}</span>
                    <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                      {p}
                    </span>
                  </motion.button>
                ))}
              </div>
            </Tile>

            {/* INSPIRATION */}
            <Tile className="col-span-12 lg:col-span-6" delay={0.3}>
              <TileHeader
                eyebrow="Travel inspiration"
                title="Seasonal escapes"
                sub="Curated journeys worth packing for."
              />
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { t: "Maldives", s: "From ₹22,400", g: "from-cyan-500 to-teal-400" },
                  { t: "Bali", s: "From ₹19,890", g: "from-emerald-500 to-lime-400" },
                  { t: "Paris", s: "From ₹38,600", g: "from-rose-500 to-amber-300" },
                  { t: "Tokyo", s: "From ₹46,200", g: "from-fuchsia-500 to-pink-400" },
                ].map((d) => (
                  <motion.div
                    key={d.t}
                    whileHover={{ y: -3 }}
                    className={`relative h-28 overflow-hidden rounded-2xl bg-gradient-to-br ${d.g} p-4 text-white shadow-md`}
                  >
                    <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/15" />
                    <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-white/10" />
                    <div className="relative">
                      <div className="text-base font-semibold">{d.t}</div>
                      <div className="text-xs opacity-90">{d.s}</div>
                    </div>
                    <Plane size={14} className="absolute bottom-3 right-3 -rotate-45 opacity-80" />
                  </motion.div>
                ))}
              </div>
            </Tile>

            {/* SECONDARY CTA — app */}
            <Tile className="col-span-12 overflow-hidden lg:col-span-8" delay={0.35}>
              <div className="grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                    <Smartphone size={12} /> Easy Dud App
                  </div>
                  <h3 className="mt-3 text-2xl font-light tracking-tight text-slate-900 md:text-3xl">
                    Take every itinerary{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-medium italic text-transparent">
                      with you
                    </span>
                    .
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-slate-600">
                    Live gate updates, mobile boarding passes and price alerts — right in your pocket.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800">
                      Download for iOS
                    </button>
                    <button className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition hover:border-slate-300">
                      Get on Android
                    </button>
                  </div>
                </div>
                <div className="relative h-40 md:h-48">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-5 text-white shadow-xl"
                  >
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest opacity-80">
                      <span>Boarding pass</span>
                      <Plane size={14} className="-rotate-45" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] opacity-70">BOM</div>
                        <div className="text-2xl font-bold">06:40</div>
                      </div>
                      <div className="flex-1 px-3">
                        <div className="h-px w-full bg-white/40" />
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] opacity-70">DEL</div>
                        <div className="text-2xl font-bold">08:55</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[10px] opacity-80">
                      <span>Gate 12B</span>
                      <span>Seat 14A</span>
                      <span>6E · 5234</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </Tile>

            {/* NEWSLETTER */}
            <Tile className="col-span-12 lg:col-span-4" delay={0.4}>
              <TileHeader eyebrow="Stay in the loop" title="Price drops, in your inbox" />
              <p className="mt-2 text-sm text-slate-600">
                Get fare alerts for routes you love. No spam, ever.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Subscribe
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Clock size={12} /> Avg. 2 alerts per week
              </div>
            </Tile>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Small subcomponents ---------- */
function Field({
  icon,
  label,
  value,
  boxed,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  boxed?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`min-w-0 ${boxed ? "rounded-xl border border-slate-200 bg-white p-3" : ""} ${muted ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <span className="text-slate-400">{icon}</span>
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function TileHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">
        {eyebrow}
      </div>
      <h2 className="mt-1.5 text-xl font-medium tracking-tight text-slate-900 md:text-[22px]">
        {title}
      </h2>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}

type Deal = {
  airline: "indigo" | "airindia" | "vistara";
  from: string;
  to: string;
  dep: string;
  arr: string;
  dur: string;
  stops: string;
  price: string;
  badge?: string;
  badgeTone?: "emerald" | "blue" | "purple";
};
const DEALS: Deal[] = [
  {
    airline: "indigo",
    from: "BOM",
    to: "DEL",
    dep: "06:40",
    arr: "08:55",
    dur: "2h 15m",
    stops: "Non-stop",
    price: "₹4,299",
    badge: "Best value",
    badgeTone: "emerald",
  },
  {
    airline: "vistara",
    from: "BLR",
    to: "DXB",
    dep: "21:10",
    arr: "00:35",
    dur: "4h 25m",
    stops: "Non-stop",
    price: "₹14,560",
    badge: "Premium",
    badgeTone: "purple",
  },
  {
    airline: "airindia",
    from: "DEL",
    to: "LHR",
    dep: "13:25",
    arr: "18:10",
    dur: "9h 15m",
    stops: "Non-stop",
    price: "₹42,800",
    badge: "Direct",
    badgeTone: "blue",
  },
  {
    airline: "indigo",
    from: "MAA",
    to: "SIN",
    dep: "23:50",
    arr: "06:40",
    dur: "4h 20m",
    stops: "Non-stop",
    price: "₹18,240",
    badge: "Fastest",
    badgeTone: "blue",
  },
];

function DealCard(d: Deal) {
  const toneMap = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    purple: "bg-purple-50 text-purple-700 ring-purple-100",
  } as const;
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <AirlineLogo code={d.airline} />
        {d.badge && (
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ${toneMap[d.badgeTone ?? "blue"]}`}
          >
            {d.badge}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {d.from}
          </div>
          <div className="text-xl font-bold text-slate-900">{d.dep}</div>
        </div>
        <div className="flex flex-1 flex-col items-center px-3">
          <div className="text-[10px] text-slate-500">{d.dur}</div>
          <div className="relative my-1 h-px w-full bg-slate-200">
            <Plane
              size={12}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white text-blue-600"
            />
          </div>
          <div className="text-[10px] text-emerald-600">{d.stops}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {d.to}
          </div>
          <div className="text-xl font-bold text-slate-900">{d.arr}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">From</div>
          <div className="text-lg font-bold text-slate-900">{d.price}</div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-blue-600">
          Book <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}
