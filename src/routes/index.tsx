import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, ShieldCheck, HeartPulse, Clock, Star, Calendar, Stethoscope, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  blogsQ,
  equipmentQ,
  faqsQ,
  reviewSummaryQ,
  servicesQ,
  testimonialsQ,
  videosQ,
} from "@/lib/api/queries";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { Section, SectionHeader, EmptyState } from "@/components/site/Section";
import { ServiceCard } from "@/components/site/cards/ServiceCard";
import { EquipmentCard } from "@/components/site/cards/EquipmentCard";
import { BlogCard } from "@/components/site/cards/BlogCard";
import { VideoCard } from "@/components/site/cards/VideoCard";
import { TestimonialCard } from "@/components/site/cards/TestimonialCard";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { GoogleReviews } from "@/components/site/GoogleReviews";
const heroDoctor = "/assets/hero-doctor.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nupun Home Health Care Services — Premium care, delivered home" },
      {
        name: "description",
        content:
          "Verified nurses, physiotherapists and premium medical equipment — booked in minutes, delivered to your door. Rated 5-star by families across the region.",
      },
      { property: "og:title", content: "Nupun Home Health Care Services — Premium care, delivered home" },
      {
        property: "og:description",
        content: "Verified nurses, physiotherapists and premium medical equipment — booked in minutes, delivered to your door. Rated 5-star by families across the region.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesSection />
      <WhyUs />
      <EquipmentSection />
      <CareTeamSection />
      <TestimonialsSection />
      <BlogVideosSection />
      <FaqSection />
      <ReviewsSection />
      <ContactCta />
    </>
  );
}

