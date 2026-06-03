import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import {
  Download, Trash2, RefreshCw, LayoutDashboard, Hotel,
  BarChart3, Settings, LogOut, Plus, Star, IndianRupee,
  CheckCircle2, Clock, XCircle, Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useState, useEffect, useMemo } from "react";
import { getDb } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — easyDUD" },
      {
        name: "description",
        content: "View and manage hotel registrations",
      },
    ],
  }),
  component: AdminDashboard,
});

type FlagColor = "green" | "yellow" | "red";

interface Registration {
  id?: string;
  tier: string;
  hotelName: string;
  address: string;
  lat: number | null;
  lng: number | null;
  manualLocation: string;
  contactNumber?: string;
  images: string[];
  roomPricing: number;
  details: string;
  paymentMethod?: string;
  submittedAt: any;
  paymentId?: string;
  orderId?: string;
  paymentStatus?: string;
  starRating?: number;
  numRooms?: number;
  amenities?: string[];
  flag?: FlagColor | null;
}

type Tab = "Dashboard" | "Hotels" | "Analytics" | "Settings";

const NAV_ITEMS: { icon: React.ElementType; label: Tab }[] = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Hotel,           label: "Hotels"    },
  { icon: BarChart3,       label: "Analytics" },
  { icon: Settings,        label: "Settings"  },
];

