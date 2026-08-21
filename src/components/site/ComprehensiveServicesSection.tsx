import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "@/lib/api/queries";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { NursingBookingModal } from "@/components/forms/NursingBookingModal";
import { MotherBabyBookingModal } from "@/components/forms/MotherBabyBookingModal";
import { ElderCareBookingModal } from "@/components/forms/ElderCareBookingModal";
import { PhysioBookingModal } from "@/components/forms/PhysioBookingModal";
import { EquipmentBookingModal } from "@/components/forms/EquipmentBookingModal";
import { IcuBookingModal } from "@/components/forms/IcuBookingModal";
import { LabBookingModal } from "@/components/forms/LabBookingModal";

type ServiceCard = {
  id: string;
  title: string;
  image: string;
  features: string[];
  buttonText: string;
  buttonLink?: string;
  selectLabel: string;
  formOptions?: string[];
};

const SERVICES: ServiceCard[] = [
  {
    id: "infection",
    title: "I​nfection Control Nurse Services",
    image: "/assets/service_img_8_desktop.jpg",
    features: [
      "Infection Prevention & Control",
      "Hand Hygiene & PPE Practices",
      "Infection Control Training",
      "Audit & Monitoring",
      "Biomedical Waste Guidance",
      "Home Healthcare Infection Prevention",
    ],
    buttonText: "Learn More",
    buttonLink: "/infection-control-nurse",
    selectLabel: "Select infection-control service",
  },
  {
    id: "nursing",
    title: "Home Nursing Care",
    image: "/assets/services/nursing-care.png",
    features: [
      "Skilled Nursing Care at Home",
      "Injection & IV Drip Services",
      "Wound & Bed Sore Dressing",
      "Catheter Insertion & Care",
      "Ryles Tube Insertion & Feeding",
      "Tracheostomy Care",
      "Post-Hospitalization Care",
      "BP & Sugar Monitoring",
    ],
    buttonText: "Book Nursing Care",
    buttonLink: "/nursing-care",
    selectLabel: "Select nursing service",
    formOptions: [
      "Skilled Nursing Care at Home",
      "Injection & IV Drip Services",
      "Wound & Bed Sore Dressing",
      "Catheter Insertion & Care",
      "Ryles Tube Insertion & Feeding",
      "Tracheostomy Care",
      "Post-Hospitalization Care",
      "BP & Sugar Monitoring",
      "Others",
    ],
  },
  {
    id: "elderly",
    title: "Elderly Care",
    image: "/assets/services/elderly-care.png",
    features: [
      "8, 12 & 24 Hour Elderly Care",
      "Personal Hygiene & Sponging",
      "Diaper & Toileting Care",
      "Feeding & Medicine Assistance",
      "Walking & Mobility Support",
      "Bedridden Patient Care",
      "Companionship & Daily Support",
    ],
    formOptions: [
      "Elderly care",
      "Patient care",
      "Bedridden Care",
      "24 Hours attendant",
    ],
    buttonText: "Book Elderly Care",
    buttonLink: "/elderly-care",
    selectLabel: "Select elderly care service",
  },
  {
    id: "mother-baby",
    title: "Mother & Baby Care",
    image: "/assets/services/mother-baby-care.png",
    features: [
      "New Mother Care",
      "Baby Care & Assistance",
      "Mother Hygiene & Personal Care",
      "Feeding Support",
      "Postnatal Care Support",
      "Newborn Daily Care",
    ],
    buttonText: "Book Mother & Baby Care",
    selectLabel: "Select mother & baby care service",
    formOptions: [
      "New Mother Care",
      "Baby Care & Assistance",
      "Mother Hygiene & Personal Care",
      "Feeding Support",
      "Postnatal Care Support",
      "Newborn Daily Care",
      "Others",
    ],
  },
  {
    id: "physio",
    title: "Physiotherapy & Recovery",
    image: "/assets/services/physiotherapy.png",
    features: [
      "Physiotherapy at Home",
      "Post-Surgery Rehabilitation",
      "Stroke Rehabilitation",
      "Mobility & Walking Training",
      "Pain Management",
      "Senior Physiotherapy",
      "Exercise & Recovery Programs",
    ],
    buttonText: "Book Physiotherapy",
    buttonLink: "/physiotherapy",
    selectLabel: "Select physiotherapy service",
    formOptions: [
      "Physiotherapy at Home",
      "Post-Surgery Rehabilitation",
      "Stroke Rehabilitation",
      "Mobility & Walking Training",
      "Pain Management",
      "Senior Physiotherapy",
      "Exercise & Recovery Programs",
      "Others",
    ],
  },
  {
    id: "equipment",
    title: "Medical Equipment Rental",
    image: "/assets/services/equipment-rental.png",
    features: [
      "Hospital Beds",
      "Wheelchairs",
      "Oxygen Concentrators",
      "BiPAP & CPAP Machines",
      "Suction Machines",
      "Patient Care & Mobility Equipment",
    ],
    buttonText: "Rent Equipment",
    buttonLink: "/medical-equipment",
    selectLabel: "Select equipment type",
    formOptions: [
      "Hospital Beds",
      "Wheelchairs",
      "Oxygen Concentrators",
      "BiPAP & CPAP Machines",
      "Suction Machines",
      "Patient Care & Mobility Equipment",
      "Others",
    ],
  },
  {
    id: "icu",
    title: "ICU Setup at Home",
    image: "/assets/services/icu-setup.png",
    features: [
      "Home ICU Setup",
      "ICU Bed & Essential Equipment",
      "Oxygen Support",
      "Suction Support",
      "Monitoring Equipment",
      "Trained Nursing Support",
      "Critical Care Coordination",
    ],
    buttonText: "Book ICU Setup",
    selectLabel: "Select ICU service",
    formOptions: [
      "Home ICU Setup",
      "ICU Bed & Essential Equipment",
      "Oxygen Support",
      "Suction Support",
      "Monitoring Equipment",
      "Trained Nursing Support",
      "Critical Care Coordination",
      "Others",
    ],
  },
  {
    id: "sample",
    title: "Home Sample Collection",
    image: "/assets/services/home-sample.png",
    features: [
      "Blood Sample Collection",
      "Urine Sample Collection",
      "Other Routine Diagnostic Samples",
      "Home Collection Service",
      "Safe Sample Handling & Lab Coordination",
    ],
    buttonText: "Book Sample Collection",
    selectLabel: "Select sample collection service",
    formOptions: [
      "Blood Sample Collection",
      "Urine Sample Collection",
      "Other Routine Diagnostic Samples",
      "Home Collection Service",
      "Safe Sample Handling & Lab Coordination",
      "Others",
    ],
  },
];

