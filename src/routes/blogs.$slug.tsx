import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, User, Clock, CheckCircle2 } from "lucide-react";
import { blogBySlugQ } from "@/lib/api/queries";
import { Section } from "@/components/site/Section";
import { DUMMY_BLOGS } from "./blogs.index";

export const Route = createFileRoute("/blogs/$slug")({
  component: BlogDetailsPage,
});

function BlogDetailsPage() {
  const { slug } = Route.useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    ...blogBySlugQ(slug),
    retry: false,
  });

  // Fallback to dummy data if not found in API
  const dummyMatch = DUMMY_BLOGS.find((b) => b.slug === slug);
  const blog = data || dummyMatch;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError && !dummyMatch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA]">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">Blog not found</h1>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
        <Link
          to="/blogs"
          className="text-primary hover:underline flex items-center gap-2 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all blogs
        </Link>
      </div>
    );
  }

  if (!blog) return null;

  const imageUrl =
    typeof blog.featured_image === "string"
      ? blog.featured_image
      : blog.featured_image?.url || "/assets/hero-care.jpg";

  const date = blog.published_at || blog.created_at;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <main className="min-h-screen bg-white">
      {/* ── Details Hero (Full Width Image with Curve) ── */}
      <div className="relative w-full h-[50vh] md:h-[70vh] min-h-[400px]">
        <img
          src={imageUrl}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Curved SVG Mask at the bottom */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-none text-white">
          <svg
            className="relative block w-full h-[60px] md:h-[120px]"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path d="M0,100 C480,0 960,0 1440,100 Z" fill="currentColor" opacity="0.3"></path>
            <path d="M0,100 C480,20 960,20 1440,100 Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <Section className="py-8 lg:py-12">
        <div className="container-x max-w-4xl mx-auto">
          {/* Header info (Title and Meta) moved here for robust fallback */}
          <div className="mb-12 border-b border-black/5 pb-8">
            <h1 className="font-display text-3xl md:text-4xl lg:text-[44px] font-bold leading-[1.15] tracking-tight text-foreground mb-6">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium text-[14px]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </div>
              {blog.author_name && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {blog.author_name}
                </div>
              )}
              {blog.category_name && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                  {blog.category_name}
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 prose prose-lg prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-3xl max-w-none text-muted-foreground">
            {blog.content ? (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              // Dummy Content Fallback to demonstrate layout
              <>
                <p className="lead text-xl text-foreground font-medium">{blog.excerpt}</p>
                <p>
                  Recovering from a major health event or managing a chronic condition is
                  challenging for both the patient and their family. While hospitals provide
                  critical care during emergencies, the home environment often offers unmatched
                  comfort, familiarity, and emotional support during the recovery phase.
                </p>

                <h3 className="text-2xl text-foreground mt-10 mb-4">
                  Benefits of Choosing Home Care
                </h3>
                <p>
                  Choosing home care is not just about convenience; it's about holistic healing.
                  Being surrounded by loved ones, sleeping in a familiar bed, and eating home-cooked
                  meals can significantly accelerate recovery.
                </p>
                <div className="bg-primary/5 rounded-3xl p-8 my-8 border border-primary/10">
                  <ul className="space-y-4 list-none pl-0 m-0">
                    {[
                      "Recovery Feels More Comfortable at Home",
                      "Less Stress Helps Faster Healing",
                      "Personalized 1-on-1 Attention",
                      "Reduced Risk of Hospital Infections",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-foreground font-medium m-0"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="text-2xl text-foreground mt-10 mb-4">Conclusion</h3>
                <p>
                  Post-surgery recovery or elderly care becomes much easier when patients feel
                  comfortable, emotionally supported, and properly cared for. Home care services
                  help families create a safer and calmer recovery environment without losing access
                  to professional medical care.
                </p>

                {/* Dummy FAQ Section */}
                <div className="mt-16 pt-12 border-t border-black/5">
                  <h2 className="text-3xl text-foreground font-display font-bold mb-8">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        1. What is home health care?
                      </h4>
                      <p className="text-[15px] m-0">
                        It provides hospital-like critical care support at home with trained nurses,
                        equipment, monitoring, and medical supervision.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        2. Who needs it after surgery?
                      </h4>
                      <p className="text-[15px] m-0">
                        Patients recovering from major surgery, elderly patients, or those needing
                        close monitoring may need home ICU support.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-2">
                        3. Is it safe for post-surgery recovery?
                      </h4>
                      <p className="text-[15px] m-0">
                        Yes, when managed by trained professionals, home care can support safe
                        recovery with regular monitoring and assistance.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-16 pt-8 border-t border-black/5">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 font-bold text-[15px] text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
