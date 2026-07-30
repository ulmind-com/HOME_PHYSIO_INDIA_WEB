import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Truck, ShieldCheck, Sparkles, ArrowRight, Phone, ArrowUpRight } from "lucide-react";
import { equipmentQ, settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { EquipmentCard } from "@/components/site/cards/EquipmentCard";
import { EmptyState, Section, SectionHeader } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/equipment/")({
  head: () => ({
    meta: [
      { title: "Medical Equipment Rental — Nupun Home Health Care" },
      {
        name: "description",
        content:
          "Rent oxygen concentrators, hospital beds, wheelchairs and more, delivered and sanitised.",
      },
      { property: "og:title", content: "Medical Equipment Rental — Nupun" },
      { property: "og:description", content: "Hospital-grade equipment for home use." },
      { property: "og:url", content: "/equipment" },
    ],
    links: [{ rel: "canonical", href: "/equipment" }],
  }),
  component: EquipmentIndex,
});

const PERKS = [
  {
    icon: Truck,
    title: "Same-day delivery",
    body: "Ordered before noon? Most units are delivered and installed the same day.",
    theme: { bg: "bg-[#F4FDF8]", iconBg: "bg-[#E6F9F0]", iconColor: "text-[#048C5B]" },
  },
  {
    icon: ShieldCheck,
    title: "Sanitised & insured",
    body: "Hospital-grade sanitised, serviced and insured before it reaches your door.",
    theme: { bg: "bg-[#F5F8FF]", iconBg: "bg-[#E8F0FE]", iconColor: "text-[#1A62E8]" },
  },
  {
    icon: Sparkles,
    title: "Flexible durations",
    body: "Rent by the day, week or month — extend anytime, no long lock-ins.",
    theme: { bg: "bg-[#FFF9F5]", iconBg: "bg-[#FFEDE0]", iconColor: "text-[#E86C1A]" },
  },
];

const EQUIPMENT_ITEMS = [
  {
    src: "/assets/equipment/ultrasound.jpeg",
    title: "Siemens X700 Ultrasound",
    category: "Diagnostic",
    price: "₹15,000",
    desc: "Advanced cardiovascular and OB/GYN imaging system with high-res display.",
  },
  {
    src: "/assets/equipment/monitoring-1.jpeg",
    title: "At-Home Health Monitoring",
    category: "Monitoring",
    price: "₹2,500",
    desc: "Complete kit for blood pressure, glucose, and pulse oximetry tracking.",
  },
  {
    src: "/assets/equipment/anesthesiology.jpeg",
    title: "Anesthesiology Equipment",
    category: "Life Support",
    price: "Contact us",
    desc: "Hospital-grade anesthesia workstation for specialized home care setups.",
  },
  {
    src: "/assets/equipment/monitoring-2.jpeg",
    title: "Vitals Testing Kit",
    category: "Monitoring",
    price: "₹1,200",
    desc: "Portable multi-parameter patient monitor for continuous vitals tracking.",
  },
  {
    src: "/assets/equipment/stethoscope.jpeg",
    title: "Clinical Stethoscope",
    category: "Diagnostic",
    price: "₹500",
    desc: "Professional acoustic stethoscope for precise cardiac assessment.",
  },
];

