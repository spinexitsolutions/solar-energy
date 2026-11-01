"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { SectionLabel } from "./Reveal";

const DURATION = 6500;

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setTimeout(() => setI((x) => (x + 1) % items.length), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, items.length]);
  const t = items[i];
  if (!t) return null;

  return (
    <section className="bg-paper-2/70 py-20 md:py-32" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container-x">
        <SectionLabel index="06">Customer stories</SectionLabel>
        <div className="mt-10 min-h-[340px] md:min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="h-5 w-5 fill-sun text-sun" />
                ))}
              </div>
              <p className="mt-6 max-w-5xl text-3xl font-medium leading-[1.15] tracking-[-0.035em] md:text-6xl">
                <span className="serif-i sun-text">“</span>
                {t.quote}
                <span className="serif-i sun-text">”</span>
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="h-14 w-14 rounded-full object-cover ring-4 ring-white" />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex gap-2 md:gap-3">
          {items.map((x, k) => (
            <button key={x.id} onClick={() => setI(k)} className="group flex-1 text-left" aria-label={`Show testimonial from ${x.name}`}>
              <div className="h-[3px] overflow-hidden rounded-full bg-ink/10">
                {k === i ? (
                  <motion.div
                    key={`${i}-${paused}`}
                    className="h-full sun-bg"
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? "0%" : "100%" }}
                    transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                  />
                ) : (
                  <div className={`h-full ${k < i ? "w-full bg-ink/30" : "w-0"}`} />
                )}
              </div>
              <p className={`mt-3 hidden text-sm transition md:block ${k === i ? "text-ink" : "text-muted group-hover:text-ink"}`}>{x.name}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
