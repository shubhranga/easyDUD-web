import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { BusGoLayout } from "@/components/busgo/Shell";
import { SearchWidget } from "@/components/busgo/SearchWidget";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, formatDateIN, minsToHrs } from "@/lib/busgo/theme";
import type { RouteRow } from "@/lib/busgo/types";
import { Landmark, Star, Wifi, Plug, Snowflake, Coffee, Droplet, Filter, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const search = z.object({
  from: fallback(z.string(), "").default(""),
  to: fallback(z.string(), "").default(""),
  date: fallback(z.string(), new Date().toISOString().split("T")[0]).default(new Date().toISOString().split("T")[0]),
  seats: fallback(z.number(), 1).default(1),
});

export const Route = createFileRoute("/bus/results")({
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Search Results — BusGo" }] }),
  component: ResultsPage,
});

const BUS_TYPES = ["AC Sleeper", "AC Semi-Sleeper", "Non-AC Sleeper", "AC Seater", "Volvo"] as const;
const AMENITIES = ["WiFi", "Charging Point", "Blanket", "Meals", "Water Bottle"] as const;

interface Filters {
  busTypes: Set<string>;
  operator: "all" | "private" | "government";
  timeSlots: Set<"morning" | "afternoon" | "night">;
  price: [number, number];
  amenities: Set<string>;
  rating4Plus: boolean;
}

type SortKey = "departure" | "priceLow" | "priceHigh" | "rating" | "duration";

function ResultsPage() {
  const { from, to, date, seats } = Route.useSearch();
  const [routes, setRoutes] = useState<RouteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("departure");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    busTypes: new Set(), operator: "all", timeSlots: new Set(),
    price: [100, 3000], amenities: new Set(), rating4Plus: false,
  });

  useEffect(() => {
    if (!from || !to) { setLoading(false); return; }
    setLoading(true);
    (async () => {
      const { data: cities } = await supabase.from("cities").select("id,name").in("name", [from, to]);
      const fromId = cities?.find(c => c.name === from)?.id;
      const toId = cities?.find(c => c.name === to)?.id;
      if (!fromId || !toId) { setRoutes([]); setLoading(false); return; }
      const { data } = await supabase.from("routes")
        .select("*, buses(*), from_city:cities!routes_from_city_id_fkey(*), to_city:cities!routes_to_city_id_fkey(*)")
        .eq("from_city_id", fromId).eq("to_city_id", toId);
      setRoutes((data as unknown as RouteRow[]) ?? []);
      setLoading(false);
    })();
  }, [from, to]);

  const filtered = useMemo(() => {
    let list = routes.filter(r => r.buses);
    if (filters.busTypes.size) list = list.filter(r => filters.busTypes.has(r.buses!.bus_type));
    if (filters.operator === "private") list = list.filter(r => !r.buses!.is_government);
    if (filters.operator === "government") list = list.filter(r => r.buses!.is_government);
    if (filters.timeSlots.size) list = list.filter(r => {
      const h = parseInt(r.departure_time.split(":")[0]);
      if (filters.timeSlots.has("morning") && h >= 6 && h < 12) return true;
      if (filters.timeSlots.has("afternoon") && h >= 12 && h < 18) return true;
      if (filters.timeSlots.has("night") && (h >= 18 || h < 6)) return true;
      return false;
    });
    list = list.filter(r => r.price >= filters.price[0] && r.price <= filters.price[1]);
    if (filters.amenities.size) list = list.filter(r => [...filters.amenities].every(a => r.buses!.amenities.includes(a)));
    if (filters.rating4Plus) list = list.filter(r => r.buses!.rating >= 4);
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "priceLow": return a.price - b.price;
        case "priceHigh": return b.price - a.price;
        case "rating": return b.buses!.rating - a.buses!.rating;
        case "duration": return a.duration_mins - b.duration_mins;
        default: return a.departure_time.localeCompare(b.departure_time);
      }
    });
    return sorted;
  }, [routes, filters, sort]);

  const toggleSet = (set: Set<string>, val: string) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    return next;
  };

  return (
    <BusGoLayout>
      {/* Re-search bar */}
      <div className="bg-[#D84040] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SearchWidget compact />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900">{from || "—"} → {to || "—"}</h1>
            <p className="text-sm text-gray-500">{formatDateIN(date)} • {filtered.length} buses • {seats} seat(s)</p>
          </div>
          <button onClick={() => setShowFilters(v => !v)} className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-md bg-white border border-gray-200 text-sm font-medium">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* FILTERS */}
          <aside className={cn("space-y-4", showFilters ? "block" : "hidden lg:block")}>
            <FilterCard title="Operator Type">
              <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
                {(["all", "private", "government"] as const).map(op => (
                  <button key={op} onClick={() => setFilters(f => ({ ...f, operator: op }))}
                    className={cn("py-1.5 text-xs font-semibold rounded capitalize transition",
                      filters.operator === op ? "bg-white shadow text-[#D84040]" : "text-gray-600")}>
                    {op === "all" ? "Both" : op === "government" ? "Govt" : op}
                  </button>
                ))}
              </div>
            </FilterCard>
            <FilterCard title="Bus Type">
              {BUS_TYPES.map(t => (
                <Checkbox key={t} label={t} checked={filters.busTypes.has(t)} onChange={() => setFilters(f => ({ ...f, busTypes: toggleSet(f.busTypes, t) }))} />
              ))}
            </FilterCard>
            <FilterCard title="Departure">
              {[["morning","6am – 12pm"],["afternoon","12pm – 6pm"],["night","6pm – 6am"]].map(([k,l]) => (
                <Checkbox key={k} label={l} checked={filters.timeSlots.has(k as never)} onChange={() => setFilters(f => ({ ...f, timeSlots: toggleSet(f.timeSlots as Set<string>, k) as Set<"morning"|"afternoon"|"night"> }))} />
              ))}
            </FilterCard>
            <FilterCard title={`Price ₹${filters.price[0]} – ₹${filters.price[1]}`}>
              <input type="range" min={100} max={3000} step={50} value={filters.price[1]}
                onChange={(e) => setFilters(f => ({ ...f, price: [100, +e.target.value] }))}
                className="w-full accent-[#D84040]" />
            </FilterCard>
            <FilterCard title="Amenities">
              {AMENITIES.map(a => (
                <Checkbox key={a} label={a} checked={filters.amenities.has(a)} onChange={() => setFilters(f => ({ ...f, amenities: toggleSet(f.amenities, a) }))} />
              ))}
            </FilterCard>
            <FilterCard title="Rating">
              <Checkbox label="4★ and above" checked={filters.rating4Plus} onChange={() => setFilters(f => ({ ...f, rating4Plus: !f.rating4Plus }))} />
            </FilterCard>
          </aside>

          {/* RESULTS */}
          <div>
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {([
                ["departure", "Departure"], ["priceLow", "Price ↑"], ["priceHigh", "Price ↓"],
                ["rating", "Rating"], ["duration", "Duration"],
              ] as [SortKey, string][]).map(([k, l]) => (
                <button key={k} onClick={() => setSort(k)}
                  className={cn("px-3 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap transition",
                    sort === k ? "bg-[#D84040] text-white border-[#D84040]" : "bg-white text-gray-700 border-gray-200")}>
                  {l}
                </button>
              ))}
            </div>
            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center text-gray-500">Searching buses…</div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <p className="text-gray-700 font-medium mb-2">No buses match your filters</p>
                <p className="text-sm text-gray-500">Try different filters or another date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(r => <BusCard key={r.id} route={r} date={date} seats={seats} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </BusGoLayout>
  );
}

function FilterCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100">
      <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-[#D84040]">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-[#D84040] h-4 w-4" />
      {label}
    </label>
  );
}

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi, "Charging Point": Plug, AC: Snowflake, Meals: Coffee, "Water Bottle": Droplet,
};

function BusCard({ route, date, seats }: { route: RouteRow; date: string; seats: number }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const bus = route.buses!;
  const isGovt = bus.is_government;
  const seatsLeft = Math.max(0, route.seats_total - Math.floor(Math.random() * 25));
  const originalPrice = Math.round(route.price * 1.15);

  return (
    <div className={cn("bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border-l-4",
      isGovt ? "border-[#1E3A8A]" : "border-transparent")}>
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-[220px]">
            <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center font-black text-white text-sm shrink-0",
              isGovt ? "bg-[#1E3A8A]" : "bg-gradient-to-br from-[#D84040] to-[#9F2828]")}>
              {bus.operator_name.split(" ").map(w => w[0]).slice(0,2).join("")}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-gray-900 truncate">{bus.operator_name}</h3>
                {isGovt && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-[#1E3A8A] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    <Landmark className="h-3 w-3" /> Govt. RTC
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span className="bg-gray-100 px-2 py-0.5 rounded">{bus.bus_type}</span>
                <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold">
                  <Star className="h-3 w-3 fill-current" /> {bus.rating.toFixed(1)}
                </span>
                <span className="text-gray-400">({bus.total_rating_count})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-center">
              <div className="font-bold text-gray-900">{route.departure_time}</div>
              <div className="text-xs text-gray-500">{route.from_city?.name}</div>
            </div>
            <div className="flex flex-col items-center min-w-[80px]">
              <div className="text-xs text-gray-500 mb-1">{minsToHrs(route.duration_mins)}</div>
              <div className="relative w-full h-px bg-gray-300">
                <ArrowRight className="absolute right-0 -top-1.5 h-3 w-3 text-gray-400" />
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">{route.arrival_time}</div>
              <div className="text-xs text-gray-500">{route.to_city?.name}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-400 line-through">{formatINR(originalPrice)}</div>
            <div className="text-2xl font-black text-[#D84040]">{formatINR(route.price)}</div>
            <div className={cn("text-[11px] font-bold uppercase tracking-wide mt-0.5",
              seatsLeft <= 5 ? "text-red-600" : "text-green-600")}>
              {seatsLeft <= 5 ? `Only ${seatsLeft} left` : `${seatsLeft} seats`}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {["AC", ...bus.amenities].slice(0, 5).map(a => {
              const Icon = AMENITY_ICONS[a];
              return (
                <span key={a} className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  {Icon && <Icon className="h-3 w-3" />} {a}
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setExpanded(v => !v)} className="text-xs font-semibold text-gray-600 hover:text-[#D84040]">
              {expanded ? "Hide details" : "View details"}
            </button>
            <button onClick={() => navigate({ to: "/bus/seats", search: { routeId: route.id, date, seats } })}
              className="h-10 px-5 rounded-lg bg-[#D84040] hover:bg-[#B83333] text-white font-bold text-sm">
              VIEW SEATS
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Boarding points</h4>
              <p className="text-gray-600">Main Bus Stand, City Center, Highway Junction</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Dropping points</h4>
              <p className="text-gray-600">Central Bus Stand, Old City, Bypass Road</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Cancellation</h4>
              <p className="text-gray-600">{isGovt ? "As per government policy" : "50% refund up to 12h before departure"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