function EquipmentIndex() {
  const { data, isLoading } = useQuery(equipmentQ({ limit: 60 }));
  const { data: settings } = useQuery(settingsQ());
  const items = data?.items ?? [];
  const phone = settings?.phone?.replace(/[^\d+]/g, "");

  return (
    <>
      {/* ── Custom Split Hero (Premium) ──────────────── */}
      <div className="relative isolate overflow-hidden bg-[#fafafa]">
        {/* Subtle background blob */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full opacity-30 bg-gradient-to-l from-primary/10 to-transparent" />

        <div className="container-x pt-24 pb-8 lg:pt-24 lg:pb-12 grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Content */}
          <div className="space-y-4 lg:col-span-7 xl:col-span-6 lg:pr-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-[12px] font-semibold text-primary backdrop-blur-sm border border-primary/20 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" fill="currentColor" /> Medical Equipment Rental
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight text-foreground">
              Hospital-grade equipment, at <span className="text-primary">home.</span>
            </h1>

            {/* Description */}
            <p className="text-[16px] text-foreground/80 max-w-[480px] leading-relaxed">
              Oxygen concentrators, hospital beds, wheelchairs and more — sanitised, insured and
              delivered, usually the same day.
            </p>

            {/* Features list (mini) */}
            <div className="flex flex-col gap-2.5 py-1">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="h-3 w-3" />
                </div>
                <span className="text-[14px] font-medium text-foreground/90">
                  Same-day delivery across the city
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-3 w-3" />
                </div>
                <span className="text-[14px] font-medium text-foreground/90">
                  Hospital-grade sanitised & insured units
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="h-3 w-3" />
                </div>
                <span className="text-[14px] font-medium text-foreground/90">
                  Flexible rental durations with no lock-ins
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary border border-primary px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_20px_var(--color-primary),0.25)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
                >
                  <Phone className="h-4 w-4" /> Request equipment
                </a>
              ) : null}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-border/80 px-6 py-3 text-[14px] font-semibold text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:bg-surface hover:-translate-y-0.5 transition-all"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative h-[350px] w-full lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[45%] xl:w-[50%] -z-10 overflow-hidden">
          <img
            src="/assets/equip.jpeg"
            alt="Medical Equipment"
            className="w-full h-full object-cover object-[center_30%] transform hover:scale-105 transition-transform duration-[2s]"
          />
          {/* Fade masks for smooth blending */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/50 to-transparent lg:w-48" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/40 to-transparent lg:hidden" />
        </div>
      </div>

      {/* ── Why rent from Nupun ──────────────────────────────── */}
      <Section className="pt-16 pb-8 lg:pt-20 lg:pb-10">
        <div className="container-x max-w-7xl mx-auto">
          <div className="grid gap-4 md:gap-5 md:grid-cols-3">
            {PERKS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.07}>
                <div
                  className={`h-full rounded-[20px] ${p.theme.bg} p-6 lg:p-7 flex items-center gap-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]`}
                >
                  {/* Icon Circle */}
                  <div
                    className={`shrink-0 grid h-[60px] w-[60px] place-items-center rounded-full ${p.theme.iconBg} ${p.theme.iconColor}`}
                  >
                    <p.icon className="h-7 w-7" strokeWidth={2.5} />
                  </div>
                  {/* Text */}
                  <div>
                    <h3 className="font-display text-[18px] lg:text-[20px] font-bold leading-tight text-foreground mb-1.5">
                      {p.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-muted-foreground/90">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Catalogue (Liquid Glass) ────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-10 lg:pb-24 bg-background">
        {/* Animated Liquid Background Blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-primary/15 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-float-slow" />
          <div
            className="absolute top-[40%] right-[-5%] w-[450px] h-[450px] bg-accent/15 rounded-full mix-blend-multiply filter blur-[90px] opacity-60 animate-float-slower"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-[5%] left-[20%] w-[600px] h-[600px] bg-blue-300/15 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-float-slow"
            style={{ animationDelay: "4s" }}
          />
        </div>

        <div className="container-x relative z-10 max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="Catalogue"
            title="Browse the rental catalogue"
            description="Every unit is delivery-tracked and backed by our care desk if anything needs attention."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {EQUIPMENT_ITEMS.map((item, i) => (
              <div
                key={i}
                className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-3 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(255,255,255,0.4)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_var(--color-primary),0.15)] hover:border-primary/40 hover:bg-white/60 cursor-pointer"
              >
                {/* Top Glossy Highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-primary/5 shadow-inner">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="p-6 flex flex-col flex-1 relative z-10">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent backdrop-blur-md self-start mb-4 border border-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    {item.category}
                  </div>

                  <h3 className="font-display text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground/90 line-clamp-2">
                    {item.desc}
                  </p>

                  <div className="mt-auto pt-7 flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Rental Rate
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-[26px] font-bold text-foreground">
                          {item.price}
                        </span>
                        {item.price !== "Contact us" && (
                          <span className="text-[13px] font-semibold text-muted-foreground">
                            / day
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-md border border-black/5 text-foreground transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_10px_20px_var(--color-primary),0.3)] group-hover:border-primary">
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Section className="pt-0">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-border bg-gradient-to-br from-primary-soft to-surface p-8 text-center lg:flex-row lg:p-12 lg:text-left">
          <div>
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">
              Need a unit urgently?
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Tell us what you need — we'll confirm availability and delivery time, often within the
              hour.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background"
          >
            Request equipment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
