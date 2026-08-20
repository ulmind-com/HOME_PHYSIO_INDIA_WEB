import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "./Section";

const TABS = ["Health Attendant", "Physiotherapist", "Nurse", "Nanny", "Japa"];

const STAFF_DATA = [
  {
    id: 1,
    name: "Jyoti",
    role: "Nurse",
    rating: 5,
    image: "https://images.unsplash.com/photo-1594824436998-d822246ac6d9?q=80&w=300&auto=format&fit=crop",
    days: ["7 Days", "15 Days", "30 Days"],
  },
  {
    id: 2,
    name: "Shanti",
    role: "Nurse",
    rating: 5,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    days: ["7 Days", "15 Days", "30 Days"],
  },
  {
    id: 3,
    name: "Sunita Devi",
    role: "Health Attendant",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    days: ["7 Days", "15 Days", "30 Days"],
  },
  {
    id: 4,
    name: "Rahul",
    role: "Physiotherapist",
    rating: 5,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
    days: ["7 Days", "15 Days", "30 Days"],
  },
];

export function StaffSection() {
  const [activeTab, setActiveTab] = useState("Nurse");

  const filteredStaff = STAFF_DATA.filter((s) => s.role === activeTab);

  return (
    <Section className="bg-white py-12 md:py-16">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl md:text-4xl text-slate-800 font-medium">Our Staff</h2>
      </div>

      {/* Tabs - Scrollable horizontally on mobile */}
      <div className="relative mb-8">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
          <div className="flex px-4 md:px-0 mx-auto w-max min-w-full md:min-w-0 md:justify-center">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-3 text-[15px] font-medium transition-colors relative ${
                  activeTab === tab ? "text-[#F97316]" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeStaffTab"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#F97316]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0 max-w-5xl mx-auto">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((staff) => (
            <div key={staff.id} className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col items-center p-3 pb-5 transition-transform hover:-translate-y-1">
              <div className="w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 mb-4">
                <img src={staff.image} alt={staff.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium text-slate-800 text-[15px] mb-1">{staff.name}</h3>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-1">{staff.rating}</span>
              </div>
              
              <div className="flex gap-2 justify-center w-full">
                {staff.days.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-[#F97316] font-bold text-sm leading-none">{day.split(' ')[0]}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide mt-0.5">{day.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-slate-500">
            No staff profiles available for this category yet.
          </div>
        )}
      </div>
    </Section>
  );
}
