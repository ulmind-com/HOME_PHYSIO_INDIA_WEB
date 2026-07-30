import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

import { PremiumScrollReveal } from "./PremiumScrollReveal";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <PremiumScrollReveal>
      <section id={id} className={cn("py-20 lg:py-28", className)}>
        <div className="container-x">{children}</div>
      </section>
    </PremiumScrollReveal>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-12 max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground mb-4",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight">{title}</h2>
      {description && (
        <p className="mt-4 text-muted-foreground text-base md:text-lg">{description}</p>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-12 text-center">
      <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary-soft grid place-items-center">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
      </div>
      <div className="font-medium text-lg">{title}</div>
      {description && (
        <div className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">{description}</div>
      )}
    </div>
  );
}
