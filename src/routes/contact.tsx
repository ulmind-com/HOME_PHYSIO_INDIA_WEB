import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapPin, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Nupun Home Health Care" },
      { name: "description", content: "Talk to a care advisor. We respond within 2 hours." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useQuery(settingsQ());
  const phone = settings?.phone?.replace(/[^\d+]/g, "");
  const whatsapp = (settings?.whatsapp ?? settings?.phone)?.replace(/\D/g, "");

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative flex flex-col">
      {/* ── Hero Background ────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] min-h-[500px] z-0">
        <div className="absolute inset-0 bg-dark" /> {/* Dark Theme Base */}
        <img 
          src="/assets/hero-slide-1.jpeg" 
          alt="Contact Hero" 
          className="w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-transparent to-[#F8F9FA]" />
      </div>

      <div className="relative z-10 flex flex-col items-center pt-32 pb-24 px-4 w-full flex-1">
        
        {/* Header Text */}
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl text-white mb-4 drop-shadow-md">
            Contact us
          </h1>
          <p className="text-[17px] text-white/90 leading-relaxed font-medium">
            Nupun is ready to provide the right solution according to your needs
          </p>
        </div>

        {/* Liquid Glass Container */}
        <div className="w-full max-w-[1100px] bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.6)] overflow-hidden flex flex-col md:flex-row mb-16">
          
          {/* Left Column: Info */}
          <div className="w-full md:w-[42%] p-8 md:p-12 lg:p-14 flex flex-col justify-between relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-[32px] text-foreground leading-tight mb-3">
                Get in touch
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-10">
                Sociosqu viverra lectus placerat sem efficitur molestie vehicula cubilia leo etiam nam.
              </p>

              <div className="space-y-8">
                <InfoRow 
                  icon={MapPin} 
                  title="Head Office" 
                  desc={settings?.address || "Jalan Cempaka Wangi No 22\nJakarta - Indonesia"} 
                />
                <InfoRow 
                  icon={Mail} 
                  title="Email Us" 
                  desc={settings?.email || "support@yourdomain.tld\nhello@yourdomain.tld"} 
                />
                <InfoRow 
                  icon={Phone} 
                  title="Call Us" 
                  desc={settings?.phone || "Phone : +6221.2002.2012\nFax : +6221.2002.2013"} 
                />
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="w-full md:w-[58%] bg-white p-8 md:p-12 lg:p-14 relative z-10 rounded-l-none md:rounded-l-[32px] shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
            <h2 className="text-[32px] text-foreground leading-tight mb-8">
              Send us a message
            </h2>
            <ContactForm />
          </div>
        </div>

      </div>

      {/* Full Width Map */}
      <div className="w-full h-[450px] relative z-10 border-t border-border">
        {settings?.google_map_embed ? (
          <div
            className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-none"
            dangerouslySetInnerHTML={{ __html: settings.google_map_embed }}
          />
        ) : (
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15655383.18970965!2d70.47219958042456!3d22.684179361664426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            className="w-full h-full border-none" 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>

    </main>
  );
}

function InfoRow({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
        <Icon className="w-[22px] h-[22px]" strokeWidth={2} />
      </div>
      <div>
        <div className="font-semibold text-[16px] text-foreground mb-1">{title}</div>
        <p className="text-[14px] text-muted-foreground whitespace-pre-line leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
