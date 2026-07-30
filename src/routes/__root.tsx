import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { Toaster } from "../components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { settingsQ } from "../lib/api/queries";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-7xl">404</div>
        <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. You can try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nupun Home Health Care Services — Premium care, delivered home" },
      {
        name: "description",
        content:
          "Verified nurses, physiotherapists and premium medical equipment — booked in minutes, delivered to your door. Rated 5-star by families across the region.",
      },
      { property: "og:site_name", content: "Nupun Home Health Care" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#33C4C7" },
      {
        property: "og:title",
        content: "Nupun Home Health Care Services — Premium care, delivered home",
      },
      {
        name: "twitter:title",
        content: "Nupun Home Health Care Services — Premium care, delivered home",
      },
      {
        property: "og:description",
        content:
          "Verified nurses, physiotherapists and premium medical equipment — booked in minutes, delivered to your door. Rated 5-star by families across the region.",
      },
      {
        name: "twitter:description",
        content:
          "Verified nurses, physiotherapists and premium medical equipment — booked in minutes, delivered to your door. Rated 5-star by families across the region.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico?v=2", type: "image/x-icon" },
      { rel: "icon", href: "/favicon-32x32.png?v=2", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16x16.png?v=2", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png?v=2", sizes: "180x180" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          name: "Nupun Home Health Care Services",
          medicalSpecialty: ["Nursing", "Physiotherapy", "ElderCare"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ThemeInjector() {
  const { data: settings } = useQuery(settingsQ());

  if (!settings?.theme_primary && !settings?.theme_accent) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root {
        ${settings.theme_primary ? `--primary: ${settings.theme_primary}; --ring: ${settings.theme_primary};` : ""}
        ${settings.theme_accent ? `--accent: ${settings.theme_accent};` : ""}
      }`,
      }}
    />
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInjector />
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
