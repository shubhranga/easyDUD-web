import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { BusGoLayout } from "@/components/busgo/Shell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, formatDateIN, minsToHrs } from "@/lib/busgo/theme";
import type { RouteRow, PendingBooking } from "@/lib/busgo/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Landmark } from "lucide-react";

const search = z.object({
  routeId: fallback(z.string(), "").default(""),
  date: fallback(z.string(), new Date().toISOString().split("T")[0]).default(new Date().toISOString().split("T")[0]),
  seats: fallback(z.number(), 1).default(1),
});

export const Route = createFileRoute("/bus/seats")({
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Select Seats — BusGo" }] }),
  component: SeatsPage,
});

const BOARDING = ["Main Bus Stand", "City Center", "Highway Junction"];
const DROPPING = ["Central Bus Stand", "Old City", "Bypass Road"];

function SeatsPage() {
  const { routeId, date, seats: seatCount } = Route.useSearch();
  const navigate = useNavigate();
  const [route, setRoute] = useState<RouteRow | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [deck, setDeck] = useState<"upper" | "lower">("lower");
  const [boarding, setBoarding] = useState(BOARDING[0]);
  const [dropping, setDropping] = useState(DROPPING[0]);

  useEffect(() => {
    if (!routeId) return;
    supabase.from("routes")
      .select("*, buses(*), from_city:cities!routes_from_city_id_fkey(*), to_city:cities!routes_to_city_id_fkey(*)")
      .eq("id", routeId).single().then(({ data }) => setRoute(data as unknown as RouteRow));
  }, [routeId]);

  // deterministic "booked" seats based on routeId
  const bookedSet = useMemo(() => {
    const set = new Set<string>();
    if (!routeId) return set;
    let s = 0; for (let i = 0; i < routeId.length; i++) s = (s * 31 + routeId.charCodeAt(i)) >>> 0;
    const rng = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
    const total = route?.seats_total ?? 36;
    for (let i = 0; i < Math.floor(total * 0.35); i++) {
      const seatIdx = Math.floor(rng() * total) + 1;
      set.add(seatLabel(seatIdx));
    }
    return set;
  }, [routeId, route]);

  const ladiesSet = useMemo(() => {
    const set = new Set<string>();
    if (!route) return set;
    for (let i = 1; i <= 4; i++) set.add(seatLabel(i));
    return set;
  }, [route]);

  const isSleeper = route?.buses?.bus_type.toLowerCase().includes("sleeper");
  const seatsPerDeck = isSleeper ? Math.ceil((route?.seats_total ?? 36) / 2) : (route?.seats_total ?? 36);
  const visibleSeats = isSleeper
    ? Array.from({ length: seatsPerDeck }, (_, i) => i + 1 + (deck === "upper" ? seatsPerDeck : 0))
    : Array.from({ length: route?.seats_total ?? 36 }, (_, i) => i + 1);

  const toggleSeat = (n: string) => {
    if (bookedSet.has(n)) return;
    setSelected(prev => {
      if (prev.includes(n)) return prev.filter(x => x !== n);
      if (prev.length >= seatCount) { toast.error(`Maximum ${seatCount} seat(s) allowed`); return prev; }
      return [...prev, n];
    });
  };

  const baseFare = (route?.price ?? 0) * selected.length;
  const gst = baseFare * 0.05;
  const conv = selected.length ? 25 : 0;
  const total = baseFare + gst + conv;

  const proceed = () => {
    if (!route || selected.length === 0) { toast.error("Please select at least 1 seat"); return; }
    if (selected.length !== seatCount) { toast.error(`Please select ${seatCount} seat(s)`); return; }
    const pending: PendingBooking = {
      routeId: route.id, date, seats: selected, totalFare: total,
      boardingPoint: boarding, droppingPoint: dropping,
      operator: route.buses!.operator_name, busType: route.buses!.bus_type,
      isGovt: route.buses!.is_government,
      from: route.from_city!.name, to: route.to_city!.name,
      departure: route.departure_time, arrival: route.arrival_time,
    };
    sessionStorage.setItem("busgo:pending", JSON.stringify(pending));
    navigate({ to: "/bus/checkout" });
  };

  return (
    <BusGoLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
        {/* LEFT — SEAT MAP */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-lg text-gray-900">Select Seats</h2>
              <p className="text-xs text-gray-500">{route?.buses?.operator_name} • {route?.buses?.bus_type}</p>
            </div>
            {isSleeper && (
              <div className="bg-gray-100 p-1 rounded-lg flex">
                {(["lower", "upper"] as const).map(d => (
                  <button key={d} onClick={() => setDeck(d)}
                    className={cn("px-3 py-1 text-xs font-semibold rounded capitalize",
                      deck === d ? "bg-white shadow text-[#D84040]" : "text-gray-600")}>
                    {d} deck
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-xs mb-5">
            <Legend color="bg-white border-2 border-gray-300" label="Available" />
            <Legend color="bg-gray-300" label="Booked" />
            <Legend color="bg-[#D84040]" label="Selected" />
            <Legend color="bg-pink-300" label="Ladies only" />
          </div>

          <div className="border-2 border-gray-200 rounded-2xl p-5 bg-gray-50 max-w-md mx-auto">
            <div className="text-[10px] uppercase tracking-widest text-gray-400 text-right mb-2">🚍 Driver</div>
            <div className="grid grid-cols-5 gap-2">
              {visibleSeats.map(i => {
                const label = seatLabel(i);
                const booked = bookedSet.has(label);
                const sel = selected.includes(label);
                const ladies = ladiesSet.has(label);
                // aisle gap every 2nd column
                const gap = i % 5 === 3 ? "col-start-5" : undefined;
                return (
                  <button key={label} onClick={() => toggleSeat(label)} disabled={booked}
                    className={cn("h-10 rounded text-[11px] font-bold border-2 transition",
                      gap,
                      booked ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed" :
                      sel ? "bg-[#D84040] border-[#D84040] text-white" :
                      ladies ? "bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200" :
                      "bg-white border-gray-300 text-gray-700 hover:border-[#D84040]"
                    )}>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {selected.length > 0 && (
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">Selected:</span>{" "}
              <span className="font-bold text-[#D84040]">{selected.join(", ")}</span>
            </div>
          )}
        </div>

        {/* RIGHT — SUMMARY */}
        <aside className="bg-white rounded-2xl p-5 shadow-sm h-fit lg:sticky lg:top-20">
          <h3 className="font-bold text-gray-900 mb-3">Booking Summary</h3>
          {route ? (
            <>
              <div className="text-sm text-gray-700 mb-3">
                <div className="font-semibold">{route.from_city?.name} → {route.to_city?.name}</div>
                <div className="text-xs text-gray-500">{formatDateIN(date)} • {route.departure_time} – {route.arrival_time} • {minsToHrs(route.duration_mins)}</div>
              </div>
              <div className="text-sm flex items-center gap-2 mb-4">
                <span className="font-medium text-gray-800">{route.buses?.operator_name}</span>
                {route.buses?.is_government && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#1E3A8A] bg-blue-50 px-1.5 py-0.5 rounded">
                    <Landmark className="h-3 w-3" /> Govt
                  </span>
                )}
              </div>
              <Field label="Boarding"><select value={boarding} onChange={(e) => setBoarding(e.target.value)} className="w-full h-10 rounded-md border border-gray-200 px-2 text-sm">{BOARDING.map(p => <option key={p}>{p}</option>)}</select></Field>
              <Field label="Dropping"><select value={dropping} onChange={(e) => setDropping(e.target.value)} className="w-full h-10 rounded-md border border-gray-200 px-2 text-sm">{DROPPING.map(p => <option key={p}>{p}</option>)}</select></Field>
              <div className="mt-4 border-t border-gray-100 pt-3 space-y-1.5 text-sm">
                <Row k={`Base fare × ${selected.length || 0}`} v={formatINR(baseFare)} />
                <Row k="GST (5%)" v={formatINR(gst)} />
                <Row k="Convenience fee" v={formatINR(conv)} />
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-[#D84040]">{formatINR(total)}</span>
              </div>
              <button onClick={proceed} disabled={!selected.length}
                className="mt-4 w-full h-12 rounded-lg bg-[#D84040] hover:bg-[#B83333] disabled:bg-gray-300 text-white font-bold">
                PROCEED TO BOOK
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-500">Loading bus details…</p>
          )}
        </aside>
      </div>
    </BusGoLayout>
  );
}

function seatLabel(n: number) {
  const row = Math.ceil(n / 4);
  const col = ["A","B","C","D"][(n - 1) % 4];
  return `${row}${col}`;
}
function Legend({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-1.5"><span className={cn("h-4 w-4 rounded", color)} /> <span className="text-gray-600">{label}</span></div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mb-2"><div className="text-[11px] uppercase tracking-wide font-bold text-gray-500 mb-1">{label}</div>{children}</div>;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between text-gray-600"><span>{k}</span><span className="font-medium text-gray-900">{v}</span></div>;
}
