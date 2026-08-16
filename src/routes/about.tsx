import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShieldCheck, Phone } from "lucide-react";
import { settingsQ } from "@/lib/api/queries";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Nupun Home Health Care Services" },
      {
        name: "description",
        content: "Nupun Home Health Care Services provides reliable healthcare and personal care support at home for patients, elderly people and families.",
      },
      { property: "og:title", content: "About — Nupun Home Health Care" },
      { property: "og:description", content: "Nupun Home Health Care Services provides reliable healthcare and personal care support at home." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

/* ─────────────────────── Components ─────────────────────── */

function AboutPage() {
  const { data: settings } = useQuery(settingsQ());
  
  const phone = settings?.phone?.replace(/[^\d+]/g, "") || "919876543210";
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "") || "919876543210";

  // Hero section data
  const heroBadge = settings?.about_hero_badge || "HOME PAGE – ABOUT NUPUN";
  const heroTitle = settings?.about_hero_title || "Care That Comes Home";
  const heroDescription = settings?.about_hero_description || "Nupun Home Health Care Services provides reliable healthcare and personal care support at home for patients, elderly people and families. We help you arrange suitable care according to the patient's condition, care requirements and preferred duty hours.\n\nOur services are designed to make home healthcare more comfortable, convenient and dependable for families.";
  const heroImage = typeof settings?.about_hero_image === "string"
    ? settings.about_hero_image
    : settings?.about_hero_image?.url ||
      "/assets/Get professional and compassionate elderly care at home in Ranchi (2)-Picsart-BackgroundRemover.jpeg";

  // Founders data
  const founders: Array<{ name: string; role: string; image: string; description: string }> =
    (settings as any)?.about_founders?.length
      ? (settings as any).about_founders.map((f: any) => ({
          name: f.name,
          role: f.role,
          image: typeof f.image === "string" ? f.image : f.image?.url || "https://i.pravatar.cc/300",
          description: f.description,
        }))
      : [
          {
            name: "Sandeep Anand",
            role: "Founder, Nupun Home Health Care",
            image: "https://i.pravatar.cc/300?u=sandeep",
            description:
              "With over two decades of leadership experience across PepsiCo, ITC, GSK, and Walmart, and an MBA from SP Jain (SPJIMR), Sandeep has built and managed large-scale operations where reliability is non-negotiable.\n\nThe vision for Nupun is deeply personal, emerging from his experience navigating the lack of organized elderly care during his parents' terminal illnesses. He combines operational excellence with emotional purpose to create care that is structured, dependable, and reassuring for families.",
          },
          {
            name: "Megha Gandhi",
            role: "Co-Founder, Nupun Home Health Care",
            image: "https://i.pravatar.cc/300?u=megha",
            description:
              "Having managed business leadership roles across YES Bank, HDFC Bank, and Axis Bank, Megha has spent her career working closely with senior citizens. This professional background, coupled with the personal loss of her mother, deeply shaped her commitment to dignity and empathy.\n\nAt Nupun, Megha leads with compassion, ensuring that every service is personal, respectful, and built on a foundation of absolute trust to redefine the elder care experience.",
          },
        ];

  // Address data
  const addressName = (settings as any)?.about_address_name || "Nupun Home Health Care";
  const addressLine1 = (settings as any)?.about_address_line1 || "5th Floor, Tower-C, Unitech Cyber Park";
  const addressLine2 = (settings as any)?.about_address_line2 || "Sector-39, Gurgaon, India – 122003";
  const mapEmbedUrl = (settings as any)?.about_map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.8105740698165!2d77.04258837617478!3d28.424982693444062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d228f4116c271%3A0xc34b3dc04c5e3d74!2sUnitech%20Cyber%20Park!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  return (
    <>
      {/* ── Custom Split Hero (Preserved layout, updated content) ──────────────── */}
      <div className="relative isolate overflow-hidden bg-[#fafafa]">
        <div className="absolute top-0 right-0 -z-10 w-full h-full opacity-30 bg-gradient-to-l from-primary/10 to-transparent" />

        <div className="container-x pt-24 pb-12 md:pb-16 lg:pt-28 lg:pb-20 grid lg:grid-cols-12 gap-6 lg:gap-6 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-6 lg:pr-6">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-primary"
            >
              <ShieldCheck className="h-4 w-4" fill="currentColor" /> {heroBadge}
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground"
            >
              {heroTitle}
            </motion.h1>

            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 text-base md:text-lg text-foreground/80 max-w-lg leading-relaxed font-medium"
            >
              {heroDescription.split("\n\n").map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <a
                href={`tel:${phone}`}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5"
              >
                <Phone className="h-5 w-5" /> Call Now
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-black/10 bg-white px-8 py-3.5 text-[15px] font-medium text-foreground shadow-sm hover:bg-black/5 hover:border-black/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-[#25D366]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </motion.div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative h-[400px] w-full lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[45%] xl:w-[50%] -z-10">
          <img
            src={heroImage}
            alt={heroTitle}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/50 to-transparent lg:w-48" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent lg:hidden" />
        </div>
      </div>

      {/* ── Our Founders Section ──────────────────────────────────────────────── */}
      <Section className="pt-16 pb-12 lg:pt-20 lg:pb-16 bg-[#FAFAFA]">
        <div className="container-x">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-center text-foreground mb-12 lg:mb-16">
            Our Founders
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {founders.map((founder, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 lg:p-12 flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start border border-black/5">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shrink-0 shadow-sm"
                />
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-[28px] font-medium tracking-tight text-foreground mb-1">
                    {founder.name}
                  </h3>
                  <div className="text-primary font-medium text-sm md:text-base mb-6 tracking-wide">
                    {founder.role}
                  </div>
                  <div className="text-gray-700 text-base md:text-[17px] leading-relaxed space-y-4 font-medium">
                    {founder.description.split("\n\n").map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Our Address Section ──────────────────────────────────────────────── */}
      <Section className="pt-8 pb-20 lg:pb-24 bg-[#FAFAFA]">
        <div className="container-x max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Address Info */}
            <div className="md:pr-8 text-center md:text-left">
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-6 md:mb-8">
                Our Address
              </h2>
              <div className="space-y-1">
                <h4 className="text-xl md:text-2xl font-medium tracking-tight text-foreground mb-2">{addressName}</h4>
                <p className="text-gray-700 text-lg md:text-xl font-medium">
                  {addressLine1}
                </p>
                <p className="text-gray-700 text-lg md:text-xl font-medium">
                  {addressLine2}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="w-full h-[250px] md:h-[350px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/5">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
