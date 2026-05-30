import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { BusGoLayout } from "@/components/busgo/Shell";
import { formatINR, formatDateIN } from "@/lib/busgo/theme";
import { CheckCircle2, Download, Home, Landmark } from "lucide-react";

const search = z.object({ pnr: fallback(z.string(), "").default("") });

export const Route = createFileRoute("/bus/confirmation")({
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Booking Confirmed — BusGo" }] }),
  component: ConfirmPage,
});

interface LastBooking {
  pnr: string; from: string; to: string; date: string; departure: string; arrival: string;
  operator: string; busType: string; isGovt: boolean;
  boardingPoint: string; droppingPoint: string;
  seats: string[]; totalPaid: number;
  pax: { name: string; age: string; gender: string }[];
  email: string; phone: string;
}

function ConfirmPage() {
  const { pnr } = Route.useSearch();
  const [b, setB] = useState<LastBooking | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("busgo:lastBooking");
    if (raw) setB(JSON.parse(raw));
  }, []);

  if (!b) return (
    <BusGoLayout>
      <div className="p-12 text-center">
        <p className="text-gray-700">No booking found.</p>
        <Link to="/bus" className="text-[#D84040] font-bold mt-2 inline-block">Back to home</Link>
      </div>
    </BusGoLayout>
  );

  return (
    <BusGoLayout>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-600 mx-auto mb-1" />
          <h1 className="text-xl font-black text-green-900">🎉 Booking Confirmed!</h1>
          <p className="text-sm text-green-700">A copy has been sent to {b.email}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden print:shadow-none">
          <div className="bg-[#D84040] text-white px-6 py-4 flex justify-between items-center">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">PNR</div>
              <div className="text-2xl font-black tracking-wide">{b.pnr || pnr}</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider opacity-80">BusGo Ticket</div>
              <div className="font-bold">{formatDateIN(b.date)}</div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-gray-900">{b.operator}</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{b.busType}</span>
              {b.isGovt && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#1E3A8A] bg-blue-50 px-1.5 py-0.5 rounded"><Landmark className="h-3 w-3" /> Govt RTC</span>}
            </div>

            <div className="grid grid-cols-3 items-center my-5">
              <div>
                <div className="text-2xl font-black">{b.departure}</div>
                <div className="text-sm text-gray-600">{b.from}</div>
              </div>
              <div className="text-center text-gray-400 text-xs">────────►</div>
              <div className="text-right">
                <div className="text-2xl font-black">{b.arrival}</div>
                <div className="text-sm text-gray-600">{b.to}</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm border-y border-dashed border-gray-300 py-4">
              <div><div className="text-xs text-gray-500">Boarding</div><div className="font-semibold">{b.boardingPoint}</div></div>
              <div><div className="text-xs text-gray-500">Dropping</div><div className="font-semibold">{b.droppingPoint}</div></div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-gray-500 mb-1">Passengers</div>
              {b.pax.map((p, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b last:border-0 border-gray-100">
                  <span>{p.name} <span className="text-gray-400">({p.age}, {p.gender})</span></span>
                  <span className="font-bold text-[#D84040]">Seat {b.seats[i]}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t-2 border-dashed border-gray-300 flex justify-between items-center">
              <span className="text-gray-600">Total Paid</span>
              <span className="text-2xl font-black text-gray-900">{formatINR(b.totalPaid)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5 print:hidden">
          <button onClick={() => window.print()} className="flex-1 h-12 rounded-lg bg-gray-900 text-white font-bold inline-flex items-center justify-center gap-2"><Download className="h-4 w-4" /> Download Ticket</button>
          <Link to="/bus" className="flex-1 h-12 rounded-lg bg-white border-2 border-gray-200 text-gray-800 font-bold inline-flex items-center justify-center gap-2"><Home className="h-4 w-4" /> Back to Home</Link>
        </div>
      </div>
    </BusGoLayout>
  );
}
