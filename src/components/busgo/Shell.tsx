import { Link, useLocation } from "@tanstack/react-router";
import { Bus, User, LogIn, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/bus" },
  { label: "Offers", to: "/bus#offers" },
  { label: "Help", to: "/bus#help" },
];

export function BusGoNav() {
  const { pathname } = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/bus" className="flex items-center gap-2 shrink-0">
          <div className="h-9 w-9 rounded-lg bg-[#D84040] text-white flex items-center justify-center">
            <Bus className="h-5 w-5" />
          </div>
          <span className="font-black text-xl text-gray-900 tracking-tight">BusGo</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to}
              className={cn("px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === n.to ? "text-[#D84040]" : "text-gray-700 hover:text-[#D84040]")}>
              {n.label}
            </Link>
          ))}
          <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">← easyDUD</Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <Link to="/bus/account" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-800">
              <User className="h-4 w-4" /> Account
            </Link>
          ) : (
            <Link to="/bus/login" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-[#D84040] hover:bg-[#B83333] text-sm font-medium text-white">
              <LogIn className="h-4 w-4" /> Login
            </Link>
          )}
        </div>
        <button className="md:hidden h-9 w-9 rounded-md flex items-center justify-center text-gray-700" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-2 bg-white">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} onClick={() => setOpen(false)} className="block py-2 text-gray-800">{n.label}</Link>
          ))}
          {session ? (
            <Link to="/bus/account" onClick={() => setOpen(false)} className="block py-2 text-gray-800">Account</Link>
          ) : (
            <Link to="/bus/login" onClick={() => setOpen(false)} className="block py-2 text-[#D84040] font-medium">Login</Link>
          )}
          <Link to="/" onClick={() => setOpen(false)} className="block py-2 text-gray-500">← easyDUD</Link>
        </div>
      )}
    </header>
  );
}

export function BusGoFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-md bg-[#D84040] flex items-center justify-center"><Bus className="h-4 w-4 text-white" /></div>
            <span className="font-black text-white text-lg">BusGo</span>
          </div>
          <p className="text-sm text-gray-400">India's most trusted bus ticket booking platform. Government + private operators, one place.</p>
        </div>
        <FooterCol title="Company" items={["About", "Careers", "Press", "Blog"]} />
        <FooterCol title="Support" items={["Help Center", "Cancellation", "Refund Policy", "Contact 24/7"]} />
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Get the app</h4>
          <div className="flex flex-col gap-2">
            <div className="h-11 rounded-md bg-black border border-gray-700 flex items-center justify-center text-xs">⬇ App Store</div>
            <div className="h-11 rounded-md bg-black border border-gray-700 flex items-center justify-center text-xs">⬇ Google Play</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-500">© 2026 BusGo. All rights reserved.</div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{title}</h4>
      <ul className="space-y-2 text-sm">
        {items.map((i) => <li key={i} className="hover:text-white cursor-pointer">{i}</li>)}
      </ul>
    </div>
  );
}

export function BusGoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BusGoNav />
      <main className="flex-1">{children}</main>
      <BusGoFooter />
    </div>
  );
}
