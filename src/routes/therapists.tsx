import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, GraduationCap, Search, Sparkles } from "lucide-react";

import { PageHero } from "@/components/site/PageHero";
import { Section, SectionHeader } from "@/components/site/Section";
import { OurStaffSection, FallbackStaffGrid } from "@/components/site/OurStaffSection";
import { useAuth } from "@/contexts/AuthContext";
import { staffQ } from "@/lib/api/queries";
import {
  bookableTherapistsQ,
  SERVICE_SLUGS,
  type BookableTherapist,
  type ServiceCategory,
} from "@/lib/api/therapy";
import { QUALIFICATIONS, THERAPIST_TIERS } from "@/lib/plan";
import { avatarPlaceholder, imageSrc, pageHeroImage } from "@/lib/placeholders";
import { openAuthDialog } from "@/lib/auth-dialog";

export const Route = createFileRoute("/therapists")({
  head: () => ({
    meta: [
      { title: "Our therapists — Home Physio India" },
      {
        name: "description",
        content:
          "Document-verified physiotherapists, yoga therapists and massage therapists delivering home visits across West Bengal.",
      },
      { property: "og:title", content: "Our therapists — Home Physio India" },
      { property: "og:url", content: "/therapists" },
    ],
    links: [{ rel: "canonical", href: "/therapists" }],
  }),
  component: TherapistsPage,
});

/* ── Live directory ─────────────────────────────────────────────── */

const CATEGORY_TABS: { key: ServiceCategory; label: string }[] = [
  { key: "physiotherapy", label: "Physiotherapy" },
  { key: "yoga_therapy", label: "Yoga therapy" },
  { key: "massage_therapy", label: "Massage therapy" },
];

function TherapistCard({ therapist }: { therapist: BookableTherapist }) {
  const t = therapist;
  const tags = [t.qualification, t.therapist_tier].filter(Boolean) as string[];

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-elegant">
      <div className="aspect-[4/5] w-full overflow-hidden bg-secondary/30">
        <img
          src={imageSrc(t.avatar, avatarPlaceholder(t.name))}
          alt={t.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base tracking-tight">{t.name}</h3>
        {t.specialization && (
          <p className="mt-1 text-sm text-muted-foreground">{t.specialization}</p>
        )}

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary"
              >
                {tag.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <BadgeCheck className="h-3.5 w-3.5 text-primary" />
          Document verified
          {typeof t.experience_years === "number" && t.experience_years > 0 && (
            <span>· {t.experience_years} yrs experience</span>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveTherapistDirectory() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [category, setCategory] = useState<ServiceCategory>("physiotherapy");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const therapists = useQuery(bookableTherapistsQ(category, debounced, isAuthenticated));
  const list = therapists.data?.items ?? [];
  const isMassage = category === "massage_therapy";

  return (
    <Section>
      <SectionHeader
        eyebrow="Available now"
        title="Therapists taking home visits"
        description="Live from the platform — every profile here is admin-approved and can be booked directly."
      />

      {/* Signed-out visitors can't see the roster: the directory is gated so
          therapist details aren't scraped, and massage results are matched to
          the patient's own gender, which needs a signed-in profile. */}
      {!isAuthenticated ? (
        <div className="rounded-3xl border border-border/70 bg-card p-8 text-center sm:p-12">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h3 className="mt-4 font-display text-xl tracking-tight">
            Sign in to see who's available
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            The live therapist roster is available to registered patients. Massage therapists
            are matched to your gender, so we need to know who you are before showing them.
          </p>
          <button
            type="button"
            onClick={() => openAuthDialog("login")}
            disabled={authLoading}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            Sign in to browse therapists
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setCategory(tab.key)}
                  className={
                    "rounded-full px-4 py-2 text-sm font-semibold transition " +
                    (category === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "border border-border/70 text-muted-foreground hover:bg-secondary/60")
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or speciality…"
                className="h-11 w-full rounded-2xl border border-input bg-transparent pl-10 pr-4 text-sm"
              />
            </div>
          </div>

          {isMassage && (
            <p className="mt-5 rounded-2xl bg-primary-soft/50 p-4 text-sm text-primary">
              For your safety, massage therapists are gender-matched — you only see
              therapists you are allowed to book.
            </p>
          )}

          <div className="mt-8">
            {therapists.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading therapists…</p>
            ) : therapists.isError ? (
              <p className="text-sm text-destructive">
                Couldn't load the therapist list. Please refresh and try again.
              </p>
            ) : list.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                {debounced
                  ? `No therapists match "${debounced}" in this category.`
                  : isMassage
                    ? "No gender-matched massage therapists are available in your area yet. Add your gender to your profile if you haven't already."
                    : "No therapists are available in this category yet."}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((t) => (
                  <TherapistCard key={t.id} therapist={t} />
                ))}
              </div>
            )}
          </div>

          {list.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                to="/booking"
                search={{ service: SERVICE_SLUGS[category] }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Book a home visit
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-2 text-xs text-muted-foreground">
                You'll pick your therapist and an open time slot inside the booking flow.
              </p>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

/* ── Main Page ──────────────────────────────────────────────────── */

function TherapistsPage() {
  const staff = useQuery(staffQ({ limit: 50 }));
  const hasEditorialStaff = (staff.data?.items?.length ?? 0) > 0;

  return (
    <>
      <PageHero
        eyebrow="Our therapists"
        title="Verified professionals, matched to you"
        description="Every therapist on the platform is document-verified and admin-approved before taking a single home visit."
        image={pageHeroImage("therapists")}
        crumbs={[{ label: "Home", to: "/" }, { label: "Therapists" }]}
        badges={["Document verified", "Admin approved", "MPT · BPT · PT · DPT"]}
      />

      {/* Real, bookable therapists come first. The editorial staff section
          below is marketing content managed from the admin CMS. */}
      <LiveTherapistDirectory />

      {hasEditorialStaff ? <OurStaffSection /> : <FallbackStaffGrid />}

      <Section className="bg-secondary/30">
        <SectionHeader
          eyebrow="Tiers"
          title="Three levels of physiotherapy expertise"
          description="Your care category and condition determine which tier is assigned to your booking."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {THERAPIST_TIERS.map((t) => (
            <div
              key={t.tier}
              className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8"
            >
              <GraduationCap className="h-7 w-7 text-primary" />
              <h3 className="mt-4 font-display text-xl tracking-tight">{t.tier}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-border/70 bg-card p-6 sm:p-8">
          <h3 className="font-display text-xl tracking-tight">Accepted qualifications</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Registration is approved only after qualification and document verification.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {QUALIFICATIONS.map((q) => (
              <span
                key={q}
                className="rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary"
              >
                {q}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Are you a therapist?
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Join a platform with steady home-visit work, portable equipment support and
            transparent payouts. No subscription fee at launch.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => openAuthDialog("therapist_signup")}
              className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
            >
              Register as a therapist
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/careers"
              className="inline-flex items-center rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
            >
              See open roles
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