function Hero() {
  const { data: servicesData } = useQuery(servicesQ({ limit: 24 }));
  const services = servicesData?.items ?? [];
  const navigate = useNavigate();
  const [service, setService] = useState("");
  const [careType, setCareType] = useState("");
  const [date, setDate] = useState("");

  const onBook = () => {
    navigate({ to: "/booking", search: service ? { service } : {} });
  };

  return (
    <section className="relative">
      <div
        className="relative overflow-hidden border-b border-primary/20 min-h-[100svh]"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 22%, white), color-mix(in oklab, var(--primary) 10%, white) 55%, white)",
        }}
      >
        {/* Doctor image, right half, feathered into the mint bg */}
        <img
          src={heroDoctor}
          alt="Nupun doctor consulting a patient"
          className="hidden lg:block absolute right-0 top-0 h-full w-[62%] object-cover object-left"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
          }}
        />
        {/* Mobile: image below text */}
        <img
          src={heroDoctor}
          alt=""
          aria-hidden
          className="lg:hidden absolute inset-x-0 bottom-0 h-1/2 w-full object-cover"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          }}
        />

        {/* Content layer */}
        <div className="relative px-6 pt-32 pb-48 lg:px-16 lg:pt-40 lg:pb-40 min-h-[100svh] flex items-center">
          <div className="max-w-md lg:max-w-lg lg:ml-8 xl:ml-20">
            <Reveal>
              <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.02] text-foreground">
                Your Health,
                <br />
                Our Priority
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-sm text-lg text-foreground/75 leading-relaxed">
                Compassionate care for you and your family — verified nurses and hospital-grade equipment, delivered home.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:bg-accent transition-colors"
                >
                  Book Appointment <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/70 backdrop-blur px-6 py-3.5 text-sm font-medium hover:border-primary"
                >
                  Explore services
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Liquid-glass booking bar — pinned inside hero */}
        <div className="absolute inset-x-0 bottom-6 lg:bottom-10 z-20 px-4 lg:px-10">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/50 bg-white/25 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_25px_70px_-25px_rgba(15,60,60,0.45)]">
            {/* top sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent" />
            <div className="relative p-4 lg:p-5 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
              <BookField label="Service">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full appearance-none bg-transparent text-sm font-medium text-foreground focus:outline-none pr-6"
                >
                  <option value="">Choose service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.slug}>{s.title}</option>
                  ))}
                </select>
              </BookField>
              <BookField label="Care type">
                <select
                  value={careType}
                  onChange={(e) => setCareType(e.target.value)}
                  className="w-full appearance-none bg-transparent text-sm font-medium text-foreground focus:outline-none pr-6"
                >
                  <option value="">Select type</option>
                  <option value="home">Home visit</option>
                  <option value="consult">Consultation</option>
                  <option value="equipment">Equipment rental</option>
                </select>
              </BookField>
              <BookField label="Date" icon={<Calendar className="h-4 w-4 text-muted-foreground" />}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none"
                />
              </BookField>
              <button
                onClick={onBook}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:bg-accent transition-colors whitespace-nowrap shadow-[0_10px_25px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)]"
              >
                Book Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



function BookField({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-2xl bg-white/40 border border-white/60 backdrop-blur px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">{label}</div>
      <div className="mt-1 flex items-center gap-2 relative">
        {icon}
        {children}
        <ChevronDown className="h-4 w-4 text-muted-foreground absolute right-0 pointer-events-none opacity-60" />
      </div>
    </label>
  );
}


function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function TrustBar() {
  const items = ["Licensed nurses", "24/7 helpline", "Insurance-friendly", "Transparent pricing", "Background-checked"];
  return (
    <div className="border-y border-border/70 bg-surface/60 backdrop-blur">
      <div className="container-x py-4 overflow-hidden">
        <div className="flex items-center gap-10 whitespace-nowrap text-xs uppercase tracking-[0.2em] text-muted-foreground animate-marquee">
          {[...items, ...items, ...items].map((t, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-primary" /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesSection() {
  const { data, isLoading } = useQuery(servicesQ({ limit: 6 }));
  const items = data?.items ?? [];
  return (
    <Section>
      <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
        <SectionHeader
          eyebrow="Our services"
          title={<>Care that meets you<br />where you are.</>}
          description="From short recovery care to long-term support, our services are designed around your family."
        />
        <Link to="/services" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {isLoading ? (
        <SkeletonGrid />
      ) : items.length ? (
        <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <StaggerItem key={s.id}><ServiceCard service={s} /></StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <EmptyState title="Services coming soon" description="Our care team is preparing this section." />
      )}
    </Section>
  );
}

function WhyUs() {
  const pillars = [
    { icon: ShieldCheck, title: "Verified & trained", body: "Every caregiver is background-checked, licensed and continuously trained." },
    { icon: HeartPulse, title: "Medically supervised", body: "Care plans are reviewed by qualified physicians and senior nurses." },
    { icon: Clock, title: "Always on-call", body: "24/7 support and rapid response for urgent needs across the city." },
    { icon: Star, title: "Loved by families", body: "Rated 4.9 across thousands of visits — care you can feel from the first minute." },
  ];
  return (
    <Section className="bg-primary-soft/40">
      <SectionHeader eyebrow="Why Nupun" title="Care built on trust, not tricks." align="center" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <div className="h-full rounded-3xl border border-border bg-surface p-7 hover-glow">
              <div className="h-12 w-12 rounded-2xl bg-primary-soft grid place-items-center text-accent">
                <p.icon className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-xl">{p.title}</div>
              <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function EquipmentSection() {
  const { data, isLoading } = useQuery(equipmentQ({ limit: 4 }));
  const items = data?.items ?? [];
  return (
    <Section>
      <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
        <SectionHeader
          eyebrow="Equipment rental"
          title="Hospital-grade equipment, without the hospital."
          description="Rent oxygen concentrators, beds, wheelchairs and more — sanitised, insured and delivered."
        />
        <Link to="/equipment" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all">
          Browse equipment <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {isLoading ? (
        <SkeletonGrid count={4} />
      ) : items.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((e) => (<EquipmentCard key={e.id} equipment={e} />))}
        </div>
      ) : (
        <EquipmentTeaser />
      )}
    </Section>
  );
}

function EquipmentTeaser() {
  const teasers = ["Oxygen concentrators", "Hospital beds", "Wheelchairs", "BiPAP / CPAP"];
  return (
    <div className="rounded-[2rem] border border-border bg-gradient-to-br from-surface to-primary-soft/60 p-10 lg:p-14">
      <div className="grid gap-8 lg:grid-cols-2 items-center">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-accent mb-3">Coming to the catalogue</div>
          <h3 className="font-display text-3xl md:text-4xl">
            Rent premium medical equipment on demand
          </h3>
          <p className="mt-4 text-muted-foreground max-w-md">
            Same-day delivery, flexible durations, and hospital-grade sanitisation on every unit.
          </p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background">
            Request equipment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {teasers.map((t) => (
            <div key={t} className="glass rounded-2xl p-5">
              <Stethoscope className="h-5 w-5 text-primary" />
              <div className="mt-3 font-medium">{t}</div>
              <div className="text-xs text-muted-foreground mt-1">Available soon</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CareTeamSection() {
  return (
    <Section className="bg-dark text-white/90 rounded-[3rem] mx-4 lg:mx-10">
      <div className="grid gap-12 lg:grid-cols-2 items-center">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Our people</div>
          <h2 className="font-display text-4xl md:text-5xl text-white">
            Nurses, physios and doctors — <span className="text-gradient">handpicked</span>.
          </h2>
          <p className="mt-5 text-white/70 max-w-lg">
            Our team is selected through a five-step vetting process: credentials, background,
            clinical assessment, communication and empathy. Only 4% make the cut.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-dark px-5 py-3 text-sm font-medium"
          >
            Meet the team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { role: "Registered Nurse", count: "120+" },
            { role: "Physiotherapists", count: "45" },
            { role: "Doctors on panel", count: "30" },
            { role: "Care attendants", count: "200+" },
          ].map((c) => (
            <div key={c.role} className="rounded-3xl bg-white/5 border border-white/10 p-6 backdrop-blur">
              <div className="font-display text-4xl text-white">{c.count}</div>
              <div className="text-sm text-white/60 mt-1">{c.role}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function TestimonialsSection() {
  const { data } = useQuery(testimonialsQ({ limit: 8 }));
  const items = data?.items ?? [];
  if (!items.length) return null;
  return (
    <Section>
      <SectionHeader eyebrow="Testimonials" title="Words from the families we serve." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((t) => (<TestimonialCard key={t.id} t={t} />))}
      </div>
    </Section>
  );
}

function BlogVideosSection() {
  const { data: blogs } = useQuery(blogsQ({ limit: 3 }));
  const { data: videos } = useQuery(videosQ({ limit: 3 }));
  const bItems = blogs?.items ?? [];
  const vItems = videos?.items ?? [];
  if (!bItems.length && !vItems.length) return null;
  return (
    <Section>
      {!!bItems.length && (
        <>
          <div className="flex items-end justify-between mb-10">
            <SectionHeader eyebrow="Journal" title="From the care blog" />
            <Link to="/blog" className="text-sm font-medium text-accent">All posts →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {bItems.map((b) => (<BlogCard key={b.id} blog={b} />))}
          </div>
        </>
      )}
    </Section>
  );
}

function FaqSection() {
  const { data } = useQuery(faqsQ({ limit: 6 }));
  const items = data?.items ?? [];
  if (!items.length) return null;
  return (
    <Section className="bg-primary-soft/40">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow="FAQ" title="Answers, before you ask." description="Common questions from families like yours." />
          <Link to="/faq" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            All questions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="lg:col-span-7">
          <FaqAccordion items={items.slice(0, 6)} />
        </div>
      </div>
    </Section>
  );
}

function ReviewsSection() {
  const { data } = useQuery(reviewSummaryQ());
  if (!data || data.total_reviews === 0) return null;
  return (
    <Section>
      <GoogleReviews summary={data} />
    </Section>
  );
}

function ContactCta() {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16 text-white shadow-[var(--shadow-elegant)]"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))" }}
      >
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%)]" />
        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">Ready when you are</div>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              Talk to a care advisor.
            </h2>
            <p className="mt-4 text-white/80 max-w-md">
              Tell us what you need — we'll match the right nurse or equipment, usually within two hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/booking" className="rounded-full bg-white text-dark px-6 py-3.5 text-sm font-medium">
              Book care
            </Link>
            <Link to="/contact" className="rounded-full border border-white/30 text-white px-6 py-3.5 text-sm font-medium">
              Contact us
            </Link>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-64 rounded-3xl border border-border bg-surface animate-pulse" />
      ))}
    </div>
  );
}
