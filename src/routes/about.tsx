import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Phone,
  Activity,
  UserPlus,
  Heart,
  Bed,
  Syringe,
  Droplet,
  Bandage,
  Wind,
  Droplets,
  ActivitySquare,
  Thermometer,
  TestTube,
  BriefcaseMedical,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageCircle
} from "lucide-react";
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

/* ─────────────────────── Static Data ─────────────────────── */

const SERVICES = [
  { name: "Nursing Staff at Home", emoji: "👩‍⚕️" },
  { name: "Male & Female Patient Attendants", emoji: "🤝" },
  { name: "Elderly Care at Home", emoji: "🧓" },
  { name: "Bedridden Patient Care", emoji: "🛏️" },
  { name: "Post-Hospitalisation Care", emoji: "🏥" },
  { name: "Physiotherapy at Home", emoji: "🏃‍♂️" },
  { name: "Injection Administration at Home", emoji: "💉" },
  { name: "IV Infusion at Home", emoji: "🩸" },
  { name: "Wound Dressing at Home", emoji: "🩹" },
  { name: "Bed Sore Dressing & Care", emoji: "🧴" },
  { name: "Catheter Insertion & Removal", emoji: "🩺" },
  { name: "Ryles Tube Insertion & Feeding Care", emoji: "🍼" },
  { name: "Tracheostomy Care", emoji: "🫁" },
  { name: "Oxygen Support at Home", emoji: "🌬️" },
  { name: "BP & Blood Sugar Monitoring", emoji: "📈" },
  { name: "Blood Sample Collection at Home", emoji: "🧪" },
  { name: "Medical Equipment Rental", emoji: "🦽" },
];

const EQUIPMENT = [
  { name: "Hospital Beds", emoji: "🛏️" },
  { name: "Wheelchairs", emoji: "🦽" },
  { name: "Oxygen Concentrators", emoji: "🌬️" },
  { name: "BiPAP & CPAP Machines", emoji: "🫁" },
  { name: "Suction Machines", emoji: "💨" },
  { name: "Other essential home-care equipment according to availability", emoji: "🩺" },
];

const LOCATIONS = ["Faridabad", "Gurugram", "Noida", "Delhi"];

/* ─────────────────────── Components ─────────────────────── */

