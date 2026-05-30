import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Plane, CarTaxiFront, Bike, Hotel, Search, MapPin, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import {
  OurServicesSection,
  WhatWeOfferSection,
  PricingSection,
  QrDownloadSection,
} from "@/components/HomeSections";
import { useActiveSection } from "@/hooks/useActiveSection";
import { SectionDotNav } from "@/components/SectionDotNav";

export const Route = createFileRoute("/")({ component: Index });

/** Ordered list of every section id rendered on this page. */
const SECTION_IDS = ["hero", "services", "offers", "pricing", "download"];

type HeroTab = "flights" | "cab" | "bike" | "hotels";

const HERO: Record<HeroTab, { image: string; lead: string; italic: string; sub: string; icon: typeof Plane }> = {
  flights: {
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80",
    lead: "Fly to your",
    italic: "dream destination",
    sub: "Real-time fares across 500+ airlines — booked in seconds.",
    icon: Plane,
  },
  cab: {
    image: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=1920&q=80",
    lead: "Your ride,",
    italic: "on your terms",
    sub: "On-demand cabs with transparent pricing and verified drivers.",
    icon: CarTaxiFront,
  },
  bike: {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    lead: "Explore the city",
    italic: "your way",
    sub: "Pool a bike ride, beat traffic, and travel light.",
    icon: Bike,
  },
  hotels: {
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80",
    lead: "Find your next",
    italic: "perfect stay",
    sub: "Hand-picked hotels across 200+ destinations — booked in seconds.",
    icon: Hotel,
  },
};

const TABS: { id: HeroTab; label: string; to: string }[] = [
  { id: "flights", label: "Flights", to: "/flights" },
  { id: "cab", label: "Cab", to: "/cab" },
  { id: "bike", label: "Bike", to: "/bike-pooling" },
  { id: "hotels", label: "Hotels", to: "/hotels" },
];

function Index() {
  const [tab, setTab] = useState<HeroTab>("hotels");
  const [destination, setDestination] = useState("");
  const data = HERO[tab];

  // Single IntersectionObserver — the only source of truth for active section.
  const activeSection = useActiveSection(SECTION_IDS);

  return (
    <div className="min-h-screen bg-background">
      <Navbar overlay activeSection={activeSection} />
      <FloatingSidebar />
      <SectionDotNav sectionIds={SECTION_IDS} activeSection={activeSection} />

      {/* HERO */}
      <section id="hero" className="relative h-[100vh] min-h-[680px] w-full overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={tab}
            src={data.image}
            alt={tab}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[1320px] h-full px-6 flex flex-col items-center justify-center text-center">
          {/* Tabs */}
          <div className="mt-24 flex flex-wrap justify-center gap-2 p-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
            {TABS.map(({ id, label }) => {
              const Icon = HERO[id].icon;
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={
                    "relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all " +
                    (active
                      ? "bg-[#2563EB] text-white shadow-[0_8px_24px_rgba(37,99,235,0.5)]"
                      : "text-white/85 hover:bg-white/10")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Headline */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mt-10 max-w-4xl text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="block text-5xl md:text-7xl font-bold leading-tight">{data.lead}</span>
              <span className="block text-5xl md:text-7xl italic leading-tight" style={{ color: "#E8A87C" }}>
                {data.italic}
              </span>
            </motion.h1>
          </AnimatePresence>

          <p className="mt-6 max-w-xl text-base md:text-lg text-white/80">{data.sub}</p>

          {/* Search card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 w-full max-w-4xl bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-3 flex flex-col md:flex-row items-stretch gap-2"
          >
            <Field icon={<MapPin className="h-4 w-4" />} label="Destination">
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to?"
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-foreground/40"
              />
            </Field>
            <Divider />
            <Field icon={<Calendar className="h-4 w-4" />} label="Check-in">
              <input type="date" className="w-full bg-transparent text-sm focus:outline-none" />
            </Field>
            <Divider />
            <Field icon={<Calendar className="h-4 w-4" />} label="Check-out">
              <input type="date" className="w-full bg-transparent text-sm focus:outline-none" />
            </Field>
            <Divider />
            <Field icon={<Users className="h-4 w-4" />} label="Guests">
              <select className="w-full bg-transparent text-sm focus:outline-none">
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4+ Guests</option>
              </select>
            </Field>
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() =>
                destination
                  ? toast.success(`Searching ${tab} for "${destination}"...`)
                  : toast.error("Enter a destination first.")
              }
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[14px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-[0_8px_24px_rgba(37,99,235,0.45)] transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
            </motion.button>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-[1320px] px-6 pt-16 pb-16">
        <OurServicesSection />
        <WhatWeOfferSection />
        <PricingSection />
        <QrDownloadSection />
      </main>

      <Footer />
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex-1 flex items-center gap-3 px-4 py-2 rounded-[14px] hover:bg-secondary/40 transition-colors cursor-pointer">
      <span className="text-foreground/50">{icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-[10px] uppercase tracking-wider text-foreground/50 font-semibold">
          {label}
        </span>
        {children}
      </span>
    </label>
  );
}

function Divider() {
  return <div className="hidden md:block w-px self-stretch bg-foreground/10" />;
}
