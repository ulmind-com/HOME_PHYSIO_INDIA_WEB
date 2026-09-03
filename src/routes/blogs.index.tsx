import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Calendar, BookOpen } from "lucide-react";
import { blogsQ } from "@/lib/api/queries";
import { type Blog } from "@/lib/api/types";
import { Section } from "@/components/site/Section";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blogs/")({
  component: BlogsPage,
});

/** Derived from whatever the admin panel has actually published. */
const ALL = "All Blogs";

function BlogsPage() {
  const { data } = useQuery(blogsQ({ limit: 50 }));
  const [activeCategory, setActiveCategory] = useState(ALL);

  // Everything on this page is admin-published; there is no hardcoded content.
  const blogs = data?.items ?? [];

  // Category chips come from the published posts themselves, so the filter can
  // never offer a category the admin panel has nothing under.
  const CATEGORIES = [
    ALL,
    ...Array.from(
      new Set(blogs.map((b) => b.category_name).filter(Boolean) as string[]),
    ),
  ];

  const filteredBlogs =
    activeCategory === ALL
      ? blogs
      : blogs.filter((b) => b.category_name === activeCategory);

  return (
    <main className="min-h-screen bg-[#F8F9FA] relative flex flex-col">
      {/* ── Custom Split Hero (Matched with About Page) ── */}
      <div className="relative isolate overflow-hidden bg-[#fafafa]">
        {/* Subtle background blob */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full opacity-30 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />

        <div className="container-x pt-24 pb-6 md:pb-8 lg:pt-28 lg:pb-10 grid lg:grid-cols-12 gap-6 lg:gap-6 items-center min-h-[320px] md:min-h-[450px]">
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-6 lg:pr-6 z-10 relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-primary">
              <BookOpen className="h-4 w-4" fill="currentColor" /> Knowledge & Insights
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground">
              Our{" "}
              <span className="text-primary relative whitespace-nowrap">
                Blogs
                <svg
                  className="absolute -bottom-1 left-0 w-full h-3 text-accent/30 -z-10"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0 10 Q50 0 100 10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-lg text-foreground/80 max-w-lg leading-relaxed font-medium">
              Compassionate stories for a healthier life. Discover insights, tips, and the latest
              news in home health care.
            </p>
          </div>
        </div>

        {/* Right Image (Absolute positioning exactly like About page) */}
        <div className="relative h-[250px] md:h-[400px] w-full lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[45%] xl:w-[50%] -z-10">
          <img
            src="/assets/hero-doctors-team.png"
            alt="Our Blogs"
            className="w-full h-full object-cover object-top"
          />
          {/* Fade mask for smooth blending into the background color */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-[#fafafa]/50 to-transparent lg:w-48" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent lg:hidden" />
        </div>
      </div>

      <Section className="py-8 md:py-12 lg:py-16">
        {/* ── Filter Pills ── */}
        <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12 border-b border-black/5 pb-6 md:pb-8 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[13px] md:text-[14px] font-bold transition-all duration-300 whitespace-nowrap shrink-0",
                activeCategory === cat
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white border border-black/10 text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Blog Grid ── */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 text-muted-foreground font-medium text-lg">
            No blogs found for this category.
          </div>
        )}
      </Section>
    </main>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  const imageUrl =
    typeof blog.featured_image === "string"
      ? blog.featured_image
      : blog.featured_image?.url || "/assets/hero-care.jpg";

  const date = blog.published_at || blog.created_at;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Link
      to="/blogs/$slug"
      params={{ slug: blog.slug || "" }}
      className="group flex flex-col bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border border-black/5 hover:border-primary/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative h-[180px] md:h-[240px] w-full overflow-hidden rounded-t-[24px] md:rounded-t-[32px] rounded-br-[60px] md:rounded-br-[80px]">
        <img
          src={imageUrl}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {blog.category_name && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[12px] font-bold text-primary shadow-sm">
            {blog.category_name}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-8">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          {formattedDate}
        </div>

        <h3 className="font-display text-lg md:text-[22px] font-bold text-foreground leading-tight mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-[13px] md:text-[15px] text-muted-foreground leading-relaxed line-clamp-3 mb-4 md:mb-6 font-medium">
          {blog.excerpt || "Read more about this topic in our detailed article."}
        </p>

        <div className="mt-auto flex items-center text-[13px] font-bold uppercase tracking-widest text-primary">
          Read Story{" "}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
