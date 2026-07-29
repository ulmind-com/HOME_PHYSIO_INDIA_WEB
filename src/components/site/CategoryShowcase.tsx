import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, HeartPulse, Stethoscope, Activity, Thermometer, Syringe, Baby, Pill } from "lucide-react";
import type { Service } from "@/lib/api/types";

const fallbackCategories = [
  {
    title: "Home Nursing Care",
    description: "24/7 nursing support at home by qualified professionals.",
    icon: Stethoscope,
    color: "from-primary/30 to-accent/20",
  },
  {
    title: "Elder Care",
    description: "Compassionate assistance for seniors with daily activities.",
    icon: HeartPulse,
    color: "from-accent/30 to-primary/20",
  },
  {
    title: "Physiotherapy",
    description: "Rehabilitation and pain management in the comfort of home.",
    icon: Activity,
    color: "from-primary/30 to-accent/20",
  },
  {
    title: "Post-Surgery Care",
    description: "Recovery support, wound care and medication management.",
    icon: Syringe,
    color: "from-accent/30 to-primary/20",
  },
];

const iconMap: Record<string, React.ElementType> = {
  "Home Nursing Care": Stethoscope,
  "Elder Care": HeartPulse,
  Physiotherapy: Activity,
  "Post-Surgery Care": Syringe,
  "ICU Setup at Home": Thermometer,
  "Medical Equipment": Pill,
  "Newborn & Mother Care": Baby,
};

export function CategoryShowcase({ services }: { services: Service[] }) {
  // Build a premium 4-card grid: real services first, then fallback placeholders.
  const realItems = services.slice(0, 6).map((s, i) => ({
    title: s.title,
    description: s.short_description || "Professional care tailored to your needs.",
    image: s.featured_image,
    icon: iconMap[s.title] || fallbackCategories[i % fallbackCategories.length].icon,
    slug: s.slug,
    color: fallbackCategories[i % fallbackCategories.length].color,
  }));

  const fallbackItems = fallbackCategories
    .filter((c) => !realItems.some((r) => r.title === c.title))
    .slice(0, Math.max(0, 4 - realItems.length))
    .map((c, i) => ({ ...c, image: null, slug: "", color: fallbackCategories[(realItems.length + i) % fallbackCategories.length].color }));

  const items = [...realItems, ...fallbackItems].slice(0, 4);

  return (
    <div className="relative z-10 container-x pb-24 lg:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
          What we offer
        </div>
        <h3 className="font-display text-3xl tracking-tight md:text-4xl lg:text-5xl">Our Categories</h3>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Explore our specialized care categories, designed to meet the unique needs of your family at every stage.
        </p>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {item.slug ? (
              <Link
                to="/services/$slug"
                params={{ slug: item.slug }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_30px_70px_-30px_color-mix(in_oklab,var(--primary)_30%,transparent)]"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-display text-xl tracking-tight">{item.title}</h4>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                    Learn more
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            ) : (
              <div className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_30px_70px_-30px_color-mix(in_oklab,var(--primary)_30%,transparent)]">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-display text-xl tracking-tight">{item.title}</h4>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
