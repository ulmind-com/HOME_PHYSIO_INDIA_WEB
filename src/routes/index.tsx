import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  blogsQ,
  faqsQ,
  reviewSummaryQ,
  servicesQ,
  testimonialsQ,
} from "@/lib/api/queries";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { Section, SectionHeader, EmptyState } from "@/components/site/Section";
import { ServicesMarquee } from "@/components/site/ServicesMarquee";
import { EquipmentCarousel } from "@/components/site/EquipmentCarousel";
import { BlogCard } from "@/components/site/cards/BlogCard";
import { VideoTestimonialsSection } from "@/components/site/VideoTestimonialsSection";
import { TestimonialCard } from "@/components/site/cards/TestimonialCard";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { Hero } from "@/components/site/Hero";
import { AboutWelcomeSection } from "@/components/site/AboutWelcomeSection";
import { HowItWorksSection } from "@/components/site/HowItWorksSection";
import { settingsQ } from "@/lib/api/queries";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nupun Home Health Care — Hospital-grade care, at home" },
      {
        name: "description",
        content:
          "Verified nurses, physiotherapists and premium medical equipment — orchestrated by a dedicated advisor and delivered to your door in hours.",
      },
      { property: "og:title", content: "Nupun Home Health Care — Hospital-grade care, at home" },
      {
        property: "og:description",
        content: "Verified nurses, physiotherapists and premium medical equipment — delivered home.",
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
      <AboutWelcomeSection />
      <TrustBar />
      <ServicesMarquee />
      <HowItWorksSection />
      <EquipmentSection />
      <CareTeamSection />
      <TestimonialsSection />
      <VideoTestimonialsSection />
      <BlogVideosSection />

      <FaqSection />
      <ReviewsSection />
      <ContactCta />
    </>
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




function EquipmentSection() {
  return (
    <Section className="py-24 lg:py-32">
      <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
        <SectionHeader
          eyebrow="Equipment"
          title="Hospital-grade equipment, at home."
          description="Ultrasound, monitoring, anesthesiology and clinical kits — sanitised, insured and delivered."
        />
        <Link to="/equipment" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:gap-2 transition-all">
          Browse equipment <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <EquipmentCarousel />
    </Section>
  );
}

type PersonCard = {
  image: string;
  title: string;
  subtitle: string;
  cta_label?: string;
  cta_href?: string;
};

const DEFAULT_PEOPLE: PersonCard[] = [
  { image: "/assets/people/skilled-nursing.jpg", title: "Skilled Nursing", subtitle: "Trained nurses at home" },
  { image: "/assets/people/senior-care.jpg", title: "Senior Care", subtitle: "Companionship & mobility" },
  { image: "/assets/people/physiotherapy.jpg", title: "Physiotherapy", subtitle: "Movement & recovery" },
  { image: "/assets/people/specialist-doctor.jpg", title: "Specialist Doctors", subtitle: "Consult at home" },
];

function CareTeamSection() {
  const { data: settings } = useQuery(settingsQ());
  const admin = settings as unknown as { professionals?: PersonCard[]; people?: PersonCard[] } | undefined;
  const items =
    admin?.professionals?.length ? admin.professionals :
    admin?.people?.length ? admin.people :
    DEFAULT_PEOPLE;
  const loop = [...items, ...items];
  const duration = Math.max(28, items.length * 7);

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

        {/* RIGHT — auto-scrolling people marquee */}
        <div className="relative overflow-hidden group">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-16 bg-gradient-to-r from-dark to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-16 bg-gradient-to-l from-dark to-transparent" />
          <motion.div
            className="flex gap-4 w-max py-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration, ease: "linear", repeat: Infinity }}
            style={{ willChange: "transform" }}
          >
            {loop.map((p, i) => (
              <PeopleMarqueeCard key={`${p.title}-${i}`} card={p} />
            ))}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function PeopleMarqueeCard({ card }: { card: PersonCard }) {
  const href = card.cta_href ?? "/booking";
  const ctaLabel = card.cta_label ?? "Book Now";
  return (
    <div className="w-[180px] md:w-[220px] shrink-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[var(--shadow-elegant)] bg-white/5">
        <img
          src={card.image}
          alt={card.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-x-3 bottom-3 flex flex-col gap-2 text-white"
        >
          <div>
            <div className="font-display text-base leading-tight">{card.title}</div>
            <p className="text-[11px] text-white/80 leading-snug line-clamp-2">{card.subtitle}</p>
          </div>
          <Link
            to={href}
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/40 bg-white/20 backdrop-blur-xl px-3 py-1.5 text-[11px] font-medium text-white hover:bg-white/30 transition-colors"
          >
            {ctaLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>
      </div>
    </div>
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
  const bItems = blogs?.items ?? [];
  if (!bItems.length) return null;

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