function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [flagFilter, setFlagFilter] = useState<"all" | FlagColor>("all");
  const [updatingFlag, setUpdatingFlag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Dashboard");
  const db = getDb();

  /* ── intentional blank line to force clean parse below ── */

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "registrations"), orderBy("submittedAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Registration[];
      setRegistrations(data);
    } catch (error) {
      console.error("Error loading registrations:", error);
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRegistrations(); }, []);

  const stats = useMemo(() => ({
    total:    registrations.length,
    premium:  registrations.filter((r) => r.tier === "premium").length,
    basic:    registrations.filter((r) => r.tier === "basic").length,
    approved: registrations.filter((r) => (r.flag ?? "yellow") === "green").length,
    pending:  registrations.filter((r) => (r.flag ?? "yellow") === "yellow").length,
    rejected: registrations.filter((r) => (r.flag ?? "yellow") === "red").length,
  }), [registrations]);

  const updateFlag = async (id: string, flag: FlagColor) => {
    setUpdatingFlag(id);
    try {
      await updateDoc(doc(db, "registrations", id), { flag });
      setRegistrations((prev) => prev.map((r) => (r.id === id ? { ...r, flag } : r)));
      toast.success("Flag updated");
    } catch {
      toast.error("Failed to update flag");
    } finally {
      setUpdatingFlag(null);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(registrations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, "hotel_registrations.xlsx");
  };

  const clearRegistrations = async () => {
    if (!confirm("Are you sure you want to clear all registrations?")) return;
    try {
      const snapshot = await getDocs(collection(db, "registrations"));
      await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
      setRegistrations([]);
      toast.success("All registrations cleared");
    } catch {
      toast.error("Failed to clear registrations");
    }
  };

  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = [0, 0, 0, 0, 0, 0, 0];
    registrations.forEach((r) => {
      if (r.submittedAt?.toDate) {
        const d = r.submittedAt.toDate();
        const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        counts[idx]++;
      }
    });
    const max = Math.max(...counts);
    return days.map((day, i) => ({ day, count: counts[i], isMax: counts[i] === max && max > 0 }));
  }, [registrations]);

  const filtered = registrations.filter(
    (r) => flagFilter === "all" || (r.flag ?? "yellow") === flagFilter,
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f6fa]">

      {/* ── Sidebar ── */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">
            eD
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-foreground">easyDUD</p>
            <p className="text-[11px] text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV_ITEMS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === label ? "bg-[#0f172a] text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-100 px-3 py-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{activeTab}</h1>
            <p className="text-sm text-muted-foreground">
              {activeTab === "Dashboard" && "Overview of all hotel registrations"}
              {activeTab === "Hotels" && "Browse and manage all registered hotels"}
              {activeTab === "Analytics" && "Registration and flag breakdown"}
              {activeTab === "Settings" && "Admin configuration"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadRegistrations}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={exportToExcel}
              disabled={registrations.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 space-y-5 overflow-y-auto px-8 py-6">
          {activeTab === "Settings" && (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <Settings className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-foreground">Settings</p>
              <p className="mt-1 text-xs text-muted-foreground">Configuration options coming soon</p>
            </div>
          )}
          {activeTab === "Analytics" && (
            <div className="grid gap-5">
              <div className="grid grid-cols-3 gap-4">
                <StatCard icon={<CheckCircle2 className="h-5 w-5 text-green-600" />} bg="bg-green-50" label="Approved" value={stats.approved} sub="Green flagged" />
                <StatCard icon={<Clock className="h-5 w-5 text-yellow-500" />} bg="bg-yellow-50" label="Pending Review" value={stats.pending} sub="Awaiting action" />
                <StatCard icon={<XCircle className="h-5 w-5 text-red-500" />} bg="bg-red-50" label="Rejected" value={stats.rejected} sub="Red flagged" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <StatCard icon={<Hotel className="h-5 w-5 text-indigo-600" />} bg="bg-indigo-50" label="Total Hotels" value={stats.total} sub="All time" />
                <StatCard icon={<Star className="h-5 w-5 text-amber-500" />} bg="bg-amber-50" label="Premium" value={stats.premium} sub="All time" />
                <StatCard icon={<Users className="h-5 w-5 text-teal-600" />} bg="bg-teal-50" label="Basic" value={stats.basic} sub="All time" />
              </div>
              {/* Weekly Registrations Chart */}
              <div className="rounded-2xl p-6" style={{ background: "linear-gradient(140deg, #7c3aed 0%, #5b21b6 100%)" }}>
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Weekly Registrations</h2>
                    <p className="mt-0.5 text-sm text-purple-200">Registrations submitted per day</p>
                  </div>
                  <span className="rounded-xl bg-white/20 px-4 py-1.5 text-lg font-bold text-white">{stats.total} total</span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid vertical={true} horizontal={false} stroke="rgba(255,255,255,0.25)" strokeDasharray="0" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "white", fontSize: 13, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "white", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="white"
                      strokeWidth={3}
                      dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        if (!payload.isMax) return <React.Fragment key={`dot-${payload.day}`} />;
                        return (
                          <circle key={`dot-${payload.day}`} cx={cx} cy={cy} r={7} fill="transparent" stroke="white" strokeWidth={2.5} />
                        );
                      }}
                      activeDot={{ r: 6, fill: "white", stroke: "white" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {(activeTab === "Hotels" || activeTab === "Dashboard") && (
            <>
              {activeTab === "Dashboard" && (
                <>
                  <div className="grid grid-cols-4 gap-4">
                    <StatCard icon={<Hotel className="h-5 w-5 text-indigo-600" />} bg="bg-indigo-50" label="Total Hotels" value={stats.total} sub="All time" />
                    <StatCard icon={<Star className="h-5 w-5 text-amber-500" />} bg="bg-amber-50" label="Premium" value={stats.premium} sub="All time" />
                    <StatCard icon={<Users className="h-5 w-5 text-teal-600" />} bg="bg-teal-50" label="Basic" value={stats.basic} sub="All time" />
                    <StatCard icon={<IndianRupee className="h-5 w-5 text-green-600" />} bg="bg-green-50" label="Paid Listings" value={registrations.filter((r) => r.paymentStatus === "paid").length} sub="Revenue collected" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <StatCard icon={<CheckCircle2 className="h-5 w-5 text-green-600" />} bg="bg-green-50" label="Approved" value={stats.approved} sub="Green flagged" />
                    <StatCard icon={<Clock className="h-5 w-5 text-yellow-500" />} bg="bg-yellow-50" label="Pending Review" value={stats.pending} sub="Awaiting action" />
                    <StatCard icon={<XCircle className="h-5 w-5 text-red-500" />} bg="bg-red-50" label="Rejected" value={stats.rejected} sub="Red flagged" />
                  </div>
                </>
              )}
              <div className="flex gap-5">

            {/* Recent Registrations */}
            <div className="flex-1 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-foreground">
                  Recent Registrations
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    {filtered.length}
                  </span>
                </h2>
                <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
                  {(["all", "green", "yellow", "red"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFlagFilter(f)}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                        flagFilter === f ? "bg-white shadow-sm text-foreground" : "text-slate-500 hover:text-foreground"
                      }`}
                    >
                      {f !== "all" && (
                        <span className={`h-2 w-2 rounded-full ${
                          f === "green" ? "bg-green-500" : f === "yellow" ? "bg-yellow-400" : "bg-red-500"
                        }`} />
                      )}
                      {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-sm text-muted-foreground">Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">No registrations found</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filtered.slice(0, 8).map((reg) => {
                    const currentFlag = reg.flag ?? "yellow";
                    const isUpdating = updatingFlag === reg.id;
                    return (
                      <div
                        key={reg.id}
                        className={`flex items-center gap-4 border-l-4 px-5 py-3.5 transition-colors hover:bg-slate-50 ${
                          currentFlag === "green" ? "border-l-green-400" : currentFlag === "red" ? "border-l-red-400" : "border-l-yellow-400"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">{reg.hotelName}</p>
                          <p className="truncate text-xs text-muted-foreground">{reg.address}</p>
                          <div className="mt-0.5 flex items-center gap-3">
                            <p className="text-xs text-muted-foreground">
                              {reg.submittedAt?.toDate
                                ? reg.submittedAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                : "—"}
                            </p>
                            {reg.contactNumber && (
                              <a
                                href={`tel:${reg.contactNumber}`}
                                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                onClick={(e) => e.stopPropagation()}
                              >
                                📞 {reg.contactNumber}
                              </a>
                            )}
                          </div>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                          reg.tier === "premium" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {reg.tier}
                        </span>
                        <span className="w-24 shrink-0 text-right text-sm font-semibold text-foreground">
                          ₹{Number(reg.roomPricing).toLocaleString("en-IN")}
                        </span>
                        <div className="flex shrink-0 items-center gap-1">
                          {(["green", "yellow", "red"] as const).map((f) => (
                            <button
                              key={f}
                              title={f}
                              disabled={isUpdating}
                              onClick={() => reg.id && updateFlag(reg.id, f)}
                              className={`h-4 w-4 rounded-full border-2 transition-transform hover:scale-110 disabled:opacity-40 ${
                                currentFlag === f
                                  ? f === "green" ? "border-green-600 bg-green-500" : f === "yellow" ? "border-yellow-500 bg-yellow-400" : "border-red-600 bg-red-500"
                                  : "border-slate-300 bg-slate-100"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right panel */}
            <div className="flex w-56 shrink-0 flex-col gap-4">

              {/* Quick Actions */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Actions</h3>
                <div className="space-y-1">
                  <ActionBtn icon={<Download className="h-3.5 w-3.5" />} label="Export to Excel" onClick={exportToExcel} disabled={registrations.length === 0} />
                  <ActionBtn icon={<RefreshCw className="h-3.5 w-3.5" />} label="Refresh Data" onClick={loadRegistrations} />
                  <ActionBtn icon={<Trash2 className="h-3.5 w-3.5 text-red-500" />} label="Clear All" onClick={clearRegistrations} disabled={registrations.length === 0} danger />
                </div>
              </div>

              {/* Flag Summary — dark card */}
              <div className="rounded-xl bg-[#0f172a] p-4 text-white">
                <h3 className="mb-3 text-sm font-semibold">Flag Summary</h3>
                <div className="space-y-2.5 text-sm">
                  {[
                    { color: "bg-green-400",  label: "Approved", count: stats.approved },
                    { color: "bg-yellow-400", label: "Pending",  count: stats.pending  },
                    { color: "bg-red-400",    label: "Rejected", count: stats.rejected },
                  ].map(({ color, label, count }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-300">
                        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                        {label}
                      </span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, bg, label, value, sub }: {
  icon: React.ReactNode; bg: string; label: string; value: number | string; sub: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>{icon}</div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, disabled, danger }: {
  icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${
        danger ? "text-red-600 hover:bg-red-50" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
