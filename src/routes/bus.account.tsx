import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BusGoLayout } from "@/components/busgo/Shell";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { formatINR, formatDateIN } from "@/lib/busgo/theme";
import { toast } from "sonner";
import { Landmark, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingRow {
  id: string; pnr: string; journey_date: string; seats: string[];
  total_fare: number; status: string; created_at: string;
  routes: {
    departure_time: string; arrival_time: string;
    buses: { operator_name: string; is_government: boolean; bus_type: string };
    from_city: { name: string }; to_city: { name: string };
  } | null;
}

export const Route = createFileRoute("/bus/account")({
  head: () => ({ meta: [{ title: "My Account — BusGo" }] }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) { navigate({ to: "/bus/login" }); return; }
      setUser(data.user);
      setProfile(p => ({ ...p, email: data.user!.email ?? "" }));

      const [{ data: profileRow }, { data: bks }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle(),
        supabase.from("bookings").select(`
          id, pnr, journey_date, seats, total_fare, status, created_at,
          routes(departure_time, arrival_time,
            buses(operator_name, is_government, bus_type),
            from_city:cities!routes_from_city_id_fkey(name),
            to_city:cities!routes_to_city_id_fkey(name))
        `).order("created_at", { ascending: false }),
      ]);
      if (profileRow) setProfile({ name: profileRow.name ?? "", email: profileRow.email ?? data.user.email ?? "", phone: profileRow.phone ?? "" });
      setBookings((bks as unknown as BookingRow[]) ?? []);
      setLoading(false);
    })();
  }, [navigate]);

  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({ id: user.id, name: profile.name, email: profile.email, phone: profile.phone, updated_at: new Date().toISOString() });
    if (error) toast.error(error.message); else toast.success("Profile saved");
  };

  const cancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) toast.error(error.message);
    else { setBookings(arr => arr.map(b => b.id === id ? { ...b, status: "cancelled" } : b)); toast.success("Booking cancelled"); }
  };

  const logout = async () => { await supabase.auth.signOut(); navigate({ to: "/bus" }); };

  return (
    <BusGoLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">My Bookings</h1>
          {loading ? <p className="text-gray-500">Loading…</p> :
           bookings.length === 0 ? (
             <div className="bg-white rounded-2xl p-10 text-center">
               <p className="text-gray-700 font-medium mb-2">No bookings yet</p>
               <Link to="/bus" className="text-[#D84040] font-bold">Book your first trip →</Link>
             </div>
           ) : (
             <div className="space-y-3">
               {bookings.map(b => (
                 <div key={b.id} className={cn("bg-white rounded-2xl p-5 shadow-sm border-l-4",
                   b.routes?.buses.is_government ? "border-[#1E3A8A]" : "border-transparent")}>
                   <div className="flex justify-between flex-wrap gap-3">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <span className="font-bold text-gray-900">{b.routes?.from_city.name} → {b.routes?.to_city.name}</span>
                         {b.routes?.buses.is_government && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#1E3A8A] bg-blue-50 px-1.5 py-0.5 rounded"><Landmark className="h-3 w-3" /> Govt</span>}
                         <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded",
                           b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600")}>
                           {b.status}
                         </span>
                       </div>
                       <div className="text-sm text-gray-600">{b.routes?.buses.operator_name} • {b.routes?.buses.bus_type}</div>
                       <div className="text-xs text-gray-500 mt-1">{formatDateIN(b.journey_date)} • {b.routes?.departure_time} – {b.routes?.arrival_time} • Seats {b.seats.join(", ")}</div>
                       <div className="text-xs text-gray-500 mt-1">PNR: <span className="font-mono font-bold text-gray-700">{b.pnr}</span></div>
                     </div>
                     <div className="text-right flex flex-col items-end justify-between">
                       <div className="text-xl font-black text-[#D84040]">{formatINR(b.total_fare)}</div>
                       {b.status === "confirmed" && (
                         <button onClick={() => cancel(b.id)} className="text-xs font-bold text-red-600 hover:underline mt-2">Cancel booking</button>
                       )}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        <aside className="bg-white rounded-2xl p-5 shadow-sm h-fit">
          <h3 className="font-bold text-gray-900 mb-3">Profile</h3>
          <label className="text-xs text-gray-500">Name</label>
          <input value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm mb-2" />
          <label className="text-xs text-gray-500">Email</label>
          <input value={profile.email} disabled className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm mb-2 bg-gray-50" />
          <label className="text-xs text-gray-500">Phone</label>
          <input value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm mb-3" />
          <button onClick={saveProfile} className="w-full h-10 rounded-md bg-gray-900 text-white text-sm font-bold mb-2">Save changes</button>
          <button onClick={logout} className="w-full h-10 rounded-md border border-gray-200 text-sm font-medium inline-flex items-center justify-center gap-1.5 text-gray-700"><LogOut className="h-4 w-4" /> Log out</button>
        </aside>
      </div>
    </BusGoLayout>
  );
}
