import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload, CheckCircle2, Loader2, FileText, Check, ChevronDown } from "lucide-react";
import { api } from "@/lib/api/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/careers/")({
  head: () => ({
    meta: [
      { title: "Careers — Join Nupun Home Health Care" },
      {
        name: "description",
        content: "Join Nupun Home Health Care Services and build your career in professional home healthcare.",
      },
      { property: "og:title", content: "Careers — Nupun Home Health Care" },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

function CareersPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    job_title: "Staff Nurse",
    preferred_location: "",
    qualification: "",
    experience: "",
    preferred_duty: "12 Hours",
    previous_employer: "",
    relevant_skills: "",
    certificates: "",
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.postForm("/careers/applications", data);
      return res; // apiFetch already extracts `data` payload if envelope is returned.
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit application. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, value);
    });
    
    if (resumeFile) {
      fd.append("resume", resumeFile);
    }

    mutate(fd);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 lg:pt-40 lg:pb-40 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/careers_hero_bg.jpg')" }} 
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container-x max-w-4xl text-center relative z-10">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white mb-6 drop-shadow-sm">
            Join Our Care Team
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-sm">
            Join Nupun Home Health Care Services and build your career in professional home healthcare.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-16 md:pb-24 bg-[#FAFAFA]">
        <div className="container-x max-w-4xl relative z-20 -mt-24 sm:-mt-32">
          {isSuccess ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5">
              <div className="mx-auto w-20 h-20 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-display font-semibold mb-4">Application Submitted!</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for applying to Nupun Home Health Care. Our team will review your details and get back to you shortly.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="rounded-full bg-primary px-8 py-3.5 font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/5">
              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* Step 1 */}
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-foreground mb-6 flex items-center gap-2">
                    1. Basic Information
                  </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Full Name *</label>
                    <input required name="full_name" value={formData.full_name} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Mobile Number *</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Enter mobile number" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Email Address *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Position Applying For</label>
                    <div className="relative">
                      <select name="job_title" value={formData.job_title} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none">
                      <option value="Staff Nurse">Staff Nurse</option>
                      <option value="GDA / Patient Attendant">GDA / Patient Attendant</option>
                      <option value="Physiotherapist">Physiotherapist</option>
                      <option value="Caregiver">Caregiver</option>
                      <option value="Other">Other</option>
                    </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Preferred Location</label>
                    <input name="preferred_location" value={formData.preferred_location} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. Gurgaon, Delhi" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Qualification</label>
                    <input name="qualification" value={formData.qualification} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. B.Sc Nursing, GNM, BPT" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Total Experience</label>
                    <div className="relative">
                      <select name="experience" value={formData.experience} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none">
                      <option value="" disabled>Select experience</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Preferred Duty</label>
                    <div className="relative">
                      <select name="preferred_duty" value={formData.preferred_duty} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none">
                      <option value="8 Hours">8 Hours</option>
                      <option value="12 Hours">12 Hours</option>
                      <option value="24 Hours">24 Hours</option>
                    </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-foreground">Upload Resume</label>
                    <div className="mt-2 flex justify-center rounded-xl border border-dashed border-input px-6 py-8">
                      <div className="text-center">
                        <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                          >
                            <span>{resumeFile ? resumeFile.name : "Click to upload a file"}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx" />
                          </label>
                          {!resumeFile && <p className="pl-1">or drag and drop</p>}
                        </div>
                        <p className="text-xs leading-5 text-muted-foreground mt-2">PDF, DOC up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
                </div>

                <div className="w-full h-px bg-border/50" />

                {/* Step 2 */}
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-foreground mb-6 flex items-center gap-2">
                    2. Professional Details
                  </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-foreground">Nursing/Physiotherapy qualification</label>
                    <input name="qualification" value={formData.qualification} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="e.g. B.Sc Nursing, GNM, BPT" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Total Experience</label>
                    <div className="relative">
                      <select name="experience" value={formData.experience} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none">
                      <option value="" disabled>Select experience</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Previous Employer</label>
                    <input name="previous_employer" value={formData.previous_employer} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="Enter previous hospital or agency" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-foreground">Relevant Skills</label>
                    <textarea name="relevant_skills" value={formData.relevant_skills} onChange={handleChange} rows={3} className="w-full p-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" placeholder="ICU Care, Post-operative care, etc." />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-foreground">Certificates (If applicable)</label>
                    <input name="certificates" value={formData.certificates} onChange={handleChange} className="w-full h-12 px-4 rounded-xl border border-input bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="List any relevant certificates" />
                  </div>
                </div>
                </div>

                <div className="w-full h-px bg-border/50" />

                {/* Step 3 */}
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-foreground mb-6 flex items-center gap-2">
                    3. Verification Candidate Shortlist
                  </h3>
                <p className="text-muted-foreground mb-6 font-medium">Please note that all shortlisted candidates will undergo the following verification process before joining:</p>
                <ul className="space-y-4">
                  {[
                    "Identity (ID) Verification",
                    "Qualification / Certificate Verification",
                    "Police / Background Verification"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground font-medium bg-secondary/30 p-4 rounded-xl border border-border/50">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-6">* Original documents will be required at the time of final onboarding.</p>
                </div>

                {/* Submit Button */}
                <div className="pt-8 pb-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full md:w-auto md:min-w-[300px] h-14 rounded-full bg-[#185e58] text-white font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70 shadow-sm"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application <Upload className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