const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ComprehensiveServicesSection() {
  const { data: settings } = useQuery(settingsQ());

  const activeServices: ServiceCard[] = settings?.comprehensive_services?.length
    ? settings.comprehensive_services
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((s: any) => ({
          id: s.id || "",
          title: s.title || "",
          image: typeof s.image === "string" ? s.image : s.image?.url || "",
          features: s.features || [],
          buttonText: s.button_text || "",
          buttonLink: s.button_link || "",
          selectLabel: s.select_label || s.form_dropdown_label || "",
          formOptions: s.form_options || s.features || [],
        }))
    : SERVICES;

  return (
    <section className="relative w-full bg-background pt-10 pb-20 md:pt-16 md:pb-28 lg:pt-16 lg:pb-32 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-1/3 -right-32 h-96 w-96 rounded-full bg-accent/5 blur-[100px]" />
        <div
          className="absolute left-[5%] bottom-[10%] h-40 w-40 opacity-20 text-primary"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
      </div>

      <div className="container-x relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            What We Provide
          </div>
          <h2 className="relative inline-block font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
            Our Comprehensive Services
            <svg
              className="absolute -bottom-3 left-1/2 h-3 w-56 -translate-x-1/2 text-primary opacity-90"
              viewBox="0 0 220 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 8 Q 55 -2, 110 6 T 218 4"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </h2>
          <p className="mt-8 text-base md:text-lg leading-relaxed text-muted-foreground font-normal">
            Specialized care verticals designed around your family's needs — combining hospital-grade precision with compassionate, attentive home care.
          </p>
        </motion.div>

        {/* 7 Service Cards Grid */}
        <motion.div
          variants={cardStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7 max-w-[1400px] mx-auto"
        >
          {activeServices.map((service) => (
            <motion.article
              key={service.id}
              variants={cardItem}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-border/80 bg-surface/95 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] hover:border-primary/40"
            >
              {/* Image Header */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Title on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-xl md:text-[1.35rem] font-semibold leading-tight text-white drop-shadow-md">
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Card Body — Features List */}
              <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                <ul className="space-y-2">
                  {service.features.map((feat, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2.5 text-[13px] font-medium text-foreground/85">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-5 pt-4 border-t border-border/50">
                  {(() => {
                    const btnContent = (
                      <button className="group/btn w-full relative overflow-hidden rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-md">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {service.buttonText}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-[800ms] ease-out group-hover/btn:translate-x-full" />
                      </button>
                    );

                    if (service.buttonLink && (service.id === "infection" || service.buttonText === "Learn More")) {
                      return (
                        <Link to={service.buttonLink as any} className="block">
                          {btnContent}
                        </Link>
                      );
                    }
                    if (service.id === "mother-baby") {
                      return <MotherBabyBookingModal>{btnContent}</MotherBabyBookingModal>;
                    }
                    if (service.id === "elderly") {
                      return <ElderCareBookingModal>{btnContent}</ElderCareBookingModal>;
                    }
                    if (service.id === "physio") {
                      return <PhysioBookingModal>{btnContent}</PhysioBookingModal>;
                    }
                    if (service.id === "equipment") {
                      return <EquipmentBookingModal>{btnContent}</EquipmentBookingModal>;
                    }
                    if (service.id === "icu") {
                      return <IcuBookingModal>{btnContent}</IcuBookingModal>;
                    }
                    if (service.id === "sample") {
                      return <LabBookingModal>{btnContent}</LabBookingModal>;
                    }
                    return (
                      <NursingBookingModal 
                        defaultService=""
                        modalTitle={`Book ${service.title}`}
                        modalDescription="Fill out the details and our team will reach out within minutes."
                        serviceOptions={service.formOptions || service.features}
                        selectPlaceholder={service.selectLabel}
                        source="Comprehensive"
                      >
                        {btnContent}
                      </NursingBookingModal>
                    );
                  })()}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
