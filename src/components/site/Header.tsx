import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import { Menu, X, ArrowRight, User, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/medical-equipment", label: "Equipment" },
  { to: "/faq", label: "FAQs" },
  { to: "/blogs", label: "Blogs" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact Us" },
] as const;


export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: settings } = useQuery(settingsQ());
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => setOpen(false), [pathname]);

  // "scrolled" flips once the header has scrolled past the page's hero, so the
  // pill can switch from floating-over-hero styling to solid-on-content styling.
  useEffect(() => {
    const compute = () => {
      const hero =
        document.getElementById("hero-section") ||
        document.querySelector<HTMLElement>("main section");
      const threshold = hero ? hero.offsetHeight - 96 : window.innerHeight * 0.4;
      setScrolled(window.scrollY > threshold);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [pathname]);

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  const isEquipment = pathname === "/equipment";
  const isFaq = pathname === "/faq";
  const isBlogs = pathname.startsWith("/blogs");
  const isBooking = pathname === "/booking";
  const onDarkHero = !isAbout && !isEquipment && !isFaq && !isBlogs && !isBooking && !scrolled;
  const overlay = isHome && !scrolled;

  return (
    <header className={cn("z-50 inset-x-0", overlay ? "absolute top-4" : "fixed top-4")}>
      <div className="container-x">
        <div
          className={cn(
            "relative overflow-hidden flex h-16 items-center justify-between gap-4 rounded-full pl-3 pr-3 lg:h-[68px] lg:pl-6 lg:pr-2",
            "backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300",
            "shadow-[0_20px_50px_-20px_rgba(15,80,80,0.35)]",
            onDarkHero
              ? "bg-white/10 border border-white/25"
              : "bg-white/90 border border-border/40",
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-full bg-gradient-to-b to-transparent",
              onDarkHero ? "from-white/15" : "from-white/60",
            )}
          />
          <Link to="/" className="relative flex items-center gap-2.5 shrink-0">
            {settings?.logo ? (
              <img src={typeof settings.logo === 'string' ? settings.logo : (settings.logo as any)?.url} alt={settings.website_name || "Logo"} className="h-9 w-9 object-contain" />
            ) : (
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden
                >
                  <path d="M12 21s-7-4.35-9.5-8.5C.85 9.5 2.4 5.5 6 5c2.05-.28 3.7.9 6 3 2.3-2.1 3.95-3.28 6-3 3.6.5 5.15 4.5 3.5 7.5C19 16.65 12 21 12 21Z" />
                </svg>
              </div>
            )}
            <div className="leading-tight flex flex-col justify-center whitespace-nowrap">
              <div
                className={cn(
                  "font-display text-[15px] font-semibold tracking-tight uppercase",
                  onDarkHero && "text-white",
                )}
              >
                {settings?.website_name?.split(" ")[0] || "Home Physio India"}
              </div>
              <div
                className={cn(
                  "text-[9px] uppercase tracking-[0.22em] -mt-0.5",
                  onDarkHero ? "text-white/70" : "text-muted-foreground",
                )}
              >
                {settings?.website_name?.split(" ").slice(1).join(" ") || "Home Health Care"}
              </div>
            </div>
          </Link>

          <nav className="relative hidden lg:flex items-center gap-8">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{
                  className: onDarkHero ? "text-white font-semibold" : "text-accent font-semibold",
                }}
                inactiveProps={{ className: onDarkHero ? "text-white/75" : "text-foreground/70" }}
                className={cn(
                  "text-sm uppercase tracking-wider transition-colors hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center gap-2">
            {!isAuthenticated ? (
              <Link
                to="/booking"
                className={cn(
                  "hidden sm:inline-flex h-[32px] sm:h-10 items-center justify-center rounded-full px-4 sm:px-5 text-[11px] xs:text-[12px] sm:text-sm font-semibold tracking-wide transition-all hover:scale-105",
                  onDarkHero
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-sm hover:opacity-90",
                )}
              >
                <span className="flex items-center gap-1.5 sm:hidden">
                  Book Trusted Care <ArrowRight className="h-3 w-3" />
                </span>
                <span className="hidden sm:inline">Book Appointment</span>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full transition-transform hover:scale-105 active:scale-95">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm cursor-pointer">
                    <AvatarImage src={user?.avatar?.url} alt={user?.name || "User"} className="object-cover" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl shadow-lg border-border/50">
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground leading-none truncate">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem className="p-2 cursor-pointer focus:bg-primary-soft rounded-lg" asChild>
                    <Link to={user?.role === "therapist" ? "/therapist/dashboard" : "/user/dashboard"} className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-2 cursor-pointer focus:bg-primary-soft rounded-lg" asChild>
                    <Link to={user?.role === "therapist" ? "/therapist/dashboard" : "/user/dashboard"} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem 
                    className="p-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <button
              onClick={() => setOpen(!open)}
              className={cn(
                "p-2 -mr-2 rounded-full lg:hidden",
                onDarkHero ? "text-white hover:bg-white/10" : "text-foreground hover:bg-white/50",
              )}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden mt-2 rounded-3xl bg-white/90 backdrop-blur-3xl backdrop-saturate-150 border border-border/40 shadow-[0_20px_50px_-20px_rgba(15,80,80,0.35)] origin-top overflow-hidden"
            >
              <div className="py-3 px-3 grid gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "bg-primary-soft text-accent" }}
                    className="rounded-xl px-4 py-3 text-base font-medium text-foreground/80"
                  >
                    {item.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link
                    to="/booking"
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Book Appointment
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
