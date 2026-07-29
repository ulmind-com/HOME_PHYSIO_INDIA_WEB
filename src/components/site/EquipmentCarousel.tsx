import * as React from "react";
import { motion } from "framer-motion";

const ITEMS = [
  { src: "/assets/equipment/ultrasound.jpeg", title: "Siemens X700 Ultrasound", alt: "Siemens X700 ultrasound system" },
  { src: "/assets/equipment/monitoring-1.jpeg", title: "At-Home Health Monitoring", alt: "Home BP, glucose and pulse oximeter kit" },
  { src: "/assets/equipment/anesthesiology.jpeg", title: "Anesthesiology Equipment", alt: "Hospital anesthesiology station" },
  { src: "/assets/equipment/monitoring-2.jpeg", title: "Vitals Testing Kit", alt: "Home vitals and testing kit" },
  { src: "/assets/equipment/stethoscope.jpeg", title: "Clinical Stethoscope", alt: "Professional clinical stethoscope" },
];

export function EquipmentCarousel() {
  // Duplicate items enough times to fill the screen twice for seamless infinite scroll
  const duplicatedItems = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden py-4 -mx-4 lg:-mx-10 w-[calc(100%+2rem)] lg:w-[calc(100%+5rem)]">
      {/* Edge gradient masks for smooth fade in/out effect */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
      
      <motion.div
        className="flex gap-6 w-max"
        animate={{ x: ["0%", "-33.333333%"] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
      >
        {duplicatedItems.map((item, idx) => (
          <div 
            key={idx} 
            className="relative group w-[280px] sm:w-[360px] aspect-[4/3] rounded-3xl overflow-hidden shrink-0 shadow-lg"
          >
            <img 
              src={item.src} 
              alt={item.alt} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <h4 className="text-white font-display text-lg sm:text-xl font-bold tracking-tight">{item.title}</h4>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
