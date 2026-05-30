import { Link } from "@tanstack/react-router";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import logo from "@/assets/dud-logo.png";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
  { label: "Plans", to: "/plans-pricing" },
] as const;

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white/70 border-t border-white/10 mt-20">
      <div className="mx-auto max-w-[1320px] px-6 py-12 grid gap-8 md:grid-cols-3 items-start">
        <div className="flex items-center gap-2">
          <img src={logo} alt="easyDUD" className="h-10 w-10 object-contain brightness-0 invert" />
          <span className="font-black text-xl text-white tracking-tight">easyDUD</span>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 justify-start md:justify-center text-sm">
          {links.map((l) => (
            <Link key={l.label} to={l.to} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-3 md:justify-end">
          {[Twitter, Instagram, Linkedin].map((Icon, i) => (
            <button
              key={i}
              type="button"
              aria-label="Social"
              className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">
        © 2026 easyDUD. All rights reserved.
      </div>
    </footer>
  );
}
