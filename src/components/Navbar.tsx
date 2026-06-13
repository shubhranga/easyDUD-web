import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Globe, LogIn, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import logo from "@/assets/dud-logo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Services", to: "/services" },
  { label: "Blog", to: "/blog" },
  { label: "Contact Us", to: "/contact" },
] as const;

interface NavbarProps {
  /** When true, navbar starts transparent (over hero) and turns glassy on scroll. */
  overlay?: boolean;
  /** Currently-active home-page section id (driven by parent via IntersectionObserver). */
  activeSection?: string;
}

export function Navbar({ overlay = false, activeSection }: NavbarProps) {
  // Visual-only: backdrop blur once user scrolls past 60px.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const isTransparent = overlay && !scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-400",
        isTransparent
          ? "bg-transparent"
          : "bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_2px_18px_rgba(60,60,90,0.06)]"
      )}
      style={{ transitionDuration: "400ms" }}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logo}
            alt="easyDUD"
            width={36}
            height={36}
            className={cn(
              "h-9 w-9 object-contain transition-all",
              isTransparent && "brightness-0 invert"
            )}
          />
          <span
            className={cn(
              "font-black text-xl tracking-tight hidden md:inline transition-colors",
              isTransparent ? "text-white" : "text-foreground/90"
            )}
          >
            easyDUD
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md",
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-foreground/70 hover:text-foreground"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left transition-transform duration-300",
                    isTransparent ? "bg-white" : "bg-primary",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            aria-label="Language"
            onClick={() => toast.info("Language switcher coming soon.")}
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
              isTransparent
                ? "bg-white/10 border-white/30 text-white hover:bg-white/20"
                : "bg-white/90 border-white text-foreground/70 hover:text-foreground"
            )}
          >
            <Globe className="h-4 w-4" />
          </button>
          <Link
            to="/plans-pricing"
            className={cn(
              "h-9 px-4 rounded-full text-sm font-medium transition-all flex items-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
              isTransparent
                ? "bg-transparent border-white/60 text-white hover:bg-white/10"
                : "bg-white border-primary/30 text-primary hover:bg-primary/5"
            )}
          >
            See all plans
          </Link>
          <button
            type="button"
            onClick={() => toast.info("Login & Signup coming soon.")}
            className={cn(
              "h-9 px-4 rounded-full text-sm font-medium transition-all inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
              isTransparent
                ? "bg-white text-foreground hover:bg-white/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <LogIn className="h-3.5 w-3.5" />
            Login
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "md:hidden h-10 w-10 rounded-full flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
            isTransparent ? "text-white bg-white/10" : "text-foreground bg-white/80"
          )}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-white/85 backdrop-blur-2xl border-l border-white/40 shadow-2xl p-6 md:hidden z-50"
          >
            <div className="flex flex-col gap-2 mt-12">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium text-foreground/80 hover:text-foreground py-2 border-b border-foreground/10"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/plans-pricing"
                onClick={() => setOpen(false)}
                className="mt-4 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium"
              >
                See all plans
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
