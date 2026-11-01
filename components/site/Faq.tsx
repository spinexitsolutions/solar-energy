"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Faq as FaqT } from "@/lib/types";
import { SectionLabel, SplitReveal } from "./Reveal";

export default function Faq({ faqs }: { faqs: FaqT[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-x grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:py-32">
      <div className="md:sticky md:top-32 md:self-start">
        <SectionLabel index="07">FAQ</SectionLabel>
        <h2 className="display mt-6 text-[3.6rem] md:text-[6.5rem]">
          <SplitReveal text="Questions," />
          <br />
          <SplitReveal text="answered." delay={0.1} wordClassName={() => "sun-text"} />
        </h2>
        <p className="mt-5 max-w-sm text-muted">Can’t find what you’re looking for? Our solar advisors reply within minutes on WhatsApp.</p>
      </div>
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((f, i) => {
          const on = open === i;
          return (
            <div key={i}>
              <button onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={on}>
                <span className="text-lg font-medium tracking-[-0.02em] md:text-2xl">{f.q}</span>
                <motion.span
                  animate={{ rotate: on ? 135 : 0, backgroundColor: on ? "var(--accent)" : "rgba(12,12,13,0.06)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${on ? "text-white" : ""}`}
                >
                  <Plus className="h-4 w-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-6 pr-12 text-[16px] leading-relaxed text-muted md:text-lg">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
