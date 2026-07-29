import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, MessageCircle, Star, ShieldCheck, Clock, Calendar, Stethoscope, HeartHandshake } from "lucide-react";
import { servicesQ, reviewSummaryQ, settingsQ } from "@/lib/api/queries";
import heroCare from "@/assets/hero-care.jpg.asset.json";

export function Hero() {
  const navigate = useNavigate();
  const { data: servicesData } = useQuery(servicesQ({ limit: 30 }));
  const { data: reviews } = useQuery(reviewSummaryQ());
  const { data: settings } = useQuery(settingsQ());
  const services = servicesData?.items ?? [];

  const rating = reviews?.average_rating ?? 4.9;
  const phoneRaw = settings?.phone?.replace(/[^\d+]/g, "");
  const waRaw = (settings?.whatsapp || settings?.phone || "").replace(/[^\d]/g, "");

  return (
    <section className="relative isolate overflow-hidden min-h-[100svh] w-full">
      {/* Mint gradient background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, #DDEEEE 0%, #EAF6F6 45%, #F8FCFC 100%)",
        }}
      />
      {/* Soft mesh accents */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--primary) 30%, transparent), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 25%, transparent), transparent 70%)" }}
      />

      {/* Doctor image — right 58%, feathered into background */}
      <img
        src={heroCare.url}
        alt="Compassionate home healthcare — nurse with elderly patient"
        className="absolute right-0 top-0 h-full w-[58%] object-cover pointer-events-none select-none hidden md:block"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 18%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 18%)",
        }}
      />
      {/* Mobile — image at bottom */}
      <img
        src={heroCare.url}
        alt=""
        aria-hidden
        className="md:hidden absolute inset-x-0 bottom-0 h-2/5 w-full object-cover opacity-70"
        style={{
          WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
        }}
      />

      <div className="relative container-x pt-32 pb-40 lg:pt-40 lg:pb-48 min-h-[100svh] flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl lg:max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent ring-1 ring-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Care available today
          </div>

          <h1 className="mt-5 font-display text-[clamp(2.4rem,5.6vw,5rem)] font-bold leading-[1.02] tracking-[-0.02em] text-foreground">
            Trusted Home Healthcare
            <br />
            Services at your door.
          </h1>
          <p className="mt-5 font-display text-2xl md:text-3xl italic text-accent">
            Hospital-grade care with a human touch.
          </p>
          <p className="mt-5 max-w-lg text-base md:text-lg text-muted-foreground leading-relaxed">
            Get expert nursing care, elder care, and patient attendants at home with
            verified professionals.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-primary text-primary" /> {rating.toFixed(1)}/5 Rated
            </span>
            <span className="opacity-30">|</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Certified Staff
            </span>
            <span className="opacity-30">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" /> 24/7 Available
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate({ to: "/booking" })}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[var(--shadow-float)] hover:bg-foreground transition-colors"
            >
              Book Trusted Care
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            {waRaw && (
              <a
                href={`https://wa.me/${waRaw}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-6 py-4 text-sm font-semibold text-foreground ring-1 ring-white hover:bg-white transition-colors"
              >
                WhatsApp
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#25D366] text-white">
                  <MessageCircle className="h-3.5 w-3.5" />
                </span>
              </a>
            )}
            {phoneRaw && (
              <a
                href={`tel:${phoneRaw}`}
                className="hidden sm:inline-flex items-center px-2 py-4 text-sm font-semibold text-foreground/80 hover:text-accent"
              >
                or call {settings?.phone}
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Liquid-glass Quick Book bar */}
      <QuickBookBar services={services} onSubmit={(service) => navigate({ to: "/booking", search: service ? { service } : {} })} />
    </section>
  );
}

function QuickBookBar({
  services,
  onSubmit,
}: {
  services: { id: string | number; title: string }[];
  onSubmit: (service: string) => void;
}) {
  const [service, setService] = useState("");
  const [careType, setCareType] = useState("");
  const [date, setDate] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 bottom-6 lg:bottom-10 z-10 px-4 lg:px-10"
    >
      <div className="mx-auto max-w-6xl relative overflow-hidden rounded-3xl bg-white/25 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-white/60 shadow-[0_30px_80px_-20px_rgba(15,80,80,0.35)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent"
        />
        <div className="relative grid gap-3 p-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center md:gap-2 md:p-3 md:pl-6">
          <BookField
            icon={<Stethoscope className="h-4 w-4" />}
            label="Service"
            value={service}
            onChange={setService}
            options={[{ v: "", label: "Choose service" }, ...services.map((s) => ({ v: s.title, label: s.title }))]}
          />
          <div className="hidden md:block h-8 w-px bg-white/60" />
          <BookField
            icon={<HeartHandshake className="h-4 w-4" />}
            label="Care type"
            value={careType}
            onChange={setCareType}
            options={[
              { v: "", label: "Select type" },
              { v: "home-visit", label: "Home visit" },
              { v: "consultation", label: "Consultation" },
              { v: "equipment-rental", label: "Equipment rental" },
            ]}
          />
          <div className="hidden md:block h-8 w-px bg-white/60" />
          <BookDateField value={date} onChange={setDate} />
          <button
            onClick={() => onSubmit(service)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-float)] hover:bg-foreground transition-colors"
          >
            Book Now
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function BookField({
  icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { v: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl bg-white/40 backdrop-blur px-4 py-2.5 ring-1 ring-white/50">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/70 text-accent">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none truncate"
        >
          {options.map((o) => (
            <option key={o.v || o.label} value={o.v}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function BookDateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl bg-white/40 backdrop-blur px-4 py-2.5 ring-1 ring-white/50">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/70 text-accent">
        <Calendar className="h-4 w-4" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Date</div>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
        />
      </div>
    </label>
  );
}
