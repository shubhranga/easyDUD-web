import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, Calendar, MapPin, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { City } from "@/lib/busgo/types";

export function SearchWidget({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    supabase.from("cities").select("*").order("popular", { ascending: false }).then(({ data }) => {
      if (data) setCities(data as City[]);
    });
  }, []);

  const swap = () => { setFrom(to); setTo(from); };

  const onSearch = () => {
    if (!from || !to || from === to) return;
    navigate({ to: "/bus/results", search: { from, to, date, seats: 1 } });
  };

  const today = new Date().toISOString().split("T")[0];
  const max = new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0];

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-2xl p-3 md:p-4 grid gap-2",
      compact ? "md:grid-cols-[1fr_auto_1fr_auto_auto]" : "md:grid-cols-[1fr_auto_1fr_180px_auto]"
    )}>
      <CityField label="From" icon={<MapPin className="h-4 w-4" />} cities={cities} value={from} onChange={setFrom} exclude={to} />
      <button onClick={swap} aria-label="Swap" className="hidden md:flex h-12 w-12 self-end rounded-full bg-gray-50 hover:bg-[#D84040] hover:text-white border border-gray-200 items-center justify-center transition-colors">
        <ArrowLeftRight className="h-4 w-4" />
      </button>
      <CityField label="To" icon={<MapPin className="h-4 w-4" />} cities={cities} value={to} onChange={setTo} exclude={from} />
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 px-1">Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input type="date" value={date} min={today} max={max} onChange={(e) => setDate(e.target.value)}
            className="w-full h-12 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D84040] focus:outline-none text-sm font-medium" />
        </div>
      </div>
      <button onClick={onSearch} disabled={!from || !to || from === to}
        className="h-12 px-6 self-end rounded-lg bg-[#D84040] hover:bg-[#B83333] disabled:bg-gray-300 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors">
        <Search className="h-4 w-4" /> Search Buses
      </button>
    </div>
  );
}

function CityField({ label, icon, cities, value, onChange, exclude }: { label: string; icon: React.ReactNode; cities: City[]; value: string; onChange: (v: string) => void; exclude?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setQuery(value), [value]);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = cities.filter(c => c.name !== exclude && c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  return (
    <div className="flex flex-col" ref={ref}>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 px-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          placeholder="Enter city" className="w-full h-12 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#D84040] focus:outline-none text-sm font-medium" />
        {open && filtered.length > 0 && (
          <div className="absolute z-30 top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-100 max-h-64 overflow-auto">
            {filtered.map(c => (
              <button key={c.id} type="button" onClick={() => { onChange(c.name); setQuery(c.name); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 flex items-center justify-between border-b last:border-0 border-gray-50">
                <div>
                  <div className="font-medium text-sm text-gray-900">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.state}</div>
                </div>
                {c.popular && <span className="text-[10px] uppercase tracking-wide text-[#D84040] font-bold">Popular</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
