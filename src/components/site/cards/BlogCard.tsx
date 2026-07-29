import { Link } from "@tanstack/react-router";
import type { Blog } from "@/lib/api/types";
import { imgUrl } from "@/lib/utils";

export function BlogCard({ blog }: { blog: Blog }) {
  const date = blog.published_at ?? blog.created_at;
  const cover = imgUrl(blog.featured_image);
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: blog.slug }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface hover-glow hover:border-primary/60"
    >
      <div className="aspect-[16/10] overflow-hidden bg-primary-soft">
        {cover ? (
          <img
            src={cover}
            alt={blog.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-primary/70 font-display text-4xl">Nupun</div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        {blog.category_name && (
          <div className="text-xs uppercase tracking-[0.18em] text-accent">{blog.category_name}</div>
        )}
        <h3 className="mt-2 font-display text-xl leading-snug line-clamp-2">{blog.title}</h3>
        {blog.excerpt && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
        )}
        <div className="mt-auto pt-5 flex items-center gap-3 text-xs text-muted-foreground">
          {blog.author_name && <span>{blog.author_name}</span>}
          {date && <span>· {new Date(date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>}
          {blog.read_time && <span>· {blog.read_time} min read</span>}
        </div>
      </div>
    </Link>
  );
}
