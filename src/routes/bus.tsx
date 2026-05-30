import { createFileRoute, Link } from "@tanstack/react-router";
import { BusGoLayout } from "@/components/busgo/Shell";
import { SearchWidget } from "@/components/busgo/SearchWidget";
import { POPULAR_ROUTES, STATE_RTCS, formatINR } from "@/lib/busgo/theme";
import { Shield, Headphones, Network, RefreshCcw, Landmark, Tag } from "lucide-react";

export const Route = createFileRoute("/bus")({
  head: () => ({
    meta: [
      { title: "BusGo — Book Bus Tickets Online | Govt + Private Operators" },
      { name: "description", content: "Book bus tickets across India — MSRTC, KSRTC, GSRTC, UPSRTC and 1000+ private operators. Lowest fares, instant confirmation." },
    ],
  }),
  component: BusHome,
});

function BusHome() {
  return (
    <BusGoLayout>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#D84040] via-[#C73838] to-[#9F2828] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-32 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3">India's Largest Bus Booking Platform</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">Government RTCs + private operators • 1M+ daily travelers • Lowest fares guaranteed</p>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 -mt-20 pb-8">
          <SearchWidget />
        </div>
      </section>

      {/* POPULAR ROUTES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Popular Routes</h2>
            <p className="text-sm text-gray-500 mt-1">Most booked journeys this week</p>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
          {POPULAR_ROUTES.map((r) => (
            <Link key={`${r.from}-${r.to}`} to="/bus/results"
              search={{ from: r.from, to: r.to, date: new Date().toISOString().split("T")[0], seats: 1 }}
              className="min-w-[260px] snap-start bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#D84040] hover:shadow-lg transition group">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                <span>{r.from}</span>
                <span className="text-[#D84040] group-hover:translate-x-1 transition-transform">→</span>
                <span>{r.to}</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xs text-gray-500">Starts from</span>
                <span className="text-lg font-bold text-[#D84040]">{formatINR(r.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY BUSGO */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-10">Why BusGo?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { Icon: Network, t: "Largest Network", d: "1000+ operators, 100k+ routes" },
              { Icon: Shield, t: "Safe Travel", d: "Verified operators & insurance" },
              { Icon: RefreshCcw, t: "Easy Cancellation", d: "Refund within 24 hours" },
              { Icon: Headphones, t: "24/7 Support", d: "Phone, chat, email anytime" },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="bg-gray-50 rounded-2xl p-6 hover:bg-red-50 transition">
                <div className="h-12 w-12 rounded-xl bg-[#D84040] text-white flex items-center justify-center mb-4"><Icon className="h-6 w-6" /></div>
                <h3 className="font-bold text-gray-900 mb-1">{t}</h3>
                <p className="text-sm text-gray-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GOVT BUSES BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-wider mb-3">
              <Landmark className="h-3.5 w-3.5" /> Govt. RTC
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">Book Government Buses</h2>
            <p className="text-white/85 mb-6 max-w-2xl">Official state transport corporations — MSRTC, KSRTC, GSRTC, UPSRTC, TSRTC, HRTC & more. Reliable, affordable, government-backed.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATE_RTCS.map((rtc) => (
                <div key={rtc.code} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3 hover:bg-white/20 transition cursor-pointer">
                  <div className="font-bold text-sm">{rtc.code}</div>
                  <div className="text-xs text-white/70 truncate">{rtc.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS */}
      <section id="offers" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <Tag className="h-7 w-7 text-[#D84040]" /> Offers & Promo Codes
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { code: "FIRST100", t: "₹100 off first booking", d: "New users. Min. fare ₹500." },
            { code: "WEEKEND50", t: "Flat 5% off weekend trips", d: "Up to ₹150. Fri-Sun journeys." },
            { code: "GOVT75", t: "₹75 off govt buses", d: "Valid on MSRTC, KSRTC, GSRTC." },
          ].map((o) => (
            <div key={o.code} className="bg-white rounded-2xl border-2 border-dashed border-[#D84040]/40 p-5 relative">
              <div className="absolute -top-2 left-5 bg-[#D84040] text-white text-xs font-bold px-2.5 py-0.5 rounded">{o.code}</div>
              <h3 className="font-bold text-gray-900 mt-3">{o.t}</h3>
              <p className="text-sm text-gray-600 mt-1">{o.d}</p>
            </div>
          ))}
        </div>
      </section>
    </BusGoLayout>
  );
}
