import type { Faq } from "@/lib/api/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <Accordion type="single" collapsible className="rounded-3xl border border-border bg-surface divide-y divide-border">
      {items.map((f) => (
        <AccordionItem key={f.id} value={f.id} className="border-0 px-6">
          <AccordionTrigger className="py-5 text-left font-medium text-base hover:no-underline">
            {f.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
            {f.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
