"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import type { Hero as HeroT, Project } from "@/lib/types";
import { useIntroDone } from "../Intro";
import { GhostCta, Mask, PrimaryCta, ease, soft, useReveal } from "./shared";

const DURATION = 6;

/** Dark cinematic hero: real projects play like stories, each with its own data card. */
export default function HeroStories({ hero, projects }: { hero: HeroT; projects: Project[] }) {
  const done = useIntroDone();
  const reveal = useReveal();
  const slides = projects.slice(0, 4);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (n: number) => setI((n + slides.length) % slides.length);

  useEffect(() => {
    if (!done || paused || slides.length < 2) return;
    const t = setTimeout(() => go(i + 1), DURATION * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, done, paused, slides.length]);

  const s = slides[i];
  if (!s) return null;

  return (
    <section
      data-nav="dark"
      className="relative h-[100svh] min-h-[680px] overflow-hidden bg-night text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={s.id}
          className="absolute inset-0"
          initial={{ clipPath: "inset(0 0 0 100%)" }}
          animate={{ clipPath: "inset(0 0 0 0%)" }}
          exit={{ opacity: 0.6, transition: { duration: 1.2 } }}
          transition={{ duration: 1.3, ease }}
        >
          <motion.img
            src={s.image}
            alt={s.title}
            className="h-full w-full object-cover"
            initial={{ scale: 1.25 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: DURATION + 1.5, ease: "linear" }}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* vertical side rail */}
      <div className="absolute bottom-40 right-4 top-24 hidden flex-col items-center justify-between md:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 [writing-mode:vertical-rl]">Selected projects · 2024—2026</span>
        <div className="flex flex-col gap-2">
          <button onClick={() => go(i - 1)} aria-label="Previous project" className="grid h-11 w-11 place-items-center border border-white/30 transition hover:bg-white hover:text-ink"><ArrowLeft className="h-4 w-4" /></button>
          <button onClick={() => go(i + 1)} aria-label="Next project" className="grid h-11 w-11 place-items-center border border-white/30 transition hover:bg-white hover:text-ink"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="relative flex h-full flex-col px-4 pb-6 pt-20 md:px-8 md:pb-8 md:pr-24 md:pt-24">
        <motion.div {...reveal(0.3, -10)} className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-white/70">
          <span><span className="text-[var(--accent)]">[N°01]</span> {hero.eyebrow}</span>
        </motion.div>

        <div className="mt-auto grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="display text-[5.5rem] leading-none text-transparent [-webkit-text-stroke:1.5px_white] md:text-[8rem]">
                <AnimatePresence mode="wait">
                  <motion.span key={i} className="inline-block" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.6, ease: soft }}>
                    0{i + 1}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="display-n text-2xl text-white/45">/ 0{slides.length}</span>
            </div>
            <h1 className="display text-[clamp(3.4rem,min(13vw,13vh),9rem)]">
              <Mask delay={0.1}>{hero.titleLine1}</Mask>
              <Mask delay={0.2}>
                {hero.titleLine2} <span className="text-[var(--accent)]">{hero.highlight}</span>
              </Mask>
            </h1>
            <motion.div {...reveal(0.8)} className="mt-6 flex flex-wrap gap-2">
              <PrimaryCta>{hero.ctaPrimary}</PrimaryCta>
              <GhostCta dark>{hero.ctaSecondary}</GhostCta>
            </motion.div>
          </div>

          {/* project data card */}
          <div className="md:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.7, ease: soft }}
                className="border border-white/20 bg-black/35 backdrop-blur-md"
              >
                <div className="flex items-center justify-between border-b border-white/15 px-5 py-3">
                  <span className="display-n text-2xl">{s.title}</span>
                  <span className="text-[10.5px] uppercase tracking-[0.14em] text-[var(--accent)]">{s.category}</span>
                </div>
                <div className="grid grid-cols-3">
                  {[
                    ["Capacity", s.capacity],
                    ["Savings", s.savings],
                    ["Year", s.year],
                  ].map(([k, v], n) => (
                    <div key={k} className={`px-5 py-3 ${n < 2 ? "border-r border-white/15" : ""}`}>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">{k}</p>
                      <p className="display-n mt-1 text-xl md:text-2xl">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="flex items-center gap-1.5 border-t border-white/15 px-5 py-2.5 text-[12px] text-white/65">
                  <MapPin className="h-3.5 w-3.5" /> {s.location}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* story progress */}
        <div className="mt-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${slides.length}, 1fr)` }}>
          {slides.map((p, k) => (
            <button key={p.id} onClick={() => go(k)} className="group text-left" aria-label={`Show ${p.title}`}>
              <div className="h-[3px] overflow-hidden bg-white/20">
                {k === i ? (
                  <motion.div
                    key={`${i}-${paused}-${done}`}
                    className="h-full bg-[var(--accent)]"
                    initial={{ width: "0%" }}
                    animate={{ width: done && !paused ? "100%" : "0%" }}
                    transition={{ duration: done && !paused ? DURATION : 0, ease: "linear" }}
                  />
                ) : (
                  <div className={`h-full ${k < i ? "w-full bg-white/70" : "w-0"}`} />
                )}
              </div>
              <p className={`mt-2 hidden text-[11px] uppercase tracking-[0.12em] transition md:block ${k === i ? "text-white" : "text-white/45 group-hover:text-white/80"}`}>
                {p.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
