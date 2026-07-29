import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, MessageCircle, Star, ShieldCheck, Clock } from "lucide-react";
import { toast } from "sonner";
import { servicesQ, reviewSummaryQ, settingsQ } from "@/lib/api/queries";
import { api } from "@/lib/api/client";
import heroCare from "@/assets/hero-care.jpg.asset.json";

export function Hero() {
  const navigate = useNavigate();
  const { data: servicesData } = useQuery(servicesQ({ limit: 30 }));
  const { data: reviews } = useQuery(reviewSummaryQ());
  const { data: settings } = useQuery(settingsQ());
  const services = servicesData?.items ?? [];

  const rating = reviews?.average_rating ?? 4.9;
  const phoneRaw = settings?.phone?.replace(/[^\d+]/g, "");
  const waRaw = (settings?.whatsapp || settings?.phone || "").replace(/[^\d]/g, "");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [done, setDone] = useState(false);

  const mut = useMutation({
    mutationFn: () =>
      api.post("/contact", {
        name,
        email: `${(name || "lead").toLowerCase().replace(/\s+/g, ".")}@lead.nupun`,
        phone: mobile,
        subject: `Consultation request — ${serviceName || "General"}`,
        message: `Name: ${name}\nMobile: ${mobile}\nService: ${serviceName || "—"}\nCity: ${city || "—"}\nArea: ${area || "—"}`,
      }),
    onSuccess: () => {
      setDone(true);
      toast.success("Our expert will call you within 10 minutes.");
    },
    onError: (e: Error) => toast.error(e.message || "Could not submit. Please try again."),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Please enter your name");
    if (mobile.replace(/\D/g, "").length < 7) return toast.error("Enter a valid mobile number");
    mut.mutate();
  }

  return (
    <section className="relative isolate overflow-hidden min-h-[100svh] w-full">
      {/* Full-bleed background image */}
      <img
        src={heroCare.url}
        alt="Compassionate home healthcare — nurse with elderly patient"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Warm readability overlays */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,20,20,0.55) 0%, rgba(10,20,20,0.35) 40%, rgba(10,20,20,0.15) 65%, rgba(10,20,20,0) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 30%, rgba(0,0,0,0.35) 100%)" }}
      />

      <div className="relative container-x pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-[100svh] flex items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-12">
          {/* LEFT — headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 text-white"
          >
            <h1 className="font-display text-[clamp(2.4rem,5.6vw,5rem)] font-bold leading-[1.02] tracking-[-0.02em] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]">
              Trusted Home Healthcare
              <br />
              Services at your door.
            </h1>
            <p className="mt-5 font-display text-2xl md:text-3xl italic text-primary drop-shadow">
              Hospital-grade care with a human touch.
            </p>
            <p className="mt-5 max-w-xl text-base md:text-lg text-white/85 leading-relaxed">
              Get expert nursing care, elder care, and patient attendants at home with
              verified professionals.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-primary text-primary" /> {rating.toFixed(1)}/5 Rated
              </span>
              <span className="opacity-40">|</span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-primary" /> Certified Staff
              </span>
              <span className="opacity-40">|</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> 24/7 Available
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate({ to: "/booking" })}
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[var(--shadow-float)] hover:bg-foreground transition-colors"
              >
                Book Trusted Care
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
              {waRaw && (
                <a
                  href={`https://wa.me/${waRaw}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-6 py-4 text-sm font-semibold text-foreground hover:bg-white transition-colors"
                >
                  WhatsApp
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#25D366] text-white">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                </a>
              )}
            </div>
          </motion.div>

          {/* RIGHT — consultation card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-6 md:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] ring-1 ring-white/60">
              {done ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                  <h3 className="mt-4 font-display text-2xl font-semibold text-foreground">Thank you!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Our care expert will call you within 10 minutes.
                  </p>
                  <button
                    onClick={() => setDone(false)}
                    className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-medium"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-accent">
                      Get Free Consultation
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Our expert will call you within 10 minutes
                    </p>
                  </div>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className={inputCls}
                  />
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Mobile Number"
                    inputMode="tel"
                    className={inputCls}
                  />
                  <select
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select Needed Service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className={inputCls}
                    />
                    <input
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Search Area"
                      className={inputCls}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={mut.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-semibold text-white shadow-[var(--shadow-float)] hover:bg-foreground transition-colors disabled:opacity-60"
                  >
                    {mut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Get Expert Guidance
                  </button>
                  {phoneRaw && (
                    <p className="text-center text-xs text-muted-foreground">
                      or call{" "}
                      <a href={`tel:${phoneRaw}`} className="font-semibold text-accent hover:underline">
                        {settings?.phone}
                      </a>
                    </p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-border/80 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20";
