import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/equipment", label: "Equipment" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const MOBILE_EXTRA = [
  { to: "/blog", label: "Blog" },
  { to: "/careers", label: "Careers" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  const isHome = pathname === "/";

  return (
    <header className={cn(isHome ? "absolute top-4 inset-x-0 z-50" : "sticky top-4 z-50")}>
      <div className="container-x">
        <div
          className={cn(
            "relative overflow-hidden flex h-16 items-center justify-between gap-4 rounded-full pl-3 pr-3 lg:h-[68px] lg:pl-6 lg:pr-2",
            "bg-white/30 backdrop-blur-2xl backdrop-saturate-150 border border-white/50",
            "shadow-[0_20px_50px_-20px_rgba(15,80,80,0.35)]",
          )}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent rounded-full" />
          <Link to="/" className="relative flex items-center gap-2.5 shrink-0">
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                <path d="M12 21s-7-4.35-9.5-8.5C.85 9.5 2.4 5.5 6 5c2.05-.28 3.7.9 6 3 2.3-2.1 3.95-3.28 6-3 3.6.5 5.15 4.5 3.5 7.5C19 16.65 12 21 12 21Z" />
              </svg>
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="font-display text-[15px] font-semibold tracking-tight uppercase">Nupun</div>
              <div className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground -mt-0.5">
                Home Health Care
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-accent font-semibold" }}
                inactiveProps={{ className: "text-foreground/70" }}
                className="text-sm font-medium transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/booking"
              className="hidden sm:inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-accent transition-colors"
            >
              Book Appointment
            </Link>
            <button
              aria-label="Open menu"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-foreground"
              onClick={() => setOpen((s) => !s)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 rounded-3xl bg-white border border-border shadow-[var(--shadow-soft)]">
            <div className="py-3 px-3 grid gap-1">
              {[...NAV, ...MOBILE_EXTRA].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "bg-primary-soft text-accent" }}
                  className="rounded-xl px-4 py-3 text-base font-medium text-foreground/80"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/booking"
                className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
