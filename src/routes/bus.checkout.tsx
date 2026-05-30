import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BusGoLayout } from "@/components/busgo/Shell";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, formatDateIN, generatePNR } from "@/lib/busgo/theme";
import type { PendingBooking } from "@/lib/busgo/types";
import { toast } from "sonner";
import { CreditCard, Smartphone, Building2, Wallet, Tag, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bus/checkout")({
  head: () => ({ meta: [{ title: "Checkout — BusGo" }] }),
  component: CheckoutPage,
});

type Method = "upi" | "card" | "netbanking" | "wallet";
interface Pax { name: string; age: string; gender: string; }

function CheckoutPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<PendingBooking | null>(null);
  const [pax, setPax] = useState<Pax[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [method, setMethod] = useState<Method>("upi");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("busgo:pending");
    if (!raw) { navigate({ to: "/bus" }); return; }
    const p = JSON.parse(raw) as PendingBooking;
    setPending(p);
    setPax(p.seats.map(() => ({ name: "", age: "", gender: "M" })));
    supabase.auth.getUser().then(({ data }) => { if (data.user?.email) setEmail(data.user.email); });
  }, [navigate]);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!pending) return;
    if (code === "FIRST100") { setDiscount(100); toast.success("Promo applied: ₹100 off"); }
    else if (code === "WEEKEND50") { setDiscount(Math.min(150, pending.totalFare * 0.05)); toast.success("Weekend offer applied"); }
    else if (code === "GOVT75" && pending.isGovt) { setDiscount(75); toast.success("Govt offer applied"); }
    else { setDiscount(0); toast.error("Invalid promo code"); }
  };

  const total = (pending?.totalFare ?? 0) - discount;

  const pay = async () => {
    if (!pending) return;
    if (pax.some(p => !p.name || !p.age)) { toast.error("Fill all passenger details"); return; }
    if (!email || !phone) { toast.error("Email and phone required"); return; }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { toast.error("Please log in to complete booking"); navigate({ to: "/bus/login" }); return; }

    setLoading(true);
    const pnr = generatePNR();
    const { data: booking, error } = await supabase.from("bookings").insert({
      user_id: userData.user.id,
      route_id: pending.routeId,
      journey_date: pending.date,
      seats: pending.seats,
      total_fare: total,
      status: "confirmed",
      pnr,
      boarding_point: pending.boardingPoint,
      dropping_point: pending.droppingPoint,
    }).select().single();

    if (error || !booking) { setLoading(false); toast.error(error?.message || "Booking failed"); return; }

    await supabase.from("passengers").insert(
      pax.map((p, i) => ({ booking_id: booking.id, name: p.name, age: parseInt(p.age), gender: p.gender, seat_number: pending.seats[i] }))
    );

    sessionStorage.setItem("busgo:lastBooking", JSON.stringify({ ...pending, pnr, totalPaid: total, pax, email, phone }));
    sessionStorage.removeItem("busgo:pending");
    toast.success("Booking confirmed!");
    navigate({ to: "/bus/confirmation", search: { pnr } });
  };

  if (!pending) return <BusGoLayout><div className="p-12 text-center text-gray-500">Loading…</div></BusGoLayout>;

  return (
    <BusGoLayout>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-4">
          {/* PAX */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Passenger Details</h2>
            {pax.map((p, i) => (
              <div key={i} className="grid sm:grid-cols-[1fr_80px_120px_auto] gap-2 mb-3 items-center">
                <input value={p.name} onChange={(e) => setPax(arr => arr.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                  placeholder="Full name" className="h-10 rounded-md border border-gray-200 px-3 text-sm" />
                <input value={p.age} onChange={(e) => setPax(arr => arr.map((x, j) => j === i ? { ...x, age: e.target.value } : x))}
                  type="number" min={1} max={120} placeholder="Age" className="h-10 rounded-md border border-gray-200 px-3 text-sm" />
                <select value={p.gender} onChange={(e) => setPax(arr => arr.map((x, j) => j === i ? { ...x, gender: e.target.value } : x))}
                  className="h-10 rounded-md border border-gray-200 px-2 text-sm">
                  <option value="M">Male</option><option value="F">Female</option><option value="O">Other</option>
                </select>
                <span className="text-xs font-bold text-[#D84040]">Seat {pending.seats[i]}</span>
              </div>
            ))}
            <div className="grid sm:grid-cols-2 gap-2 mt-4">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="h-10 rounded-md border border-gray-200 px-3 text-sm" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="Phone number" className="h-10 rounded-md border border-gray-200 px-3 text-sm" />
            </div>
          </div>

          {/* PROMO */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[#D84040]" /> Have a promo code?</h3>
            <div className="flex gap-2">
              <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Enter code (e.g. FIRST100)" className="flex-1 h-10 rounded-md border border-gray-200 px-3 text-sm uppercase" />
              <button onClick={applyPromo} className="h-10 px-4 rounded-md bg-gray-900 text-white text-sm font-bold">APPLY</button>
            </div>
            {discount > 0 && <p className="text-xs text-green-700 mt-2 font-medium">– {formatINR(discount)} off applied</p>}
          </div>

          {/* PAYMENT */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {([
                ["upi", "UPI", Smartphone],
                ["card", "Card", CreditCard],
                ["netbanking", "Net Banking", Building2],
                ["wallet", "Wallets", Wallet],
              ] as [Method, string, React.ComponentType<{className?:string}>][]).map(([k, l, Icon]) => (
                <button key={k} onClick={() => setMethod(k)}
                  className={cn("p-3 rounded-lg border-2 text-left transition",
                    method === k ? "border-[#D84040] bg-red-50" : "border-gray-200 hover:border-gray-300")}>
                  <Icon className="h-5 w-5 mb-1 text-gray-700" />
                  <div className="text-xs font-semibold">{l}</div>
                </button>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              {method === "upi" && <input placeholder="yourname@upi" className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm" />}
              {method === "card" && (
                <div className="grid sm:grid-cols-2 gap-2">
                  <input placeholder="Card number" className="sm:col-span-2 h-10 rounded-md border border-gray-200 px-3 text-sm" />
                  <input placeholder="MM/YY" className="h-10 rounded-md border border-gray-200 px-3 text-sm" />
                  <input placeholder="CVV" className="h-10 rounded-md border border-gray-200 px-3 text-sm" />
                </div>
              )}
              {method === "netbanking" && (
                <select className="w-full h-10 rounded-md border border-gray-200 px-2 text-sm">
                  <option>HDFC Bank</option><option>SBI</option><option>ICICI</option><option>Axis Bank</option>
                </select>
              )}
              {method === "wallet" && (
                <select className="w-full h-10 rounded-md border border-gray-200 px-2 text-sm">
                  <option>Paytm</option><option>PhonePe</option><option>Amazon Pay</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-2xl p-5 shadow-sm h-fit lg:sticky lg:top-20">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="text-sm mb-3">
            <div className="font-semibold">{pending.from} → {pending.to}</div>
            <div className="text-xs text-gray-500">{formatDateIN(pending.date)} • {pending.departure} – {pending.arrival}</div>
          </div>
          <div className="flex items-center gap-2 text-sm mb-3">
            <span className="font-medium">{pending.operator}</span>
            {pending.isGovt && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#1E3A8A] bg-blue-50 px-1.5 py-0.5 rounded"><Landmark className="h-3 w-3" /> Govt</span>}
          </div>
          <div className="text-xs text-gray-500 mb-3">Seats: <span className="text-gray-900 font-bold">{pending.seats.join(", ")}</span></div>
          <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatINR(pending.totalFare)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>– {formatINR(discount)}</span></div>}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-black text-[#D84040]">{formatINR(total)}</span>
          </div>
          <button onClick={pay} disabled={loading}
            className="mt-4 w-full h-12 rounded-lg bg-[#D84040] hover:bg-[#B83333] text-white font-bold disabled:bg-gray-300">
            {loading ? "Processing…" : `PAY ${formatINR(total)}`}
          </button>
          <p className="text-[11px] text-gray-400 text-center mt-2">By proceeding, you agree to our T&Cs</p>
        </aside>
      </div>
    </BusGoLayout>
  );
}
