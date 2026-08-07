import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { blogsQ, faqsQ, reviewSummaryQ, settingsQ, testimonialsQ } from "@/lib/api/queries";
import { Section, SectionHeader } from "@/components/site/Section";
import { BlogCard } from "@/components/site/cards/BlogCard";
import { VideoTestimonialsSection } from "@/components/site/VideoTestimonialsSection";
import { TestimonialCard } from "@/components/site/cards/TestimonialCard";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { GoogleReviews } from "@/components/site/GoogleReviews";
import { Hero } from "@/components/site/Hero";
import { CategoryShowcasePremium } from "@/components/site/CategoryShowcasePremium";
import { ComprehensiveServicesSection } from "@/components/site/ComprehensiveServicesSection";
import { HowItWorksSection } from "@/components/site/HowItWorksSection";
import { ProfessionalsSection } from "@/components/site/ProfessionalsSection";
import { PremiumScrollReveal } from "@/components/site/PremiumScrollReveal";
import { WhyChooseUsSection } from "@/components/site/WhyChooseUsSection";
import { CommitmentSection } from "@/components/site/CommitmentSection";

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
        content:
          "Verified nurses, physiotherapists and premium medical equipment — delivered home.",
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
      {/* 1. Hero Page / Top Banner */}
      <Hero />
      <TrustBar />

      {/* 2. Our Categories Section (Quick view icons/boxes) */}
      <PremiumScrollReveal>
        <CategoryShowcasePremium />
      </PremiumScrollReveal>

      {/* 3. Our Comprehensive Services (4 detailed static cards — Aroha Cares style) */}
      <ComprehensiveServicesSection />

      {/* 4. About Us Section */}
      <PremiumScrollReveal>
        <ProfessionalsSection />
      </PremiumScrollReveal>

      {/* 5. Getting Started Easy (Step 1, 2, 3) */}
      <PremiumScrollReveal>
        <HowItWorksSection />
      </PremiumScrollReveal>

      {/* 7. Care Blog Section */}
      <PremiumScrollReveal>
        <BlogVideosSection />
      </PremiumScrollReveal>

      {/* 6. They Say About Nupun (Testimonials & Reviews) */}
      <PremiumScrollReveal>
        <TestimonialsSection />
      </PremiumScrollReveal>
      <PremiumScrollReveal>
        <VideoTestimonialsSection />
      </PremiumScrollReveal>
      <PremiumScrollReveal>
        <ReviewsSection />
      </PremiumScrollReveal>

      {/* Why Choose Nupun Section */}
      <PremiumScrollReveal>
        <WhyChooseUsSection />
      </PremiumScrollReveal>

      {/* Commitment to Excellence Section */}
      <PremiumScrollReveal>
        <CommitmentSection />
      </PremiumScrollReveal>

      {/* 8. FAQ's Section */}
      <PremiumScrollReveal>
        <FaqSection />
      </PremiumScrollReveal>

      {/* Closing Contact CTA */}
      <PremiumScrollReveal>
        <ContactCta />
      </PremiumScrollReveal>
    </>
  );
}

