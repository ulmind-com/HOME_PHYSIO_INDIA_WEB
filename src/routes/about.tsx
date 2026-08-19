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

  // Hero section data
  const heroTitle = settings?.about_hero_title || "ABOUT NUPUN";
  const heroDescription = settings?.about_hero_description || "Nupun Home Health Care Services provides reliable and compassionate healthcare support in the comfort of your home.\n\nWe connect families with trained and verified nurses, caregivers and healthcare professionals, offering personalized care based on each patient needs.\n\n. Flexible care options designed around your requirements.\n. Professional nursing, elderly care, physiotherapy and recovery support.\n. Patient - focused care with safety, dignity and compassion.\n. Reliable support for patient and families throughout their care journey.";

  // Split description into text and bullets
  const lines = heroDescription.split('\n').map((l: string) => l.trim()).filter(Boolean);
  const leftText: string[] = [];
  const rightBullets: string[] = [];
  lines.forEach((line: string) => {
    if (line.match(/^[.\-•]/)) {
      rightBullets.push(line.replace(/^[.\-•]\s*/, ''));
    } else {
      leftText.push(line);
    }
  });

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
      {/* ── Custom Split Hero ──────────────── */}
      <div className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50" />

        <div className="container-x pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-36 lg:pb-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-6">
            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white uppercase"
            >
              {heroTitle}
            </motion.h1>

            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 text-base md:text-[19px] text-white/90 max-w-xl leading-relaxed font-medium"
            >
              {leftText.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Bullets */}
          {rightBullets.length > 0 && (
            <div className="relative pl-2 md:pl-0 lg:pl-10">
              {/* Vertical dotted line connecting bullets */}
              <div className="absolute left-[19px] lg:left-[51px] top-4 bottom-4 w-px border-l-2 border-dashed border-white/30 hidden md:block"></div>
              
              <div className="space-y-8 md:space-y-12">
                {rightBullets.map((bullet, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                    className="relative flex items-start gap-5 md:gap-6"
                  >
                    {/* Bullet point circle */}
                    <div className="relative z-10 flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm mt-0.5 border border-white/20">
                       <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white shadow-sm"></div>
                    </div>
                    {/* Text */}
                    <p className="text-base md:text-lg text-white/95 font-medium leading-relaxed">
                      {bullet}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
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