function AboutPage() {
  const { data: settings } = useQuery(settingsQ());
  
  const phone = settings?.phone?.replace(/[^\d+]/g, "") || "919876543210";
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "") || "919876543210";

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
              <ShieldCheck className="h-4 w-4" fill="currentColor" /> HOME PAGE – ABOUT NUPUN
            </motion.div>

            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground"
            >
              Care That Comes Home
            </motion.h1>

            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 text-base md:text-lg text-foreground/80 max-w-lg leading-relaxed font-medium"
            >
              <p>
                Nupun Home Health Care Services provides reliable healthcare and personal care support at home for patients, elderly people and families. We help you arrange suitable care according to the patient's condition, care requirements and preferred duty hours.
              </p>
              <p>
                Our services are designed to make home healthcare more comfortable, convenient and dependable for families.
              </p>
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
            src={
              typeof settings?.about_hero_image === "string"
                ? settings.about_hero_image
                : settings?.about_hero_image?.url ||
                  "/assets/Get professional and compassionate elderly care at home in Ranchi (2)-Picsart-BackgroundRemover.jpeg"
            }
            alt="Care That Comes Home"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/50 to-transparent lg:w-48" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent lg:hidden" />
        </div>
      </div>

      {/* ── Services (Premium Glassmorphism Grid) ────────────────────────────────────────── */}
      <Section className="pt-16 pb-12 lg:pt-20 lg:pb-16 bg-[#f8f9fa] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="container-x relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
               initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
               className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-5 shadow-sm"
            >
              <ActivitySquare className="h-3.5 w-3.5" /> Comprehensive Care
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-4"
            >
              Our Home Healthcare Services
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground font-medium"
            >
              We provide a comprehensive range of home healthcare services, tailored to your needs.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                className="group relative flex items-center gap-4 rounded-2xl bg-white border border-border/60 p-4 md:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
              >
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-primary/10 group-hover:bg-primary transition-colors duration-400">
                  <span className="text-[28px] leading-none group-hover:scale-110 transition-transform">{s.emoji}</span>
                </div>
                <div className="font-semibold text-foreground leading-tight text-base tracking-wide">
                  {s.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Medical Equipment ─────────────────────────────────────── */}
      <Section className="pt-12 pb-16 lg:pt-16 lg:pb-20 bg-white relative overflow-hidden">
        <div className="container-x">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5">
              <motion.div
                 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                 className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-5 shadow-sm"
              >
                <BriefcaseMedical className="h-3.5 w-3.5" /> Rent Equipment
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-6 leading-tight"
              >
                Medical Equipment Available on Rental
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium"
              >
                We also provide medical equipment rental support to ensure the patient has everything they need for a comfortable recovery at home.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="hidden lg:block relative h-64 w-full rounded-[2rem] overflow-hidden border border-black/5 shadow-2xl group"
              >
                 <img src="/assets/services/equipment-rental.png" alt="Medical Equipment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => e.currentTarget.src = "/assets/equip.jpeg"} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                 <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-white font-semibold text-xl">High Quality Equipment</div>
                    <div className="text-white/80 text-sm mt-1 font-medium">Sanitized and well-maintained</div>
                 </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4">
                {EQUIPMENT.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group flex items-center gap-4 rounded-2xl bg-white border border-border/80 p-5 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] hover:border-primary/40 transition-all duration-300"
                  >
                    <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-sky-50 border border-sky-100 group-hover:bg-primary transition-colors duration-400">
                      <span className="text-2xl leading-none group-hover:scale-110 transition-transform">{item.emoji}</span>
                    </div>
                    <span className="text-foreground font-semibold leading-snug tracking-wide text-base flex-1">{item.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Flexible Care & Locations (Clean Light Mode) ───────────────────────────── */}
      <Section className="pt-10 pb-16 lg:pt-12 lg:pb-20 bg-white relative overflow-hidden">
        <div className="container-x relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Flexible Care */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2.5rem] bg-[#f8f9fa] border border-black/5 p-6 md:p-10 lg:p-14 shadow-sm group transition-all hover:shadow-md"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-8">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-6 tracking-tight">
                Flexible Care Options
              </h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-medium">
                Care staff can be arranged according to your requirement, including:
              </p>
              
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
                {["8 Hours", "12 Hours", "24 Hours"].map((opt) => (
                  <div key={opt} className="rounded-xl bg-white border border-black/5 px-4 py-2 sm:px-6 sm:py-3 text-foreground font-bold tracking-wide shadow-sm text-sm sm:text-base">
                    {opt}
                  </div>
                ))}
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                Male and female staff can be arranged depending on the patient's requirement and staff availability.
              </p>
            </motion.div>

            {/* Service Locations */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-[#f8f9fa] border border-black/5 p-6 md:p-10 lg:p-14 shadow-sm group transition-all hover:shadow-md"
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 mb-8">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-6 tracking-tight">
                Our Service Locations
              </h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-medium">
                Nupun Home Health Care Services provides home healthcare support across:
              </p>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6">
                {LOCATIONS.map((loc) => (
                  <div key={loc} className="flex items-center gap-2 sm:gap-3 rounded-xl bg-white border-l-2 border-primary border-y border-r border-black/5 p-3 sm:p-4 shadow-sm hover:border-l-4 transition-all duration-300">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-foreground font-bold tracking-wide text-sm sm:text-base">{loc}</span>
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                Our team helps families arrange suitable home healthcare support at their preferred location.
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ── Need Care CTA ──────────────────────────────────────────────── */}
      <Section className="pt-12 pb-24 lg:pt-16 lg:pb-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        {/* Dot pattern */}
        <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none" aria-hidden>
          <div style={{ backgroundImage: "radial-gradient(black 1px, transparent 1px)", backgroundSize: "32px 32px" }} className="w-full h-full" />
        </div>
        
        <div className="container-x max-w-5xl mx-auto text-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             whileInView={{ opacity: 1, scale: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="bg-white rounded-[3rem] border border-black/5 p-10 md:p-16 lg:p-20 shadow-[0_30px_80px_rgba(0,0,0,0.08)] relative"
          >
            {/* Top decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6 tracking-tight">
              Need Care at Home?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              Tell us about the patient's condition, location and care requirement. Our team will help you understand the suitable service and care option for your family.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/booking"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-bold text-background shadow-xl hover:bg-foreground/90 hover:-translate-y-0.5 transition-all duration-300"
              >
                Discover Our Services <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`tel:${phone}`}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 bg-primary/5 px-8 py-4 text-base font-bold text-primary hover:bg-primary hover:text-white hover:-translate-y-0.5 transition-all duration-300"
              >
                <Phone className="h-5 w-5" /> Call Now
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#25D366] bg-white pl-6 pr-2 py-2 text-base font-bold text-[#25D366] shadow-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="text-lg tracking-wide">WhatsApp</span>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
