import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SearchHero } from "@/components/hotels/SearchHero";
import { PopularDestinations } from "@/components/hotels/PopularDestinations";
import { FilterSidebar, type Filters } from "@/components/hotels/FilterSidebar";
import { HotelCard, HotelCardSkeleton } from "@/components/hotels/HotelCard";
import { ResultsHeader } from "@/components/hotels/ResultsHeader";
import { RecentlyViewed } from "@/components/hotels/RecentlyViewed";
import { HOTELS, type Hotel } from "@/lib/hotels-data";

export const Route = createFileRoute("/hotels")({
  head: () => ({
    meta: [
      { title: "Hotels — easyDUD" },
      {
        name: "description",
        content:
          "Discover and book hand-picked hotels across 200+ destinations with flexible cancellation on easyDUD.",
      },
      { property: "og:title", content: "Hotels — easyDUD" },
      {
        property: "og:description",
        content: "Discover and book hand-picked hotels across 200+ destinations.",
      },
    ],
  }),
  component: HotelsPage,
});

function HotelsPage() {
  const [city, setCity] = useState("All");
  const [filters, setFilters] = useState<Filters>({
    maxPrice: 500,
    minRating: 3,
    amenities: [],
  });
  const [sort, setSort] = useState("recommended");
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState<Hotel[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let r = HOTELS.filter((h) => {
      if (city !== "All" && h.city !== city) return false;
      if (h.price > filters.maxPrice) return false;
      if (h.rating < filters.minRating) return false;
      if (
        filters.amenities.length &&
        !filters.amenities.every((a) => h.amenities.includes(a))
      )
        return false;
      return true;
    });
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [city, filters, sort]);

  const handleView = (h: Hotel) => {
    setRecent((prev) => [h, ...prev.filter((x) => x.id !== h.id)].slice(0, 6));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafbfc", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
      <Navbar />

      <SearchHero
        onSearch={(q) => {
          if (q.destination) setCity(q.destination);
        }}
      />

      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px 120px",
          marginTop: -48,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ marginBottom: 32 }}>
          <PopularDestinations active={city} onSelect={setCity} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 280px) minmax(0, 1fr)",
            gap: 32,
            alignItems: "start",
          }}
          className="hotels-grid"
        >
          <div className="hotels-sidebar">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          <div style={{ minWidth: 0 }}>
            <ResultsHeader count={filtered.length} sort={sort} onSort={setSort} />

            <div
              style={{
                marginTop: 24,
                display: "grid",
                gap: 22,
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              }}
            >
              <AnimatePresence mode="wait">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <HotelCardSkeleton key={i} />
                    ))
                  : filtered.length === 0
                    ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          gridColumn: "1 / -1",
                          padding: "60px 24px",
                          textAlign: "center",
                          background: "#fff",
                          borderRadius: 24,
                          border: "1px dashed rgba(15,23,42,0.12)",
                        }}
                      >
                        <div
                          style={{
                            width: 72,
                            height: 72,
                            margin: "0 auto 16px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#dbeafe,#ede9fe)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Search size={28} color="#2563EB" />
                        </div>
                        <h3
                          style={{
                            margin: 0,
                            fontFamily: "'DM Serif Display', Georgia, serif",
                            fontSize: 22,
                            color: "#0f172a",
                          }}
                        >
                          No stays match your filters
                        </h3>
                        <p style={{ marginTop: 8, color: "#64748b", fontSize: 14 }}>
                          Try widening your price range or removing amenities.
                        </p>
                      </motion.div>
                    )
                    : filtered.map((h, i) => (
                      <motion.div
                        key={h.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <HotelCard hotel={h} onView={handleView} />
                      </motion.div>
                    ))}
              </AnimatePresence>
            </div>

            <RecentlyViewed items={recent} />
          </div>
        </div>
      </main>

      {/* Sticky mobile CTA */}
      <div
        className="hotels-mobile-cta"
        style={{
          position: "fixed",
          left: 16,
          right: 16,
          bottom: 16,
          padding: 14,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 20,
          boxShadow: "0 20px 40px rgba(15,23,42,0.18)",
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          zIndex: 30,
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
            {filtered.length} stays
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>{city === "All" ? "All destinations" : city}</div>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            border: "none",
            padding: "12px 20px",
            borderRadius: 14,
            background: "linear-gradient(135deg,#2563EB,#1d4ed8)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 8px 18px rgba(37,99,235,0.35)",
          }}
        >
          New search
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hotels-grid { grid-template-columns: 1fr !important; }
          .hotels-sidebar { position: static !important; }
        }
        @media (max-width: 640px) {
          .hotels-mobile-cta { display: flex !important; }
        }
        @media (min-width: 1600px) {
          .hotels-grid > div:last-child > div:nth-child(2) {
            grid-template-columns: repeat(4, minmax(0,1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}