function TrustBar() {
  const { data: settings } = useQuery(settingsQ());
  const items = settings?.trust_bar_items?.length
    ? settings.trust_bar_items
    : [
        "Licensed nurses",
        "24/7 helpline",
        "Insurance-friendly",
        "Transparent pricing",
        "Background-checked",
      ];
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

const DEFAULT_TESTIMONIALS: any /* eslint-disable-line @typescript-eslint/no-explicit-any */[] = [
  {
    id: "1",
    name: "Rajeshwar Roy",
    role: "Son of Patient, Kolkata",
    rating: 5,
    content:
      "Nupun Health arranged an ICU-trained nurse within two hours after my father was discharged. The clinical discipline and empathy shown by the staff were exceptional.",
  },
  {
    id: "2",
    name: "Anjali Mukherjee",
    role: "Post-Surgery Patient",
    rating: 5,
    content:
      "The physiotherapist assigned to me for knee replacement recovery was thorough and patient. I walked without assistance much faster than my doctor anticipated!",
  },
  {
    id: "3",
    name: "Saurabh Banerjee",
    role: "Elder Care Client",
    rating: 5,
    content:
      "Having a dedicated 24/7 care attendant for my elderly mother brought our family peace of mind. Truly hospital-grade standards at home.",
  },
];

function TestimonialsSection() {
  const { data } = useQuery(testimonialsQ({ limit: 8 }));
  const rawItems = data?.items ?? [];
  const items = rawItems.length ? rawItems : DEFAULT_TESTIMONIALS;

  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true, align: "start" }, [
    AutoScroll({
      playOnInit: true,
      speed: 1.2,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      direction: "forward",
    }),
  ]);

  return (
    <Section className="overflow-hidden pb-4">
      <SectionHeader eyebrow="Testimonials & Reviews" title="They Say About Nupun" />
      <div className="mt-10 -mx-4 md:-mx-8">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex pl-4 md:pl-8">
            {[...items, ...items, ...items].map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_35%] lg:flex-[0_0_28%] pr-4 md:pr-6"
              >
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

const DEFAULT_BLOGS: any /* eslint-disable-line @typescript-eslint/no-explicit-any */[] = [
  {
    id: "1",
    title: "How to Ensure Safety & Comfort for Seniors Recovering at Home",
    slug: "senior-home-recovery-safety",
    category_name: "Elder Care",
    excerpt:
      "Essential guidelines for home adaptations, fall prevention, and vitals monitoring to create a safe post-hospitalization healing sanctuary.",
    author_name: "Dr. A. Sengupta",
    read_time: "4",
    featured_image: "/assets/hero-slide-2.jpeg",
    published_at: "2026-07-28T10:00:00Z",
  },
  {
    id: "2",
    title: "Understanding In-Home Physiotherapy: Timeline & Milestones",
    slug: "in-home-physiotherapy-milestones",
    category_name: "Physiotherapy",
    excerpt:
      "What to expect during orthopedic or stroke rehabilitation, and why familiarity of home accelerates cognitive and physical recovery.",
    author_name: "S. Roy, PT",
    read_time: "5",
    featured_image: "/assets/hero-slide-1.jpeg",
    published_at: "2026-07-22T10:00:00Z",
  },
  {
    id: "3",
    title: "When Do You Need Skilled ICU Nursing Care at Home?",
    slug: "skilled-icu-nursing-at-home-guide",
    category_name: "Skilled Nursing",
    excerpt:
      "A step-by-step assessment guide for families evaluating round-the-clock ventilator, tracheostomy, or palliative nursing care.",
    author_name: "Nurse Lead Team",
    read_time: "3",
    featured_image: "/assets/hero-slide-3.jpeg",
    published_at: "2026-07-15T10:00:00Z",
  },
];

function BlogVideosSection() {
  const { data: blogs } = useQuery(blogsQ({ limit: 6 }));
  const rawItems = blogs?.items ?? [];
  const bItems = rawItems.length ? rawItems : [...DEFAULT_BLOGS, ...DEFAULT_BLOGS];

  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true, align: "start" }, [
    AutoScroll({
      playOnInit: true,
      speed: 1.2,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      direction: "forward",
    }),
  ]);

  return (
    <Section className="overflow-hidden">
      <div className="flex items-end justify-between mb-10">
        <SectionHeader eyebrow="Care Blog" title="Latest from Our Care Blog" />
        <Link to="/blog" className="text-sm font-medium text-accent hover:underline mb-8">
          All posts →
        </Link>
      </div>

      <div className="-mx-4 md:-mx-8">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex pl-4 md:pl-8">
            {bItems.map((b, i) => (
              <div
                key={`${b.id}-${i}`}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_35%] lg:flex-[0_0_28%] pr-4 md:pr-6 pb-4"
              >
                <BlogCard blog={b} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

const DEFAULT_FAQS: any /* eslint-disable-line @typescript-eslint/no-explicit-any */[] = [
  {
    id: "1",
    question: "How quickly can Nupun arrange a nurse or caregiver at my home?",
    answer:
      "In most cases, we can verify your medical requirements and assign a qualified nurse or attendant to your doorstep within 2 to 4 hours of your booking consultation.",
  },
  {
    id: "2",
    question: "Are all Nupun caregivers and nurses certified and background-checked?",
    answer:
      "Yes. Every registered nurse, physiotherapist, and care attendant goes through a rigorous 5-step vetting process, including medical credentials verification, criminal background checks, and practical clinical skills testing.",
  },
  {
    id: "3",
    question:
      "Can I request a replacement if the assigned caregiver does not suit our family schedule?",
    answer:
      "Absolutely. Your dedicated care advisor maintains daily coordination and can facilitate a smooth caregiver replacement within 24 hours without any interruption to ongoing care.",
  },
  {
    id: "4",
    question: "Do you provide medical equipment along with nursing or therapy services?",
    answer:
      "Yes, we provide comprehensive ICU setup rentals, hospital beds, oxygen concentrators, BiPAP/CPAP monitors, and specialized physiotherapy equipment directly installed at your residence.",
  },
  {
    id: "5",
    question: "How does billing and pricing work for long-term care plans?",
    answer:
      "We offer complete transparent pricing with weekly or monthly billing packages tailored to your chosen care shifts (8-hr, 12-hr, or 24-hr live-in care). No hidden charges.",
  },
];

function FaqSection() {
  const { data } = useQuery(faqsQ({ limit: 6 }));
  const rawItems = data?.items ?? [];
  const items = rawItems.length ? rawItems : DEFAULT_FAQS;

  return (
    <Section className="bg-[#F8F9FA]">
      <div className="grid gap-12 lg:grid-cols-2 items-start">
        {/* Left Side: Illustration */}
        <div className="flex items-center justify-center lg:justify-end pr-0 lg:pr-8">
          <img
            src="/assets/faq-illustration.jpeg"
            alt="Telemedicine Consultation"
            className="w-[85%] md:w-[70%] lg:w-[85%] max-w-md h-auto mix-blend-multiply"
          />
        </div>

        {/* Right Side: FAQs */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="flex flex-col justify-center will-change-transform"
          style={{ transform: 'translateZ(0)' }}
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-6 leading-tight tracking-tight"
          >
            Frequently Asked
            <br />
            <span className="text-primary">Questions</span>
          </motion.h2>

          <FaqAccordion items={items.slice(0, 6)} />

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="mt-8 text-center sm:text-left"
          >
            <Link
              to="/faq"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary/10 text-primary px-8 py-3.5 font-semibold hover:bg-primary hover:text-white transition-colors duration-300"
            >
              Read More...
            </Link>
          </motion.div>
        </motion.div>
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
  const { data: settings } = useQuery(settingsQ());
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] p-10 lg:p-16 text-white shadow-[var(--shadow-elegant)] will-change-transform"
        style={{ background: "linear-gradient(135deg, var(--accent), var(--primary))", transform: 'translateZ(0)' }}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%)]" />
        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">
              Ready when you are
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white">
              {settings?.cta_title || "Talk to a care advisor."}
            </h2>
            <p className="mt-4 text-white/80 max-w-md">
              {settings?.cta_description ||
                "Tell us what you need — we'll match the right nurse or equipment, usually within two hours."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              to="/booking"
              className="rounded-full bg-white text-dark px-6 py-3.5 text-sm font-medium transition-transform hover:scale-105"
            >
              Book care
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/30 text-white px-6 py-3.5 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Contact us
            </Link>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
