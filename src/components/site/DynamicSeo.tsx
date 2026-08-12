import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { seoQ } from "@/lib/api/queries";

/**
 * Maps a pathname to a SEO page_key.
 * e.g. "/" → "home", "/about" → "about", "/services" → "services"
 */
function pathnameToPageKey(pathname: string): string {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean === "/") return "home";
  // Take first segment: "/about" → "about", "/blogs/some-slug" → "blogs"
  const segment = clean.split("/").filter(Boolean)[0];
  return segment || "global";
}

/**
 * DynamicSeo — fetches SEO settings from the admin panel API
 * and injects them into the document <head> at runtime.
 *
 * If the admin has set SEO for this page_key, those values override
 * the route-level static defaults. Otherwise nothing changes.
 */
export function DynamicSeo() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pageKey = pathnameToPageKey(pathname);

  // Also fetch "global" SEO as fallback
  const { data: pageSeo } = useQuery(seoQ(pageKey));
  const { data: globalSeo } = useQuery(seoQ("global"));

  // Merge: page-level overrides global
  const seo = pageSeo || globalSeo;

  useEffect(() => {
    if (!seo) return;

    // -- Title --
    if (seo.meta_title) {
      document.title = seo.meta_title;
      // Also update og:title and twitter:title
      setMetaTag("property", "og:title", seo.meta_title);
      setMetaTag("name", "twitter:title", seo.meta_title);
    }

    // -- Description --
    if (seo.meta_description) {
      setMetaTag("name", "description", seo.meta_description);
      setMetaTag("property", "og:description", seo.meta_description);
      setMetaTag("name", "twitter:description", seo.meta_description);
    }

    // -- Keywords --
    if (seo.meta_keywords?.length) {
      setMetaTag("name", "keywords", seo.meta_keywords.join(", "));
    }

    // -- Canonical --
    if (seo.canonical_url) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = seo.canonical_url;
    }

    // -- OG Image --
    if (seo.og_image) {
      setMetaTag("property", "og:image", seo.og_image);
      setMetaTag("name", "twitter:image", seo.og_image);
    }

    // -- Schema Markup (JSON-LD) --
    if (seo.schema_markup) {
      const existingScript = document.querySelector('script[data-dynamic-seo="true"]');
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-dynamic-seo", "true");
      script.textContent =
        typeof seo.schema_markup === "string"
          ? seo.schema_markup
          : JSON.stringify(seo.schema_markup);
      document.head.appendChild(script);
    }
  }, [seo]);

  return null; // This is a side-effect only component
}

/* ---------- Helper ---------- */

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}
