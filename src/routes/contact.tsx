import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import { PageHero } from "@/components/site/PageHero";
import { Section } from "@/components/site/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nupun Home Health Care" },
      { name: "description", content: "Talk to a care advisor. We respond within 2 hours." },
      { property: "og:title", content: "Contact — Nupun Home Health Care" },
      { property: "og:description", content: "Talk to a care advisor." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useQuery(settingsQ());
  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "");

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to a care advisor."
        description="Tell us what you need — we typically respond within two hours, every day of the week."
        crumbs={[{ label: "Home", to: "/" }, { label: "Contact" }]}
        badges={["Response within 2 hours", "24/7 care desk"]}
      />

      <Section className="pt-16 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left: contact channels */}
          <div className="space-y-4 lg:col-span-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {phone && (
                <InfoCard icon={Phone} label="Call us" value={settings?.phone ?? ""} href={`tel:${phone}`} />
              )}
              {whatsapp && (
                <InfoCard
                  icon={MessageCircle}
                  label="WhatsApp"
                  value={settings?.whatsapp ?? settings?.phone ?? ""}
                  href={`https://wa.me/${whatsapp}`}
                />
              )}
              {settings?.email && (
                <InfoCard icon={Mail} label="Email" value={settings.email} href={`mailto:${settings.email}`} />
              )}
              {settings?.address && <InfoCard icon={MapPin} label="Visit" value={settings.address} />}
            </div>

            {settings?.working_hours && settings.working_hours.length > 0 && (
              <div className="rounded-3xl border border-border bg-surface p-6">
                <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
                  <Clock className="h-3.5 w-3.5" /> Working hours
                </div>
                <div className="grid gap-2 text-sm">
                  {settings.working_hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between border-t border-border pt-2 first:border-0 first:pt-0"
                    >
                      <span className="text-muted-foreground">{h.day}</span>
                      <span className="font-medium">{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {settings?.google_map_embed && (
              <div
                className="aspect-video overflow-hidden rounded-3xl border border-border [&_iframe]:h-full [&_iframe]:w-full"
                dangerouslySetInnerHTML={{ __html: settings.google_map_embed }}
              />
            )}
          </div>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.4)] lg:p-9">
              <h2 className="font-display text-2xl tracking-tight md:text-3xl">Send us a message</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Share a few details and a care advisor will reach out shortly.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-accent">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-0.5 break-words text-sm font-medium">{value}</div>
      </div>
    </>
  );
  return href ? (
    <a
      href={href}
      className="flex items-center gap-4 rounded-3xl border border-border bg-surface p-5 transition-colors hover:border-primary"
    >
      {inner}
    </a>
  ) : (
    <div className="flex items-start gap-4 rounded-3xl border border-border bg-surface p-5">{inner}</div>
  );
}
