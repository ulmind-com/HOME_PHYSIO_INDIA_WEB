export function LegalPage({
  updated,
  sections,
}: {
  updated: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        Last updated · {updated}
      </div>
      <div className="mt-8 space-y-8">
        {sections.map((s, i) => (
          <section key={s.title}>
            <h2 className="font-display text-2xl">
              {i + 1}. {s.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-foreground/85">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
