import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";

import { Section, SectionHeader } from "@/components/site/Section";
import { staffQ } from "@/lib/api/queries";
import { avatarPlaceholder, imageSrc } from "@/lib/placeholders";
import { useIsMobile } from "@/hooks/use-mobile";
import type { StaffMember } from "@/lib/api/types";

/* ── Staff Card ─────────────────────────────────────────────────── */

type Duration = "7" | "15" | "30";

function StaffCard({ staff }: { staff: StaffMember }) {
  const [duration, setDuration] = useState<Duration>("7");
  const photo = staff.photo;

  const price =
    duration === "7"
      ? staff.price_7_days
      : duration === "15"
        ? staff.price_15_days
        : staff.price_30_days;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:shadow-elegant hover:-translate-y-1"
    >
      {/* Photo */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary/30">
        <img
          src={imageSrc(photo, avatarPlaceholder(staff.name))}
          alt={staff.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Name & Rating */}
        <div className="flex flex-col items-center gap-1.5 mb-3">
          <h3 className="text-sm font-display font-medium text-foreground text-center leading-tight tracking-tight">
            {staff.name}
          </h3>

          <div className="flex items-center justify-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.round(staff.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-border text-border"
                }`}
              />
            ))}
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              {staff.rating}
            </span>
          </div>
        </div>

        {/* Duration Tabs */}
        <div className="flex justify-center gap-3">
          {(["7", "15", "30"] as Duration[]).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className="text-[11px] transition-colors"
            >
              {duration === d ? (
                <span className="text-primary font-bold">{d} Days</span>
              ) : (
                <span className="text-muted-foreground font-medium hover:text-foreground">
                  {d} Days
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Price */}
        {price != null && (
          <p className="mt-2 text-center text-base font-display font-semibold text-primary">
            ₹{price.toLocaleString("en-IN")}
          </p>
        )}

        {/* Service Label */}
        {staff.service_label && (
          <p className="text-[11px] text-center text-muted-foreground mt-2 line-clamp-1">
            {staff.service_label}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Category Tabs + Staff Grid ─────────────────────────────────── */

export function OurStaffSection() {
  const { data, isLoading } = useQuery(staffQ({ limit: 50 }));
  const isMobile = useIsMobile();

  /* Sort by admin-set `order` ascending */
  const items = useMemo(
    () =>
      [...(data?.items ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [data],
  );

  /* Build unique category tabs in order of first appearance */
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const s of items) {
      const cat = (s.category ?? "").trim();
      if (cat && !seen.has(cat)) {
        seen.add(cat);
        result.push(cat);
      }
    }
    return result;
  }, [items]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  /* Default to first available category */
  useEffect(() => {
    if (!activeCategory && categories.length) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredStaff = useMemo(
    () => items.filter((s) => (s.category ?? "").trim() === activeCategory),
    [items, activeCategory],
  );

  if (isLoading) {
    return (
      <Section>
        <div className="mb-6 max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight">
            Our Staff
          </h2>
        </div>
        <div className="flex justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Section>
    );
  }

  if (!items.length) return null;

  return (
    <Section className="py-8 lg:py-12">
      <SectionHeader
        eyebrow="Meet the team"
        title="Our Staff"
        description="You'll always know your therapist's name and qualification before the visit — it appears on your booking as soon as they're assigned."
        align="center"
      />

      {/* Category Tabs */}
      <div className="relative mb-8">
        <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full px-4 md:px-0 mx-auto md:w-max min-w-full md:min-w-0 md:justify-center border-b border-border/50">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-3 text-[15px] font-medium transition-colors relative ${
                activeCategory === cat
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="staff-category-tab"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid / Mobile Scroll */}
      <div className="mt-6">
        {isMobile ? (
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory gap-4 px-4 pb-4 w-full">
            <AnimatePresence mode="popLayout">
              {filteredStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="w-[45%] sm:w-[40%] shrink-0 snap-center"
                >
                  <StaffCard staff={staff} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredStaff.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty state */}
        {filteredStaff.length === 0 && activeCategory && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground text-sm">
              No staff members in this category yet.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}

/* ── Sample profiles (fallback when API has no data) ────────────── */

const SAMPLE = [
  {
    id: "sample-1",
    name: "Dr. Ananya Sen",
    service_label: "Physiotherapist · MPT (Neuro)",
    experience: "9 years",
    bio: "Stroke rehabilitation and post-surgical recovery across Kolkata and Howrah.",
    rating: 4.9,
  },
  {
    id: "sample-2",
    name: "Dr. Rajat Bhowmik",
    service_label: "Physiotherapist · BPT",
    experience: "6 years",
    bio: "Orthopaedic and sports injury rehabilitation with portable modality work.",
    rating: 4.8,
  },
  {
    id: "sample-3",
    name: "Sohini Das",
    service_label: "Yoga Therapist",
    experience: "7 years",
    bio: "Therapeutic yoga for chronic back pain, breathing and mobility programmes.",
    rating: 4.9,
  },
  {
    id: "sample-4",
    name: "Debjit Roy",
    service_label: "Massage Therapist",
    experience: "5 years",
    bio: "Deep tissue and dry massage under strict clinical conduct standards.",
    rating: 4.7,
  },
];

/* ── Flat card for sample/fallback display ──────────────────────── */

export function FallbackStaffGrid() {
  return (
    <Section className="py-8 lg:py-12">
      <SectionHeader
        eyebrow="Meet the team"
        title="Who comes to your door"
        description="You'll always know your therapist's name and qualification before the visit — it appears on your booking as soon as they're assigned."
        align="center"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SAMPLE.map((t) => (
          <article
            key={t.id}
            className="overflow-hidden rounded-3xl border border-border/70 bg-card transition hover:shadow-soft"
          >
            <img
              src={avatarPlaceholder(t.name)}
              alt={t.name}
              className="aspect-square w-full object-cover"
            />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg leading-tight tracking-tight">
                  {t.name}
                </h3>
                {t.rating ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-amber-600">
                    <Star className="h-3 w-3 fill-current" />
                    {t.rating}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-primary">{t.service_label}</p>
              {t.experience && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.experience} experience
                </p>
              )}
              {t.bio && (
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {t.bio}
                </p>
              )}
              <p className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified therapist
              </p>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Showing sample profiles — these are replaced automatically as therapist
        profiles are published from the admin panel.
      </p>
    </Section>
  );
}
